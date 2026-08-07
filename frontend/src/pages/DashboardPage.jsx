import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { MetricCard } from '../components/dashboard/MetricCard';
import { StockChart } from '../components/dashboard/StockChart';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { CategoryStockBarChart } from '../components/dashboard/CategoryStockBarChart';
import { LowStockAlertPanel } from '../components/dashboard/LowStockAlertPanel';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { StaffTaskChecklist } from '../components/dashboard/StaffTaskChecklist';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { exportToCSV } from '../utils/exportUtils';
import { Download, Plus, Zap, UserCheck, Shield, ClipboardList, ArrowUpRight, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export const DashboardPage = () => {
  const { products, categories, activities, thresholdSettings, setCurrentView, setSelectedCategoryFilter } = useInventory();
  const { user } = useAuth();

  // Active Role state: from authenticated user context
  const currentRole = user?.role || 'staff';

  const defaultLimit = Number(thresholdSettings?.defaultThreshold) || 30;
  const criticalLimit = Number(thresholdSettings?.criticalThreshold) || 5;
  const enableAlerts = thresholdSettings?.enableDashboardAlerts !== false;

  // KPI Computations
  const totalProducts = (products || []).length;
  const lowStockCount = (products || []).filter(p => {
    const qty = Number(p?.quantity || 0);
    const limit = p?.min_stock_alert ?? p?.reorderPoint ?? defaultLimit;
    return qty > 0 && qty <= limit;
  }).length;
  const criticalCount = (products || []).filter(p => {
    const qty = Number(p?.quantity || 0);
    return qty > 0 && qty <= criticalLimit;
  }).length;
  const outOfStockCount = (products || []).filter(p => Number(p?.quantity || 0) <= 0).length;
  
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
                    : 'Operational stock movements, urgent low-stock alerts, daily task checklists, and fast inventory adjustments.'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 self-start md:self-center flex-wrap">
              {currentRole === 'admin' ? (
                <button
                  onClick={handleExportReport}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-500" /> Export Valuation
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('add-product')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Add New Product
                </button>
              )}
            </div>
          </div>

          {/* Urgent Critical Warning Banner (Controlled by Dashboard Warning Banners Setting) */}
          {enableAlerts && criticalCount > 0 && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500 text-white rounded-xl shadow-xs">
                  <AlertCircle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-rose-900">
                    Urgent Warning: {criticalCount} Item(s) At or Below Critical Level (≤ {criticalLimit} units)
                  </h4>
                  <p className="text-xs font-medium text-rose-700 mt-0.5">
                    Stock dips detected under configured warning thresholds. Immediate replenishment required.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCategoryFilter('All Categories');
                  setCurrentView('inventory');
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>View Inventory</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

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
                value={`Rs. ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change="Total Cost Basis"
                changeType="positive"
                iconType="valuation"
                subtitle={`${categories.length} active categories`}
                onClick={() => setCurrentView('reports')}
              />
              <MetricCard
                title="LOW STOCK ALERTS"
                value={lowStockCount}
                change={lowStockCount > 0 ? `${lowStockCount} needs reorder` : "Stock levels optimal"}
                changeType={lowStockCount > 0 ? "negative" : "positive"}
                iconType="low-stock"
                onClick={() => {
                  setSelectedCategoryFilter('All Categories');
                  setCurrentView('inventory');
                }}
              />
              <MetricCard
                title="OUT OF STOCK"
                value={outOfStockCount}
                change={outOfStockCount > 0 ? "Action required" : "All items in stock"}
                changeType={outOfStockCount > 0 ? "negative" : "positive"}
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
                change={itemsToRestock > 0 ? "Urgent Queue" : "No Reorders Needed"}
                changeType={itemsToRestock > 0 ? "negative" : "positive"}
                iconType="low-stock"
                subtitle="Low & Out of stock items"
                onClick={() => {
                  setSelectedCategoryFilter('All Categories');
                  setCurrentView('inventory');
                }}
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
                onClick={() => setCurrentView('staff-activity')}
              />
            </div>
          )}

          {/* MAIN ROLE-DIFFERENTIATED DASHBOARD CONTENT */}
          {currentRole === 'admin' ? (
            /* ADMIN ROLE DASHBOARD LAYOUT */
            <div className="space-y-6">
              <LowStockAlertPanel />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Analytics & Stock Charts */}
                <div className="lg:col-span-2 space-y-6">
                  <StockChart />
                  <CategoryStockBarChart />
                  <RecentActivity />
                </div>

                {/* Right 1 Column: Distribution & Quick Imports */}
                <div className="space-y-6">
                  <CategoryChart />

                  {/* System Quick Links Card */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Admin Quick Navigation</h4>
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
                      <button
                        onClick={() => setCurrentView('reports')}
                        className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-left transition-colors flex items-center justify-between"
                      >
                        <span>Analytics & Valuation Reports</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* STAFF ROLE OPERATIONAL DASHBOARD LAYOUT */
            <div className="space-y-6">
              {/* Daily Checklist & Urgent Restock Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <StaffTaskChecklist />
                  <LowStockAlertPanel />
                  <CategoryStockBarChart />
                </div>

                <div className="space-y-6">
                  {/* Staff Operational Actions */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Staff Quick Actions</h4>
                    <div className="space-y-2 text-xs font-bold">
                      <button
                        onClick={() => setCurrentView('add-product')}
                        className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-left transition-colors flex items-center justify-between border border-emerald-200/60"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-emerald-600" /> Add Single Product
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <button
                        onClick={() => setCurrentView('inventory')}
                        className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-left transition-colors flex items-center justify-between border border-slate-200"
                      >
                        <span className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-slate-500" /> Open Stock Registry
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <CategoryChart />
                  <RecentActivity />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
