# StockFlow - Enterprise IT Inventory Management System

StockFlow is a feature-rich, intuitive, and responsive enterprise inventory management web application built with modern web technologies. Designed for IT hardware tracking, enterprise asset management, and small-to-medium business operations, StockFlow provides real-time overview analytics, product catalog management, role-based access control (RBAC), category organization, staff activity audit logging, and customizable settings.

---

## 🚀 Key Features

- 📊 **Interactive Dashboard**: Real-time overview of stock metrics, valuation totals, low-stock reorder alerts, category bar charts, and recent activity streams.
- 📦 **Inventory Management**: Searchable and filterable product lists, stock status indicators, SKU tracking, quick adjustments, and unified confirm deletion modals.
- ⏳ **Staff Registration & Admin Approval Queue**: Self-service staff registration workflow with pending approval status (`status = 'pending'`). Admins manage approvals, role toggles, and user configurations via a dropdown selector.
- 💎 **Glassmorphism Auth Overlays**: Translucent frosted glass panel Login and Register modals floating over a live, dimmed landing page backdrop with exit dismissal buttons.
- 🌐 **Standalone Page Views & Navigation**: Dedicated views and routes for Features (`/features`), About Us (`/about`), Contact (`/contact`), Privacy Policy (`/privacy`), and Terms of Service (`/terms`).
- 🎨 **DiceBear SVG Initials Avatars**: Dynamic SVG initials avatars automatically generated from user credentials (`name` and `username`) across the header bar, user management, audit logs, and settings profile card.
- 🛡️ **Unified System Confirm Modals**: Custom `ConfirmModal` system component replacing native browser `confirm()` and `alert()` popups for clean UX consistency.
- 📈 **Reports & Audit Logging**: Graphical inventory valuation breakdown, turnover metrics, stock movement timelines, and comprehensive staff activity audit logs.
- 📱 **Modern Aesthetics**: Built with Tailwind CSS, custom glassmorphism effects, curated color palettes, and responsive layouts.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [Vite 5](https://vitejs.dev/) + [Tailwind CSS 3](https://tailwindcss.com/) + [Recharts](https://recharts.org/) + [Lucide React](https://lucide.dev/) + [DiceBear API](https://www.dicebear.com/)
- **Backend**: Pure PHP 8 OOP Architecture + MySQL (Database)

---

## 📂 Project Structure

```text
inventory-system-frontend/
├── frontend/                     # React Single Page Application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── categories/       # Category cards and modals
│   │   │   ├── common/           # Header, Sidebar, Badges, ConfirmModal
│   │   │   ├── dashboard/        # Stat cards, Charts, Activity feeds
│   │   │   ├── inventory/        # Product tables, Filters, Adjust modals
│   │   │   ├── landing/          # Hero, Navbar, Modals
│   │   │   ├── reports/          # KPIs, Charts, Timeline tables
│   │   │   └── settings/         # Thresholds, Company profile cards
│   │   ├── context/              # React Context providers (AuthContext, InventoryContext)
│   │   ├── pages/                # Standalone page views (Dashboard, AdminUsers, Features, About, etc.)
│   │   ├── services/             # API integration services (auth, products, categories, users)
│   │   ├── utils/                # Helper utilities (avatar generator, storage cache)
│   │   ├── App.jsx               # Main application routing shell
│   │   └── main.jsx              # React application entry point
│   ├── package.json              # Frontend package dependencies
│   └── vite.config.js            # Vite dev server configuration
├── backend/                      # Pure PHP Backend System
│   ├── config/                   # Backend routes & configuration
│   ├── database/                 # Database Schema & Seed data SQL files
│   └── src/                      # PHP Controllers, Models, Repositories, Services
├── package.json                  # Monorepo root package configuration
└── README.md                     # Project documentation
```

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.0 or higher)
- PHP (v8.0 or higher for backend execution)
- MySQL Server

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SarangaWickramasingha/inventory-system-frontend.git
   cd inventory-system-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Frontend development server**:
   ```bash
   npm run dev
   ```

4. **Start the Backend server**:
   ```bash
   npm run dev:backend
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is proprietary software under active development.
