# Team Task Allocation & Responsibilities Document: StockFlow

This document defines the complete breakdown of tasks, responsibilities, and specific files to be created and owned by each of the **7 group members** for the **StockFlow** Monorepo Inventory Management System.

---

## Team Overview & Workload Allocation Matrix

| Team Member | Primary Focus Area | Backend Components | Frontend Components & Pages |
|---|---|---|---|
| **1. Saranga** | Monorepo Setup & Core Backend Framework | Router, Database PDO, PSR-4 Autoloader, Front Controller, SQL Schema | Monorepo root scripts, base project structure setup |
| **2. Manuja** | Auth, RBAC & User Management | User Entity, Auth Service (HMAC), User Repo, Auth/Role Middlewares | `LoginPage.jsx`, `AdminUsersPage.jsx`, `AuthContext.jsx`, `ProtectedRoute.jsx` |
| **3. Ashan** | Product Core & Information Display | Product Entity, Product Repo (Listing, Search, Pagination, Soft Delete) | `LandingPage.jsx`, `InventoryPage.jsx` (Main Info Display), `Navbar.jsx`, `Sidebar.jsx` |
| **4. Tharindu** | Product Create/Edit & Validation Engine | Validator Engine, Product Service (Store/Update logic), Product Controller | `AddProductPage.jsx`, `EditProductPage.jsx`, `useForm.js` hook |
| **5. Dileepa** | Categories & Supplier Management | Category Entity, Category Repo, Category Service & Controller | `CategoriesPage.jsx`, `InventoryContext.jsx`, `Modal.jsx`, `ConfirmDialog.jsx` |
| **6. Sashika** | Staff Activity Portal & Stock Movements | StockLog Entity & Repo, ACID Transactional Stock Adjustment Engine | `StaffActivityPage.jsx` (Staff Portal), `StockAdjustModal.jsx` |
| **7. Pemila** | Dashboard Analytics, Reports & Settings | Dashboard Controller (KPI metrics), Report Controller, Audit Logs | `DashboardPage.jsx`, `ReportsPage.jsx`, `SettingsPage.jsx`, `Toast.jsx`, Recharts |

---

## Detailed Individual Responsibilities & File Creation Guide

### 1. Saranga — Monorepo Architecture & Backend Core Framework (Lead Infrastructure)

**Responsibilities**: Setup monorepo infrastructure, environment configuration, database tables, and core pure PHP OOP framework primitives.

**Files to Create & Code**:
1. **Monorepo Setup**:
   - `package.json` (Root scripts: `"dev"`, `"dev:frontend"`, `"dev:backend"`)
   - `docker-compose.yml` (PHP + MySQL + Vite environment setup)
   - `.gitignore` & `.env.example`
2. **Database Schema (`backend/database/`)**:
   - `backend/database/schema.sql` (Tables: `users`, `categories`, `products`, `stock_logs` with indexes and FK constraints)
   - `backend/database/seeders.sql` (Default admin & staff accounts, sample categories and products)
3. **Backend Core Framework (`backend/src/Core/`)**:
   - `backend/public/index.php` (Front Controller & global exception/error handlers)
   - `backend/public/.htaccess` (URL Rewriting to `index.php`)
   - `backend/src/Core/Autoloader.php` (PSR-4 autoloader fallback)
   - `backend/src/Core/Database.php` (PDO Singleton connection manager & transaction helpers)
   - `backend/src/Core/Router.php` (OOP Router with CORS preflight `OPTIONS` interceptor)
   - `backend/src/Core/Request.php` & `backend/src/Core/Response.php` (JSON API response builder)
   - `backend/src/Core/Middleware/CorsMiddleware.php`

---

### 2. Manuja — Authentication, RBAC & User Management (Admin Module)

**Responsibilities**: Build secure pure PHP authentication system (HMAC SHA-256 tokens), Role-Based Access Control middlewares, user management backend API, and Admin User management page.

