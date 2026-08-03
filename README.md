# StockFlow - Modern Inventory Management System

StockFlow is a feature-rich, intuitive, and responsive inventory management web application built with modern web technologies. Designed for small-to-medium businesses and enterprise inventory tracking, StockFlow provides real-time overview analytics, product catalog management, category organization, comprehensive reporting, and customizable settings.

---

## 🚀 Features

- 📊 **Interactive Dashboard**: Overview of stock metrics, sales charts, low-stock alerts, and recent activities.
- 📦 **Inventory Management**: Filterable product lists, stock status indicators, search capabilities, and batch actions.
- 🏷️ **Categories Management**: Organize products into customizable categories with item counts and descriptions.
- ➕ **Add & Edit Products**: Dynamic forms supporting image upload previews, SKU generation, pricing rules, tax settings, and variant options.
- 📈 **Reports & Analytics**: Graphical reports powered by Recharts for inventory valuation, sales breakdown, and turnover trends.
- ⚙️ **Settings & Customization**: Manage store details, currency options, notification preferences, and team permissions.
- 📱 **Responsive Design**: Fully responsive UI crafted with Tailwind CSS and Lucide icons.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [Vite 5](https://vitejs.dev/) + [Tailwind CSS 3](https://tailwindcss.com/) + [Recharts](https://recharts.org/) + [Lucide React](https://lucide.dev/)
- **Backend**: Pure PHP 8 OOP Architecture + MySQL (Database)

---

## 📂 Project Structure

```text
inventory-system-frontend/
├── frontend/                     # React Single Page Application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── context/              # React Context providers for global state
│   │   ├── hooks/                # Custom React hooks (useAuth, useForm)
│   │   ├── pages/                # Application page views
│   │   ├── services/             # API integration services
│   │   ├── utils/                # Helper utilities and formatters
│   │   ├── App.jsx               # Main layout and routing shell
│   │   ├── index.css             # Tailwind CSS directives & global styling
│   │   └── main.jsx              # React application entry point
│   ├── index.html                # Vite HTML entry point
│   ├── package.json              # Frontend package dependencies
│   ├── vite.config.js            # Vite dev server & proxy settings
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── postcss.config.js         # PostCSS configuration
├── backend/                      # Pure PHP Backend System
│   ├── config/                   # Backend routes & configuration
│   ├── database/                 # Database Schema & Seed data SQL files
│   │   ├── schema.sql
│   │   └── seeders.sql
│   ├── public/                   # Front controller entry point & index.php
│   └── src/                      # PHP Core, Controllers, Models, Repositories, Services
│       ├── Controllers/
│       ├── Core/
│       ├── Models/
│       ├── Repositories/
│       └── Services/
├── package.json                  # Root monorepo orchestration package.json
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
