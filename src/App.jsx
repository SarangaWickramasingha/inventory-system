import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AddProductPage } from './pages/AddProductPage';
import { EditProductPage } from './pages/EditProductPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Toast } from './components/common/Toast';

const MainContent = () => {
  const { currentView } = useInventory();

  switch (currentView) {
    case 'landing':
      return <LandingPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'inventory':
      return <InventoryPage />;
    case 'categories':
      return <CategoriesPage />;
    case 'add-product':
      return <AddProductPage />;
    case 'edit-product':
      return <EditProductPage />;
    case 'reports':
      return <ReportsPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
};

export default function App() {
  return (
    <InventoryProvider>
      <MainContent />
      <Toast />
    </InventoryProvider>
  );
}
