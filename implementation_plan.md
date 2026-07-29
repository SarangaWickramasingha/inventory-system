# System Architecture Plan: Monorepo Setup with Pure PHP OOP Backend, RBAC & React Tailwind Frontend

This document defines the architectural specification and implementation strategy for building **StockFlow** (Inventory Management System) as a Monorepo with **Role-Based Access Control (RBAC)** for **Admin** and **Staff (User)** roles.

---

## 1. Architectural & Logical Verification Audit

Following a deep logic audit of the backend, database, and frontend interaction models, the following **7 critical logical safeguards** are integrated into the design:

| Issue / Challenge | Logical Risk | Architecture Solution & Safeguard |
|---|---|---|
| **1. Stock Movements Data Integrity** | Updating product stock without logging or partial failure causes stock discrepancy. | **ACID Transactions**: `ProductService` wraps product quantity updates and `stock_logs` inserts in MySQL `beginTransaction()`, `commit()`, and `rollBack()` blocks. |
| **2. Category & Product Deletion Safety** | Deleting a category with `CASCADE` accidentally wipes out active inventory items. | **Safe Foreign Key Handling**: Use `category_id INT NULL` with `ON DELETE SET NULL` or prevent category deletion if products exist (`ON DELETE RESTRICT`). |
| **3. Inventory Audit Trail Integrity** | Hard deleting a product breaks historical reporting and financial logs. | **Soft Delete Pattern**: `products` table includes `deleted_at TIMESTAMP NULL`. Queries filter active items (`WHERE deleted_at IS NULL`), preserving audit records. |
| **4. Stateless Auth in Pure PHP** | Using 3rd-party JWT libraries violates "Pure PHP" requirement or introduces heavy dependencies. | **Pure PHP HMAC-SHA256 Tokens**: Built-in `AuthService` generates signed Base64-URL tokens using PHP's native `hash_hmac('sha256', ...)`. No vendor packages needed. |
| **5. Cross-Origin (CORS) Preflight Handling** | React (port 5173) requests to PHP API (port 8000) fail on browser `OPTIONS` preflight checks. | **Router Preflight Middleware**: `Core\Router` intercepts HTTP `OPTIONS` requests at entry, instantly returning `200 OK` with CORS headers (`Access-Control-Allow-*`). |
| **6. Fatal Error JSON Protection** | Uncaught PHP errors/warnings output raw HTML/text into JSON API responses, breaking React JSON parsing. | **Global Exception & Error Handler**: `public/index.php` registers `set_exception_handler` and `set_error_handler` to convert PHP notices/errors into clean JSON `{ "success": false, "message": "..." }` responses with HTTP status codes. |
| **7. PSR-4 Autoloading Compatibility** | Environment might not execute `composer dump-autoload`. | **Fallback PSR-4 Autoloader**: `Core\Autoloader.php` uses `spl_autoload_register()` to auto-load `StockFlow\Backend\*` namespaces directly from `src/` if Composer autoload is absent. |

---

## 2. Monorepo Directory Structure

