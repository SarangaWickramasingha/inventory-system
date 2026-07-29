# StockFlow - Modern Inventory Management System Frontend

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

- **Framework**: [React 18](https://reactjs.org/) + [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + [PostCSS](https://postcss.org/) + [Autoprefixer](https://github.com/postcss/autoprefixer)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
inventory-system-frontend/
├── public/                # Static public assets
├── src/
│   ├── components/        # Reusable UI components (Sidebar, Navbar, Cards, Modals)
│   ├── context/           # React Context providers for global state
│   ├── pages/             # Page components
│   │   ├── LandingPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── InventoryPage.jsx
│   │   ├── CategoriesPage.jsx
│   │   ├── AddProductPage.jsx
│   │   ├── EditProductPage.jsx
│   │   ├── ReportsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── utils/             # Helper utilities and data formatters
│   ├── App.jsx            # Main app router and layout shell
│   ├── index.css          # Tailwind CSS directives & custom styles
│   └── main.jsx           # React application entry point
├── .gitignore             # Git ignore patterns
├── package.json           # Dependencies and build scripts
└── vite.config.js         # Vite configuration
```

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.0 or higher)
- `npm` or `yarn` / `pnpm`

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

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is proprietary software under active development.