**Files to Create & Code**:
1. **Backend Auth & User Subsystem**:
   - `backend/src/Models/User.php` (Domain entity with `password_hash` & role getters)
   - `backend/src/Repositories/UserRepositoryInterface.php` & `UserRepository.php`
   - `backend/src/Services/AuthService.php` (Pure PHP HMAC SHA-256 token generation, sign, verify)
   - `backend/src/Services/UserService.php` (User CRUD, password reset, status toggle)
   - `backend/src/Core/Middleware/AuthMiddleware.php` (Token verification)
   - `backend/src/Core/Middleware/RoleMiddleware.php` (Admin vs Staff role authorization)
   - `backend/src/Controllers/AuthController.php` (`login`, `register`, `me` endpoints)
   - `backend/src/Controllers/UserController.php` (`index`, `create`, `updateStatus`, `delete` endpoints)
2. **Frontend Auth & Admin UI**:
   - `frontend/src/context/AuthContext.jsx` (Token storage, login/logout, current user state)
   - `frontend/src/hooks/useAuth.js`
   - `frontend/src/components/ProtectedRoute.jsx` (Role-based route guard component)
   - `frontend/src/pages/LoginPage.jsx` (Page 2: Login & Register form with error handling)
   - `frontend/src/pages/AdminUsersPage.jsx` (Page 8: [ADMIN ONLY] User management table, role assign modal, active/inactive toggles)

---

### 3. Ashan — Product Core & Information Display Module

**Responsibilities**: Implement product domain entity, product repository queries (with soft delete, search, filter, pagination), landing page, and main inventory list page.

**Files to Create & Code**:
1. **Backend Product Listing & Query Engine**:
   - `backend/src/Models/Product.php` (Encapsulated entity with `JsonSerializable`)
   - `backend/src/Repositories/ProductRepositoryInterface.php`
   - `backend/src/Repositories/ProductRepository.php` (`findAll` with SQL search `LIKE`, category filter, status filter, `deleted_at IS NULL` soft delete filter, pagination limit/offset)
   - `backend/src/Controllers/ProductController.php` (`index` listing endpoint, `show` detail endpoint)
2. **Frontend Navigation & Information Display**:
   - `frontend/src/components/common/Header.jsx` (Top navbar with user profile dropdown & logout)
   - `frontend/src/components/common/Sidebar.jsx` (Responsive collapsible sidebar navigation)
   - `frontend/src/pages/LandingPage.jsx` (Page 1: Home / Landing hero section with Call-To-Action)
   - `frontend/src/pages/InventoryPage.jsx` (Page 4: Main Information Display page with search bar, category filter, stock status badges, pagination, view details modal, and delete trigger)

---

### 4. Tharindu — Product Add & Edit Modules with Validation Engine

**Responsibilities**: Develop server-side validation framework, product creation & update services, and responsive frontend Add/Edit product forms with client-side validation.

**Files to Create & Code**:
1. **Backend Validation & Creation/Update Services**:
   - `backend/src/Core/Validator.php` (Validation rules: `required`, `numeric`, `min`, `max`, `sku` uniqueness check in DB)
   - `backend/src/Services/ProductService.php` (Product creation validation, SKU duplication check, edit validation)
   - `backend/src/Controllers/ProductController.php` (`store` endpoint, `update` endpoint, `destroy` soft delete endpoint)
2. **Frontend Form Modules & Hooks**:
   - `frontend/src/hooks/useForm.js` (Form state & validation handling custom hook)
   - `frontend/src/pages/AddProductPage.jsx` (Page 5: Add Product page with SKU validation, price/cost calculator, category picker, image/unit input)
   - `frontend/src/pages/EditProductPage.jsx` (Page 6: Edit Product page pre-populated via API, change detection, real-time error messages)

---

### 5. Dileepa — Categories & Supplier Management Module

**Responsibilities**: Implement category entity, category repository, safe category deletion logic, inventory context state manager, and categories UI page.

