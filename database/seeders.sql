-- ==========================================
-- StockFlow Inventory Management System
-- Database Seed Data (Users, Categories, Products, Stock Logs)
-- Owner: Saranga (Lead Infrastructure)
-- ==========================================

USE stockflow_db;

-- 1. Insert Initial Users
-- Password for admin (admin@stockflow.com): admin123
-- Password for staff (john.doe@stockflow.com / alice.smith@stockflow.com): staff123
INSERT INTO users (id, username, email, password_hash, full_name, role, status, last_login) VALUES
(1, 'admin', 'admin@stockflow.com', '$2y$10$OsGiPSj0jKjq2V4RXkMPMOqlUGeNdOtL7QVa8vPpcg/FpejMbVIbi', 'Alex Mercer', 'admin', 'active', NOW()),
(2, 'johndoe', 'john.doe@stockflow.com', '$2y$10$4F7Ft9f0e4Q6sxp37N85Zuiv73aNmbt1w4irknXty1KHw3agVi55W', 'John Doe', 'staff', 'active', NOW()),
(3, 'alicesmith', 'alice.smith@stockflow.com', '$2y$10$4F7Ft9f0e4Q6sxp37N85Zuiv73aNmbt1w4irknXty1KHw3agVi55W', 'Alice Smith', 'staff', 'active', NOW())
ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    full_name = VALUES(full_name);

-- 2. Insert Initial Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Electronics', 'Consumer tech, gadgets, and accessories.'),
(2, 'Furniture', 'Office and home furnishings.'),
(3, 'Apparel', 'Clothing, shoes, and wearable items.'),
(4, 'Home & Garden', 'Home decor, outdoor equipment, and kitchenware.'),
(5, 'Office Supplies', 'Paper, stationery, desk organizers, and craft supplies.')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 3. Insert Initial Products
INSERT INTO products (id, sku, name, category_id, price, cost_price, quantity, min_stock_alert, unit, description, status) VALUES
(1, 'SKU-QNC-001', 'Quantum Noise-Cancelling Headphones', 1, 199.99, 85.00, 145, 50, 'pcs', 'High-precision optical sensor with adjustable DPI. Ergonomic design reduces wrist strain during prolonged use.', 'in_stock'),
(2, 'SKU-HSB-042', 'HydroSmart Stainless Bottle', 4, 34.99, 15.50, 12, 30, 'pcs', 'Vacuum insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours.', 'low_stock'),
(3, 'FUR-CH-001', 'ErgoMesh Office Chair', 2, 249.00, 110.00, 0, 15, 'pcs', 'Breathable mesh back ergonomic chair with lumbar support, adjustable headrest, and 3D armrests.', 'out_of_stock'),
(4, 'SKU-ECT-NAV-M', 'Essential Cotton T-Shirt', 3, 18.00, 4.20, 890, 100, 'pcs', '100% organic combed cotton t-shirt with premium stitching and relaxed fit.', 'in_stock'),
(5, 'SKU-WM902', 'Ergonomic Wireless Mouse Pro', 1, 59.99, 24.50, 142, 40, 'pcs', 'High-precision optical sensor with adjustable DPI. Ergonomic design reduces wrist strain.', 'in_stock'),
(6, 'EL-201-X', 'USB-C Hub (7-in-1)', 1, 42.50, 18.00, 5, 40, 'pcs', 'Multi-port USB-C adapter with 4K HDMI, 100W Power Delivery, SD/TF card reader, and 3x USB 3.0 ports.', 'low_stock')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 4. Insert Initial Stock Audit Logs
INSERT INTO stock_logs (id, product_id, user_id, type, quantity_changed, previous_quantity, new_quantity, notes) VALUES
(1, 1, 1, 'IN', 100, 45, 145, 'Restocked from SoundWave Global shipment #SW-902'),
(2, 6, 2, 'OUT', 35, 40, 5, 'Issued items to main engineering workspace'),
(3, 3, 3, 'ADJUSTMENT', -15, 15, 0, 'Inventory reconciliation - 15 damaged in warehouse transit')
ON DUPLICATE KEY UPDATE notes = VALUES(notes);
