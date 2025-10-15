import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

console.log('PORT:', process.env.PORT);
console.log('MYSQL_URL:', process.env.MYSQL_URL);

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      'https://am-beryl.vercel.app',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Configure multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  },
});

// Database pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

// Telegram Bot
const botToken = '7850697198:AAHascQf-eyxVbXkledm4PuWvBFrElenu1g';
const chatId = '907009445';
const bot = new TelegramBot(botToken, { polling: false });

// -------------------- PRODUCTS --------------------

// Get all products
app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, price, category, images, description, stock, created_at FROM products'
    );

    rows.forEach(row => {
      if (typeof row.images === 'string') {
        let imagesArray = [];
        try {
          imagesArray = JSON.parse(row.images);
        } catch {
          imagesArray = [row.images];
        }

        row.images = imagesArray.map(base64String => {
          if (base64String.startsWith('data:image')) return base64String;
          return `data:image/jpeg;base64,${base64String}`;
        });
      }
    });

    res.json(rows);
  } catch (error) {
    console.error('Erreur récupération produits :', error);
    res.status(500).json({ error: 'Database error' });
  }
});


// Create product
app.post('/products', async (req, res) => {
  const { name, price, images, category, description, stock } = req.body;
  if (!name || !price || !images || !Array.isArray(images))
    return res.status(400).json({ error: 'Missing required fields' });

  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, price, images, category, description, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, JSON.stringify(images), category || null, description || null, stock || null]
    );
    res.json({ id: result.insertId, name, price, images, category, description, stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update product
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, images, category, description, stock } = req.body;
  if (!name || !price || !images || !Array.isArray(images))
    return res.status(400).json({ error: 'Missing required fields' });

  try {
    await pool.query(
      'UPDATE products SET name = ?, price = ?, images = ?, category = ?, description = ?, stock = ? WHERE id = ?',
      [name, price, JSON.stringify(images), category || null, description || null, stock || null, id]
    );
    res.json({ id, name, price, images, category, description, stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows > 0) res.json({ message: 'Product deleted' });
    else res.status(404).json({ error: 'Product not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// -------------------- CONTACT --------------------
app.post('/contact', upload.single('image'), async (req, res) => {
  try {
    const { prenom, nom, telephone, description } = req.body;
    const imagePath = req.file ? req.file.path : null;

    if (!prenom || !nom || !telephone || !description)
      return res.status(400).json({ error: 'Tous les champs requis doivent être remplis' });

    const [result] = await pool.query(
      'INSERT INTO contact_requests (prenom, nom, telephone, description, image_path) VALUES (?, ?, ?, ?, ?)',
      [prenom, nom, telephone, description, imagePath]
    );

    res.json({ message: 'Demande de contact envoyée avec succès', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// -------------------- CUSTOM ORDERS --------------------
app.post('/custom-orders', upload.array('images', 10), async (req, res) => {
  try {
    const { name, email, phone, projectType, budget, description, inspiration, deadline } = req.body;
    if (!name || !email || !projectType || !description)
      return res.status(400).json({ error: 'Champs requis manquants' });

    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    const [result] = await pool.query(
      'INSERT INTO custom_orders (name, email, phone, project_type, budget, description, inspiration, deadline, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, projectType, budget, description, inspiration, deadline, JSON.stringify(imagePaths)]
    );

    // Telegram notification
    const message = `
🔔 Nouvelle commande personnalisée !
👤 Nom: ${name}
📧 Email: ${email}
📱 Téléphone: ${phone || 'Non fourni'}
🎨 Type de projet: ${projectType}
💰 Budget: ${budget || 'Non spécifié'}
📝 Description: ${description}
💡 Inspiration: ${inspiration || 'Aucune'}
⏰ Délai souhaité: ${deadline || 'Non spécifié'}
🖼️ Images: ${imagePaths.length > 0 ? `${imagePaths.length} image(s)` : 'Aucune'}
ID Commande: ${result.insertId}
    `;
    try {
      await bot.sendMessage(chatId, message);
      for (const imagePath of imagePaths) {
        try { await bot.sendPhoto(chatId, imagePath, { caption: `Commande #${result.insertId}` }); }
        catch (err) { console.error('Erreur Telegram image:', err); }
      }
    } catch (err) { console.error('Erreur Telegram:', err); }

    res.json({ message: 'Commande personnalisée envoyée', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/custom-orders', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM custom_orders ORDER BY created_at DESC');
    rows.forEach(row => {
      if (row.images) {
        try {
          const images = JSON.parse(row.images);
          row.images = images.map(img => `https://am-wniz.onrender.com/uploads/${path.basename(img)}`);
        } catch {
          row.images = [];
        }
      }
    });
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/custom-orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM custom_orders WHERE id = ?', [id]);
    if (result.affectedRows > 0) res.json({ message: 'Commande supprimée' });
    else res.status(404).json({ error: 'Commande non trouvée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// -------------------- START SERVER --------------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