**Files to Create & Code**:
1. **Backend Category Subsystem**:
   - `backend/src/Models/Category.php` (Entity model)
   - `backend/src/Repositories/CategoryRepositoryInterface.php` & `CategoryRepository.php`
   - `backend/src/Services/CategoryService.php` (CRUD logic, product count calculation per category, safe delete handling)
   - `backend/src/Controllers/CategoryController.php` (`index`, `store`, `update`, `destroy` endpoints)
2. **Frontend State & Category UI**:
   - `frontend/src/context/InventoryContext.jsx` (Centralized React context for global product list, category options, and filter states)
   - `frontend/src/pages/CategoriesPage.jsx` (Page 7: Categories list grid, add/edit modal, item count badges, delete confirmation)
   - `frontend/src/components/common/Modal.jsx` & `frontend/src/components/common/ConfirmDialog.jsx` (Reusable UI modal dialogs)

---

### 6. Sashika — Staff Activity Portal & Transactional Stock Movements

**Responsibilities**: Build transactional stock adjustment engine (`BEGIN TRANSACTION`, `COMMIT`, `ROLLBACK`), stock movement log entity/repository, and dedicated Staff Activity portal.

**Files to Create & Code**:
1. **Backend Stock Movement Engine**:
   - `backend/src/Models/StockLog.php` (Stock movement log entity: `IN`, `OUT`, `ADJUSTMENT`)
   - `backend/src/Repositories/StockLogRepository.php` (Insert log, query movement history by product/user/date)
   - `backend/src/Services/ProductService.php` (Extend with `adjustStock()` using **ACID Transactions** `$pdo->beginTransaction()` and row locks `FOR UPDATE`)
   - `backend/src/Controllers/StaffActivityController.php` (`logMovement`, `getStaffLogs` endpoints)
2. **Frontend Staff Activity Portal**:
   - `frontend/src/pages/StaffActivityPage.jsx` (Page 9: [STAFF & ADMIN] Dedicated Staff portal for fast Stock IN / Stock OUT entries, personal activity log feed)
   - `frontend/src/components/inventory/StockAdjustModal.jsx` (Quick stock adjustment modal with quick increment/decrement buttons)

---

### 7. Pemila — Dashboard Analytics, Reports & System Settings

**Responsibilities**: Build dashboard aggregation API endpoints, financial stock valuation reporting, low-stock warning thresholds, toast notification system, and analytics UI pages with Recharts.

**Files to Create & Code**:
1. **Backend Analytics & Reporting API**:
   - `backend/src/Controllers/DashboardController.php` (`getStats` endpoint: total inventory valuation, total products, low-stock count, category stock distribution)
   - `backend/src/Controllers/ReportController.php` (`getReports` endpoint: stock valuation summary, low stock warning list, exportable report data)
   - System settings configuration handler for low-stock alert thresholds.
2. **Frontend Analytics, Reports & Settings UI**:
   - `frontend/src/pages/DashboardPage.jsx` (Page 3: Role-differentiated dashboard featuring KPI overview cards, stock distribution pie/bar charts via `recharts`, low-stock warning alert panel)
   - `frontend/src/pages/ReportsPage.jsx` (Page 10: Comprehensive analytics reports table, stock movement timeline, valuation export tools)
   - `frontend/src/pages/SettingsPage.jsx` (Page 8: Low-stock threshold settings, company profile details, system health stats)
   - `frontend/src/components/common/Toast.jsx` (Global notification toast component)

---

## Integration Workflow & Team Coordination Rules

1. **API Contract Alignment**:
   - All backend controllers must return JSON formatted via `Response::json($success, $data, $message, $statusCode)`.
   - All frontend API calls must use `frontend/src/services/api.js` with Bearer token header from `AuthContext`.

2. **Git Feature Branching Workflow**:
   - `main`: Production-ready code.
   - `development`: Active integration branch.
   - Feature branches: `feature/saranga-core`, `feature/manuja-auth`, `feature/ashan-inventory`, `feature/tharindu-products`, `feature/dileepa-categories`, `feature/sashika-stock-logs`, `feature/pemila-dashboard`.

3. **Database Schema Governance**:
   - Database schema modifications must be coordinated with **Saranga** to update `backend/database/schema.sql`.