```
stockflow/
├── apps/
│   ├── frontend/                 # React JS + Tailwind CSS (Vite)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/       # Reusable UI (Navbar, Sidebar, Modal, Card, Table, ProtectedRoute, Toast)
│   │   │   ├── context/          # AuthContext (HMAC Token, Role) & InventoryContext
│   │   │   ├── hooks/            # Custom React hooks (useAuth, useForm, useInventory)
│   │   │   ├── pages/            # 10 Core Pages
│   │   │   │   ├── LandingPage.jsx         # 1. Home / Landing page
│   │   │   │   ├── LoginPage.jsx           # 2. Authentication (Login / Register)
│   │   │   │   ├── DashboardPage.jsx       # 3. Role-based Dashboard (Admin vs Staff)
│   │   │   │   ├── InventoryPage.jsx       # 4. Information Display (List, Search, Filter, Soft Delete)
│   │   │   │   ├── AddProductPage.jsx      # 5. Add Product Form with Validation
│   │   │   │   ├── EditProductPage.jsx     # 6. Edit Product Form with Validation
│   │   │   │   ├── CategoriesPage.jsx      # 7. Category & Supplier Management
│   │   │   │   ├── AdminUsersPage.jsx      # 8. [ADMIN ONLY] User & Staff Management
│   │   │   │   ├── StaffActivityPage.jsx   # 9. [STAFF & ADMIN] Stock In/Out & Daily Activity Logs
│   │   │   │   └── ReportsPage.jsx         # 10. Reports & Audit Trail
│   │   │   ├── services/         # API Client service with Auth Headers
│   │   │   ├── utils/            # Formatters, helpers, RBAC permission checkers
│   │   │   ├── App.jsx
│   │   │   ├── index.css
│   │   │   └── main.jsx
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── backend/                  # Pure PHP OOP RESTful API
│       ├── config/               # DB connection & app constants
│       │   ├── database.php
│       │   └── app.php
│       ├── public/               # Web root (Single entry point)
│       │   ├── index.php         # Front Controller & Exception Handler
│       │   └── .htaccess
│       ├── src/                  # Core OOP Source Code (PSR-4)
│       │   ├── Core/             # Framework primitives
│       │   │   ├── Autoloader.php    # Native PSR-4 fallback autoloader
│       │   │   ├── Database.php      # Singleton PDO Database instance & Transaction manager
│       │   │   ├── Router.php        # Custom OOP HTTP Router + OPTIONS preflight interceptor
│       │   │   ├── Request.php       # Request abstraction
│       │   │   ├── Response.php      # JSON Response & Status formatters
│       │   │   ├── Validator.php     # Server-Side Input Validation Engine
│       │   │   └── Middleware/
│       │   │       ├── CorsMiddleware.php
│       │   │       ├── AuthMiddleware.php # HMAC Token Verification
│       │   │       └── RoleMiddleware.php # Admin vs Staff RBAC Enforcement
│       │   ├── Controllers/      # Presentation Layer
│       │   │   ├── BaseController.php
│       │   │   ├── AuthController.php
│       │   │   ├── UserController.php    # Admin User management
│       │   │   ├── ProductController.php
│       │   │   ├── CategoryController.php
│       │   │   ├── StaffActivityController.php
│       │   │   └── DashboardController.php
│       │   ├── Services/         # Business Logic Layer (ACID Transactions)
│       │   │   ├── AuthService.php       # HMAC SHA-256 token sign & verify
│       │   │   ├── UserService.php       # User creation & role management
│       │   │   ├── ProductService.php    # Inventory transactional stock adjustments
│       │   │   └── CategoryService.php
│       │   ├── Repositories/     # Data Access Layer (DAO / Prepared Statements)
│       │   │   ├── UserRepositoryInterface.php
│       │   │   ├── UserRepository.php
│       │   │   ├── ProductRepositoryInterface.php
│       │   │   └── ProductRepository.php
│       │   └── Models/           # Encapsulated Domain Entities
│       │       ├── User.php
│       │       ├── Product.php
│       │       └── Category.php
│       └── composer.json
│
├── database/                     # Database Schema & Seeds
│   ├── schema.sql                # MySQL tables with foreign keys & indexes
│   └── seeders.sql               # Default Admin & Staff user accounts
├── package.json                  # Monorepo scripts (`npm run dev`)
└── README.md
```

---

## 3. Database Schema (Logical Verification Refinements)

```sql
CREATE DATABASE IF NOT EXISTS stockflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE stockflow_db;

-- 1. Users Table (Admin & Staff Accounts)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Products Table (Soft Delete + Safe Foreign Keys)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category_id INT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL DEFAULT 0,
    min_stock_alert INT NOT NULL DEFAULT 5,
    unit VARCHAR(20) DEFAULT 'pcs',
    description TEXT NULL,
    status ENUM('in_stock', 'low_stock', 'out_of_stock') DEFAULT 'in_stock',
    deleted_at TIMESTAMP NULL DEFAULT NULL, -- Soft Delete
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_sku (sku),
    INDEX idx_name (name),
    INDEX idx_category (category_id),
    INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB;

-- 4. Stock Movement Audit Logs (Transactional Tracking)
CREATE TABLE IF NOT EXISTS stock_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NULL,
    type ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
    quantity_changed INT NOT NULL,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product (product_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB;
```

---

## 4. Logical Workflow: Product Stock Update (ACID Transaction)

Below is the step-by-step logical execution flow inside `ProductService::updateStock()`:

```
[Client Request: POST /api/v1/staff/stock-movement]
                       │
                       ▼
            [AuthMiddleware & RoleMiddleware]
                       │ (Valid Token & Staff/Admin Permission)
                       ▼
            [ProductController::adjustStock()]
                       │ (Sanitizes & Validates Input)
                       ▼
            [ProductService::adjustStock()]
                       │
                       ├─► 1. $db->beginTransaction()
                       │
                       ├─► 2. Lock Product Row FOR UPDATE:
                       │      SELECT quantity FROM products WHERE id = :id FOR UPDATE
                       │
                       ├─► 3. Calculate new quantity ($newQty = $currentQty + $changeQty)
                       │      (Validation: Reject if $newQty < 0)
                       │
                       ├─► 4. UPDATE products SET quantity = $newQty, status = ... WHERE id = :id
                       │
                       ├─► 5. INSERT INTO stock_logs (product_id, user_id, type, quantity_changed, ...)
                       │
                       ├─► 6. $db->commit()
                       │
                       ▼
            [Return JSON 200 Success Response]

            (If any error occurs at step 2-5: $db->rollBack() & return JSON Error 400/500)
```

---

## 5. User Review Required

> [!TIP]
> **Logical Audit Complete**: The architectural plan now includes ACID database transactions, soft-deletes to protect audit logs, native HMAC token authentication, CORS preflight handling, and global exception handlers to guarantee robust execution.

---

## 6. Implementation Readiness

The plan is logically verified and ready to execute upon your approval.
