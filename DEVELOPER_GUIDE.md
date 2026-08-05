# StockFlow Developer Onboarding & Architecture Guide

Welcome to the **StockFlow** engineering team! This comprehensive guide provides new developers with everything needed to understand the codebase architecture, state management patterns, RBAC security rules, and development workflows.

---

## 🏛️ System Architecture Overview

StockFlow is built as a modern, decoupled web application:
- **Frontend**: A fast React 18 Single Page Application (SPA) bundled with Vite 5, styled with Tailwind CSS, using Lucide Icons and Recharts analytics.
- **Backend**: A lightweight Pure PHP 8 OOP RESTful API with MySQL database persistence.
- **State Architecture**: Centralized React Context API (`AuthContext` and `InventoryContext`) backed by synchronized `localStorage` cache fallbacks for offline-ready performance.

---

## 📂 Codebase Directory Structure

```text
inventory-system-frontend/
├── frontend/                     # React SPA Frontend Application
│   ├── src/
│   │   ├── components/           # Reusable UI Component Library
│   │   │   ├── categories/       # Category cards and modals (CategoryCard.jsx, CreateCategoryModal.jsx)
│   │   │   ├── common/           # Navigation shell (Header.jsx, Sidebar.jsx), Badges, ConfirmModal.jsx
│   │   │   ├── dashboard/        # Stat Cards, Category Bar Charts, Activity Feeds, Task Checklists
│   │   │   ├── inventory/        # Product Table, Filters, Stock Adjustment Modals
│   │   │   ├── landing/          # Hero, Navbar, Public Content Modals
│   │   │   ├── reports/          # Report KPIs, Valuation Charts, Stock Movement Timelines
│   │   │   └── settings/         # Threshold Settings, Company Profile Cards
│   │   ├── context/              # Global React Contexts
│   │   │   ├── AuthContext.jsx   # Authentication, RBAC, Pending Approvals, User Database
│   │   │   └── InventoryContext.jsx # Products, Categories, Stock Movements, Search State
│   │   ├── pages/                # Standalone Application Page Views
│   │   │   ├── LandingPage.jsx   # Public Marketing Homepage
│   │   │   ├── LoginPage.jsx     # Glassmorphism Login Modal & Live Backdrop
│   │   │   ├── RegisterPage.jsx  # Staff Registration View (Triggers Pending Approval)
│   │   │   ├── DashboardPage.jsx # Core Inventory Dashboard
│   │   │   ├── AdminUsersPage.jsx# Admin User & Staff Management, Pending Approvals
│   │   │   ├── FeaturesPage.jsx  # Dedicated Features View (/features)
│   │   │   ├── AboutPage.jsx     # Dedicated About Us View (/about)
│   │   │   ├── ContactPage.jsx   # Dedicated Contact View (/contact)
│   │   │   ├── PrivacyPolicyPage.jsx # Dedicated Privacy View (/privacy)
│   │   │   ├── TermsOfServicePage.jsx # Dedicated Terms View (/terms)
│   │   │   ├── ReportsPage.jsx   # Inventory Valuation & Stock Movement Analytics
│   │   │   ├── SettingsPage.jsx  # Threshold & Security Configuration
│   │   │   └── StaffActivityPage.jsx # Complete Audit Log Portal
│   │   ├── services/             # Backend API Services
│   │   │   ├── api.js            # Fetch API HTTP Wrapper & Error Handler
│   │   │   ├── productService.js # Product CRUD Endpoints
│   │   │   ├── categoryService.js# Category Endpoints
│   │   │   └── userService.js    # User & Security Endpoints
│   │   ├── utils/                # Helper Utilities
│   │   │   ├── avatar.js         # DiceBear SVG Initials Avatar Generator
│   │   │   ├── storage.js        # LocalStorage Persistence Cache
│   │   │   └── mockData.js       # Seed Data Sets
│   │   ├── App.jsx               # Application Routing Shell & View Switcher
│   │   └── main.jsx              # React Entry Point
│   ├── package.json              # Dependencies & Scripts
│   └── vite.config.js            # Vite Configuration & Proxy Setup
├── backend/                      # Pure PHP Backend Engine
│   ├── config/                   # Configuration & Route Registry
│   ├── database/                 # Schema Definition & Seeders (schema.sql, seeders.sql)
│   └── src/                      # Controllers, Repositories, Services
└── README.md                     # Monorepo Documentation
```

---

## ⚡ Core Concepts & Development Patterns

### 1. 🔐 Authentication, Staff Approvals & RBAC (`AuthContext.jsx`)
- **Role Hierarchy**:
  - `admin`: Full administrative access (Manage users, approve staff, modify thresholds, create/delete categories, view valuation reports).
  - `staff`: Operational staff access (View catalog, perform stock adjustments, track inventory, log activities).
- **Staff Approval Workflow**:
  - Staff self-registration assigns `status = 'pending'`.
  - Pending users are blocked at login with a user notification: *"Your staff account is pending Admin approval."*
  - Admins review and approve staff registrations in `AdminUsersPage.jsx`.
- **Immutable User Email Policy**:
  - User email addresses are locked upon registration and cannot be modified in profile settings.

### 2. 🎨 DiceBear Initials Avatars (`avatar.js`)
- All user avatar images are generated dynamically from the user's full name or username using the utility helper:
```javascript
import { getDiceBearAvatar } from '../utils/avatar';

// Usage:
const avatarUrl = getDiceBearAvatar(user.name);
```

### 3. 🛡️ Custom Confirmation Modals (`ConfirmModal.jsx`)
- Do **NOT** use native browser `window.confirm()` or `alert()` popups.
- Import and use `ConfirmModal.jsx`:
```jsx
<ConfirmModal
  isOpen={Boolean(deletingItem)}
  onClose={() => setDeletingItem(null)}
  onConfirm={() => handleDelete(deletingItem.id)}
  title="Delete Product"
  message="Are you sure you want to delete this item?"
  confirmText="Delete"
/>
```

---

## 🚀 Getting Started for New Developers

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Access Local App**:
   Navigate to `http://localhost:3000` in your web browser.

4. **Default Admin Credentials for Testing**:
   - **Email**: `saranga@stockflow.com` (or `admin@stockflow.com`)
   - **Password**: `admin123`
