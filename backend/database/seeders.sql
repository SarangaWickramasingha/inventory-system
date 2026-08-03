-- ==========================================
-- StockFlow Inventory Management System
-- Database Seed Data (Users, Categories, Products, Stock Logs)
-- IT Industry Hardware Data
-- Owner: Saranga (Lead Infrastructure)
-- ==========================================

USE stockflow_db;

-- Clear previous tables to ensure clean IT Hardware seed data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE stock_logs;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
SET FOREIGN_KEY_CHECKS = 1;

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

-- 2. Insert IT Hardware Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Computers & Laptops', 'Enterprise laptops, desktop workstations, developer rigs, and mini PCs.'),
(2, 'Servers & Storage', 'Rackmount servers, NAS storage arrays, enterprise NVMe SSDs, and SAN hardware.'),
(3, 'Networking & Telecom', 'Managed Gigabit switches, enterprise routers, Wi-Fi 6 APs, and patch panels.'),
(4, 'Monitors & Displays', '4K UltraHD workstations, dual monitor arms, and conference room displays.'),
(5, 'Peripherals & Components', 'Mechanical keyboards, ergonomic mice, USB-C docks, webcams, GPUs.'),
(6, 'Power & Infrastructure', 'Smart UPS battery backups, PDU power strips, server racks, cooling units.')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);

-- 3. Insert IT Hardware Products with Generated Image URLs
INSERT INTO products (id, sku, name, category_id, price, cost_price, quantity, min_stock_alert, unit, description, image_url, status) VALUES
(1, 'SKU-MBP-16M3', 'MacBook Pro 16" (M3 Max, 36GB, 1TB)', 1, 3499.00, 2850.00, 45, 15, 'pcs', '16-inch Liquid Retina XDR display, M3 Max 14-core CPU, 30-core GPU, 36GB Unified Memory, 1TB SSD storage.', 'http://localhost:8000/uploads/products/prod_1.png', 'in_stock'),
(2, 'SKU-DEL-R760', 'Dell PowerEdge R760 Rack Server', 2, 5890.00, 4200.00, 8, 10, 'pcs', '2U dual-socket rack server powered by 4th Gen Intel Xeon Scalable processors, 128GB DDR5 RAM, 4x 1.92TB NVMe SSDs.', 'http://localhost:8000/uploads/products/prod_2.png', 'low_stock'),
(3, 'SKU-CSC-C9300', 'Cisco Catalyst 9300 48-Port Switch', 3, 3200.00, 2100.00, 0, 5, 'pcs', 'Enterprise-grade 48-port PoE+ stackable switch with 4x 10G uplink module slots and Network Advantage license.', 'http://localhost:8000/uploads/products/prod_3.png', 'out_of_stock'),
(4, 'SKU-LG-32UN880', 'LG UltraFine 32" 4K Ergo Monitor', 4, 699.00, 480.00, 120, 25, 'pcs', '32-inch UHD 4K IPS display with Ergo Arm stand, USB-C 60W Power Delivery, DCI-P3 95% color gamut.', 'http://localhost:8000/uploads/products/prod_4.png', 'in_stock'),
(5, 'SKU-WM902', 'Ergonomic Wireless Mouse Pro', 5, 59.99, 24.50, 142, 40, 'pcs', 'High-precision optical sensor with adjustable DPI. Ergonomic design reduces wrist strain during prolonged use.', 'http://localhost:8000/uploads/products/prod_5.png', 'in_stock'),
(6, 'EL-201-X', 'USB-C Hub (7-in-1)', 5, 42.50, 18.00, 5, 40, 'pcs', 'Multi-port USB-C adapter with 4K HDMI, 100W Power Delivery, SD/TF card reader, and 3x USB 3.0 ports.', 'http://localhost:8000/uploads/products/prod_6.png', 'low_stock'),
(7, 'SKU-APC-SU1500', 'APC Smart-UPS 1500VA LCD Rackmount', 6, 599.00, 380.00, 14, 10, 'pcs', '1500VA / 1000W Line-Interactive 2U Rackmount Uninterruptible Power Supply with LCD display and SmartConnect port.', 'http://localhost:8000/uploads/products/prod_7.png', 'in_stock')
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), image_url = VALUES(image_url);

-- 4. Insert Initial Stock Audit Logs
INSERT INTO stock_logs (id, product_id, user_id, type, quantity_changed, previous_quantity, new_quantity, notes) VALUES
(1, 1, 1, 'IN', 45, 0, 45, 'Initial stock import for MacBook Pro 16"'),
(2, 2, 1, 'IN', 8, 0, 8, 'Initial stock import for Dell PowerEdge R760'),
(3, 3, 1, 'OUT', 5, 5, 0, 'Depleted inventory for Cisco Catalyst 9300'),
(4, 4, 1, 'IN', 120, 0, 120, 'Initial stock import for LG UltraFine 32"'),
(5, 5, 1, 'IN', 142, 0, 142, 'Initial stock import for Ergonomic Wireless Mouse Pro'),
(6, 6, 1, 'IN', 5, 0, 5, 'Initial stock import for USB-C Hub (7-in-1)'),
(7, 7, 1, 'IN', 14, 0, 14, 'Initial stock import for APC Smart-UPS 1500VA')
ON DUPLICATE KEY UPDATE notes = VALUES(notes);
