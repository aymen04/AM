-- Create database
CREATE DATABASE IF NOT EXISTS am_database;

-- Use the database
USE am_database;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  category VARCHAR(100) DEFAULT NULL,
  image LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO products (name, price, category, image) VALUES
('Collier Améthyste', '289€', 'Collier', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop'),
('Bracelet Quartz Rose', '179€', 'Bracelet', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop'),
('Bague Lapis Lazuli', '229€', 'Bague', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'),
('Pendentif Cristal', '149€', 'Pendentifs', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop');
