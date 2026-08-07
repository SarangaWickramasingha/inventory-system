import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AddProductPage } from './pages/AddProductPage';
import { EditProductPage } from './pages/EditProductPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { StaffActivityPage } from './pages/StaffActivityPage';
import { Toast } from './components/common/Toast';

import { ProtectedRoute } from './components/ProtectedRoute';

const MainContent = () => {
  const { currentView } = useInventory();

  switch (currentView) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'features':
      return <FeaturesPage />;
    case 'about':
      return <AboutPage />;
    case 'contact':
      return <ContactPage />;
    case 'privacy':
      return <PrivacyPolicyPage />;
    case 'terms':
      return <TermsOfServicePage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'inventory':
      return <InventoryPage />;
    case 'categories':
      return <CategoriesPage />;
    case 'users':
    case 'admin-users':
      return (
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminUsersPage />
        </ProtectedRoute>
      );
    case 'staff-activity':
    case 'activity':
      return <StaffActivityPage />;
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
    <AuthProvider>
      <InventoryProvider>
        <MainContent />
        <Toast />
      </InventoryProvider>
    </AuthProvider>
  );
}
