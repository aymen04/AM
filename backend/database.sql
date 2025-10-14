-- Create database
CREATE DATABASE IF NOT EXISTS am_database;

-- Use the database
USE am_database;

-- Drop existing table if exists
DROP TABLE IF EXISTS products;

-- Create products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  category VARCHAR(100) DEFAULT NULL,
  images JSON NOT NULL,
  description TEXT DEFAULT NULL,
  stock INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_requests table
CREATE TABLE IF NOT EXISTS contact_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  image_path VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create custom_orders table
CREATE TABLE IF NOT EXISTS custom_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  project_type VARCHAR(100) NOT NULL,
  budget VARCHAR(50) DEFAULT NULL,
  description TEXT NOT NULL,
  inspiration TEXT DEFAULT NULL,
  deadline DATE DEFAULT NULL,
  images JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO products (name, price, category, images, description) VALUES
('Collier Améthyste', '289€', 'collier', JSON_ARRAY('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop'), 'Magnifique collier en améthyste naturelle'),
('Bracelet Quartz Rose', '179€', 'bracelet', JSON_ARRAY('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop'), 'Bracelet élégant en quartz rose'),
('Bague Lapis Lazuli', '229€', 'bague', JSON_ARRAY('https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'), 'Bague en lapis lazuli de qualité supérieure'),
('Pendentif Cristal', '149€', 'pendentif', JSON_ARRAY('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'), 'Pendentif en cristal pur');
