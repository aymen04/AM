import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fetchData() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  });

  try {
    // Fetch products
    const [products] = await pool.query(
      'SELECT id, name, price, category, images, description, stock, created_at FROM products ORDER BY created_at DESC'
    );

    // Process images
    products.forEach(row => {
      if (typeof row.images === 'string') {
        try {
          row.images = JSON.parse(row.images);
        } catch {
          row.images = [row.images];
        }
      }
    });

    // Fetch custom orders
    const [customOrders] = await pool.query('SELECT * FROM custom_orders ORDER BY created_at DESC');

    customOrders.forEach(row => {
      if (row.images) {
        try {
          row.images = JSON.parse(row.images);
        } catch {
          row.images = [];
        }
      }
    });

    console.log('Products:', JSON.stringify(products, null, 2));
    console.log('Custom Orders:', JSON.stringify(customOrders, null, 2));

  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    await pool.end();
  }
}

fetchData();
