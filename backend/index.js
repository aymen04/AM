import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/products', async (req, res) => {
  const { name, price, image, category, description } = req.body;
  if (!name || !price || !image) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, price, image, category, description) VALUES (?, ?, ?, ?, ?)',
      [name, price, image, category || null, description || null]
    );
    res.json({ id: result.insertId, name, price, image, category, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, image, category, description } = req.body;
  if (!name || !price || !image) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await pool.query(
      'UPDATE products SET name = ?, price = ?, image = ?, category = ?, description = ? WHERE id = ?',
      [name, price, image, category || null, description || null, id]
    );
    res.json({ id, name, price, image, category, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
