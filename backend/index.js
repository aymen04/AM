console.log('PORT:', process.env.PORT);
console.log('MYSQL_URL:', process.env.MYSQL_URL);

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

console.log('Starting server...');

// Initialize Telegram Bot
const botToken = '7850697198:AAHascQf-eyxVbXkledm4PuWvBFrElenu1g';
const chatId = '907009445';
const bot = new TelegramBot(botToken, { polling: false });

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

let pool;
try {
  pool = mysql.createPool(process.env.MYSQL_URL);
  console.log('Database pool created successfully');
} catch (error) {
  console.error('Error creating database pool:', error);
  process.exit(1);
}

// Get all products
app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, price, category, images, description, stock, created_at FROM products');
    rows.forEach(row => {
      if (typeof row.images === 'string') {
        if (row.images.startsWith('[')) {
          row.images = JSON.parse(row.images);
        } else {
          // Old format: single image URL
          row.images = [row.images];
        }
      }
    });
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/products', async (req, res) => {
  const { name, price, images, category, description, stock } = req.body;
  if (!name || !price || !images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
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

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, images, category, description, stock } = req.body;
  if (!name || !price || !images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
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

// Delete a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  console.log('DELETE request for product id:', id);
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    console.log('DELETE result:', result);
    if (result.affectedRows > 0) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Contact form endpoint
app.post('/contact', upload.single('image'), async (req, res) => {
  try {
    const { prenom, nom, telephone, description } = req.body;
    const imagePath = req.file ? req.file.path : null;

    if (!prenom || !nom || !telephone || !description) {
      return res.status(400).json({ error: 'Tous les champs requis doivent être remplis' });
    }

    const [result] = await pool.query(
      'INSERT INTO contact_requests (prenom, nom, telephone, description, image_path) VALUES (?, ?, ?, ?, ?)',
      [prenom, nom, telephone, description, imagePath]
    );

    res.json({
      message: 'Demande de contact envoyée avec succès',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du formulaire de contact:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Custom orders endpoint
app.post('/custom-orders', upload.array('images', 10), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      projectType,
      budget,
      description,
      inspiration,
      deadline
    } = req.body;

    if (!name || !email || !projectType || !description) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Handle uploaded images
    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    const [result] = await pool.query(
      'INSERT INTO custom_orders (name, email, phone, project_type, budget, description, inspiration, deadline, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, projectType, budget, description, inspiration, deadline, JSON.stringify(imagePaths)]
    );

    // Send Telegram notification
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
🖼️ Images: ${imagePaths.length > 0 ? `${imagePaths.length} image(s) uploadée(s)` : 'Aucune'}

ID Commande: ${result.insertId}
    `;

    try {
      await bot.sendMessage(chatId, message);

      // Send images if any
      if (imagePaths.length > 0) {
        for (const imagePath of imagePaths) {
          try {
            await bot.sendPhoto(chatId, imagePath, {
              caption: `Image pour la commande #${result.insertId}`
            });
          } catch (imageError) {
            console.error('Erreur lors de l\'envoi de l\'image:', imageError);
          }
        }
      }

      console.log('Notification Telegram envoyée avec succès');
    } catch (telegramError) {
      console.error('Erreur lors de l\'envoi de la notification Telegram:', telegramError);
      // Ne pas échouer la requête pour autant
    }

    res.json({
      message: 'Demande de création personnalisée envoyée avec succès',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la commande personnalisée:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all custom orders
app.get('/custom-orders', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM custom_orders ORDER BY created_at DESC');
    // Process images field to return relative paths
    rows.forEach(row => {
      if (row.images) {
        try {
          const images = JSON.parse(row.images);
          // Convert absolute paths to relative paths for frontend
          row.images = JSON.stringify(images.map(img => path.basename(img)));
        } catch (error) {
          console.error('Erreur lors du parsing des images:', error);
          row.images = JSON.stringify([]);
        }
      }
    });
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete a custom order
app.delete('/custom-orders/:id', async (req, res) => {
  const { id } = req.params;
  console.log('DELETE request for custom order id:', id);
  try {
    const [result] = await pool.query('DELETE FROM custom_orders WHERE id = ?', [id]);
    console.log('DELETE result for custom order:', result);
    if (result.affectedRows > 0) {
      res.json({ message: 'Commande supprimée avec succès' });
    } else {
      res.status(404).json({ error: 'Commande non trouvée' });
    }
  } catch (error) {
    console.error('DELETE error for custom order:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
