import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { MetricCard } from '../components/dashboard/MetricCard';
import { StockChart } from '../components/dashboard/StockChart';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { CategoryStockBarChart } from '../components/dashboard/CategoryStockBarChart';
import { LowStockAlertPanel } from '../components/dashboard/LowStockAlertPanel';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { BulkImportModal } from '../components/dashboard/BulkImportModal';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { exportToCSV } from '../utils/exportUtils';
import { Download, Plus, Zap, UserCheck, Shield, ClipboardList, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';

export const DashboardPage = () => {
  const { products, categories, activities, setCurrentView, setSelectedCategoryFilter } = useInventory();
  const { user, setUser } = useAuth();
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);

  // Active Role state: fallback to context role or local toggle
  const currentRole = user?.role || 'admin';

  // Toggle role helper (Admin <-> Staff) for interactive demonstration
  const handleToggleRole = () => {
    const nextRole = currentRole === 'admin' ? 'staff' : 'admin';
    const nextName = nextRole === 'admin' ? 'Admin User' : 'Sarah Jenkins';
    setUser({ ...user, role: nextRole, name: nextName });
  };

  // KPI Computations
  const totalProducts = (products || []).length;
  const lowStockCount = (products || []).filter(p => p?.status === 'Low Stock' || p?.status === 'low_stock').length;
  const outOfStockCount = (products || []).filter(p => p?.status === 'Out of Stock' || p?.status === 'out_of_stock').length;
  
  // Total Valuation calculation: sum of (buyingPrice * quantity)
  const totalValuation = (products || []).reduce(
    (sum, p) => sum + (Number(p?.buyingPrice ?? p?.cost_price ?? p?.price ?? 0) * Number(p?.quantity || 0)),
    0
  );

  // Staff specific metrics
  const activeItemsCount = (products || []).filter(p => p?.isActive !== false).length;
  const itemsToRestock = lowStockCount + outOfStockCount;

  // Export handler
  const handleExportReport = () => {
    const reportData = (products || []).map(p => ({
      SKU: p?.sku || '',
      Name: p?.name || '',
      Category: p?.category || p?.category_name || '',
      Quantity: p?.quantity || 0,
      BuyingPrice: p?.buyingPrice ?? p?.cost_price ?? 0,
      SellingPrice: p?.sellingPrice ?? p?.price ?? 0,
      TotalValuation: ((p?.quantity || 0) * (p?.buyingPrice ?? p?.cost_price ?? p?.price ?? 0)).toFixed(2),
      Status: p?.status || ''
    }));
    exportToCSV('stockflow_inventory_summary.csv', reportData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Role Differentiation & Greeting Banner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl text-white shadow-md ${
                currentRole === 'admin'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
                  : 'bg-gradient-to-br from-emerald-600 to-teal-700'
              }`}>
                {currentRole === 'admin' ? (
                  <Shield className="w-7 h-7" />
                ) : (
                  <UserCheck className="w-7 h-7" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Welcome back, {user?.name || 'User'}
                  </h1>
                  <span className={`px-3 py-0.5 text-xs font-black uppercase tracking-wider rounded-full ${
                    currentRole === 'admin'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {currentRole === 'admin' ? 'Administrator Dashboard' : 'Staff Operational Portal'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {currentRole === 'admin'
                    ? 'Complete overview of system metrics, inventory valuation, stock warnings, and category distribution.'
                    : 'Operational stock movements, urgent low-stock alerts, and fast inventory adjustments.'}
                </p>
              </div>
            </div>

            {/* Quick Actions & Role Switcher Toggle */}
            <div className="flex items-center gap-3 self-start md:self-center flex-wrap">
              <button
                onClick={handleToggleRole}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition-all border border-slate-200 flex items-center gap-2"
                title="Switch role mode between Admin and Staff"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                Switch to {currentRole === 'admin' ? 'Staff Mode' : 'Admin Mode'}
              </button>

              {currentRole === 'admin' ? (
                <>
                  <button
                    onClick={handleExportReport}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-slate-500" /> Export Valuation
                  </button>
                  <button
                    onClick={() => setCurrentView('add-product')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Add Product
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCurrentView('inventory')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" /> Open Stock Registry
                </button>
              )}
            </div>
          </div>

          {/* Role-Differentiated KPI Overview Cards */}
          {currentRole === 'admin' ? (
            /* ADMIN KPI METRICS */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="TOTAL PRODUCTS"
                value={totalProducts.toLocaleString()}
                change="+12% this month"
                changeType="positive"
                iconType="products"
                onClick={() => {
                  setSelectedCategoryFilter('All Categories');
                  setCurrentView('inventory');
                }}
              />
              <MetricCard
                title="INVENTORY VALUATION"
                value={`$${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change="Total Cost Basis"
                changeType="positive"
                iconType="valuation"
                subtitle={`${categories.length} active categories`}
                onClick={() => setCurrentView('reports')}
              />
              <MetricCard
                title="LOW STOCK ALERTS"
                value={lowStockCount}
                change="+3 needs reorder"
                changeType="negative"
                iconType="low-stock"
                onClick={() => {
                  setSelectedCategoryFilter('All Categories');
                  setCurrentView('inventory');
                }}
              />
              <MetricCard
                title="OUT OF STOCK"
                value={outOfStockCount}
                change="Action required"
                changeType="negative"
                iconType="out-stock"
                onClick={() => {
                  setSelectedCategoryFilter('All Categories');
                  setCurrentView('inventory');
                }}
              />
            </div>
          ) : (
            /* STAFF OPERATIONAL KPI METRICS */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="ACTIVE CATALOG ITEMS"
                value={activeItemsCount.toLocaleString()}
                change="In Stock Registry"
                changeType="positive"
                iconType="products"
                onClick={() => setCurrentView('inventory')}
              />
              <MetricCard
                title="ITEMS TO RESTOCK"
                value={itemsToRestock}
                change="Urgent Queue"
                changeType="negative"
                iconType="low-stock"
                subtitle="Low & Out of stock items"
              />
              <MetricCard
                title="CATEGORIES"
                value={categories.length}
                change="Organized Groups"
                changeType="neutral"
                iconType="categories"
                onClick={() => setCurrentView('categories')}
              />
              <MetricCard
                title="RECENT ACTIVITIES"
                value={activities.length}
                change="Logged Entries"
                changeType="positive"
                iconType="activity"
              />
            </div>
          )}

          {/* Low-Stock Warning Alert Panel */}
          <LowStockAlertPanel />

          {/* Recharts Analytics & Stock Distribution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Time Series Stock Chart & Bar Chart */}
            <div className="lg:col-span-2 space-y-6">
              <StockChart />
              <CategoryStockBarChart />
              <RecentActivity />
            </div>

            {/* Right 1 Column: Pie Distribution Chart & Quick Actions */}
            <div className="space-y-6">
              <CategoryChart />

              {/* Bulk Import Banner */}
              <div
                onClick={() => setShowBulkImportModal(true)}
                className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 card-hover cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                <div className="w-10 h-10 bg-blue-600/30 border border-blue-400/30 rounded-xl flex items-center justify-center mb-4 backdrop-blur-xs shadow-sm">
                  <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
                <h4 className="text-lg font-extrabold text-white mb-1.5 tracking-tight">Bulk Product Import</h4>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed mb-4">
                  Easily import hundreds of inventory products from a CSV file into your system.
                </p>
                <span className="inline-flex items-center text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl shadow-md transition-all gap-1.5">
                  Upload CSV File <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              {/* System Quick Links Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Quick Navigation</h4>
                <div className="space-y-2 text-xs font-bold">
                  <button
                    onClick={() => setCurrentView('inventory')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-left transition-colors flex items-center justify-between"
                  >
                    <span>View Product Catalog</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => setCurrentView('categories')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-left transition-colors flex items-center justify-between"
                  >
                    <span>Manage Categories</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {currentRole === 'admin' && (
                    <button
                      onClick={() => setCurrentView('reports')}
                      className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-left transition-colors flex items-center justify-between"
                    >
                      <span>Analytics & Valuation Reports</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
      />
    </div>
  );
};
