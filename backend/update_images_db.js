import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// ----------------------
// Config MySQL
// ----------------------
const pool = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'am_database',
  port: 8889
});

// ----------------------
// Dossier des images
// ----------------------
const uploadsDir = path.join(process.cwd(), 'uploads');

// ----------------------
// Récupérer tous les produits
// ----------------------
const [rows] = await pool.query('SELECT id, images FROM products');

for (const row of rows) {
  if (!row.images) continue;

  let imagesArray = [];

  try {
    // Si la colonne est déjà JSON, parse
    imagesArray = JSON.parse(row.images);
  } catch {
    // Sinon c'est probablement du Base64
    let imgData = row.images;

    if (Buffer.isBuffer(imgData)) imgData = imgData.toString();
    if (typeof imgData !== 'string') imgData = String(imgData);

    imgData = imgData.trim().replace(/\r?\n/g, '');

    // Regex globale pour récupérer toutes les images Base64
    const regex = /data:image\/\w+;base64,[A-Za-z0-9+/=]+/g;
    const matches = imgData.match(regex);

    if (!matches || matches.length === 0) continue;

    // On récupère le nom de fichier correspondant dans uploads/
    imagesArray = matches.map((_, idx) => `${row.id}_${idx}.jpg`);
  }

  // Mettre à jour la BDD avec le tableau JSON des noms de fichiers
  await pool.query('UPDATE products SET images = ? WHERE id = ?', [
    JSON.stringify(imagesArray),
    row.id
  ]);

  console.log(`Produit ${row.id} mis à jour avec ${imagesArray.length} image(s)`);
}

console.log('✅ Toutes les entrées de la BDD ont été mises à jour.');
