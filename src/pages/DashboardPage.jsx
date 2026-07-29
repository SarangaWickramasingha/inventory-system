import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { MetricCard } from '../components/dashboard/MetricCard';
import { StockChart } from '../components/dashboard/StockChart';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { BulkImportModal } from '../components/dashboard/BulkImportModal';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/exportUtils';
import { Download, Plus, Zap } from 'lucide-react';

export const DashboardPage = () => {
  const { products, categories, setCurrentView, setSelectedCategoryFilter } = useInventory();
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);

  const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;

  const handleExportReport = () => {
    const reportData = products.map(p => ({
      SKU: p.sku,
      Name: p.name,
      Category: p.category,
      Quantity: p.quantity,
      BuyingPrice: p.buyingPrice,
      SellingPrice: p.sellingPrice,
      Status: p.status
    }));
    exportToCSV('stockflow_dashboard_report.csv', reportData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Top Title & Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-sm text-slate-500 font-medium">
                Overview of your inventory metrics and recent activity.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportReport}
                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl shadow-2xs transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-slate-500" /> Export Report
              </button>
              <button
                onClick={() => setCurrentView('add-product')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Add New Product
              </button>
            </div>
          </div>

          {/* KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="TOTAL PRODUCTS"
              value={products.length ? products.length.toLocaleString() : '1,240'}
              change="+12% this month"
              changeType="positive"
              iconType="products"
              onClick={() => {
                setSelectedCategoryFilter('All Categories');
                setCurrentView('inventory');
              }}
            />
            <MetricCard
              title="CATEGORIES"
              value={categories.length ? categories.length.toLocaleString() : '18'}
              change="— No change"
              changeType="neutral"
              iconType="categories"
              onClick={() => setCurrentView('categories')}
            />
            <MetricCard
              title="LOW STOCK"
              value={lowStockCount}
              change="+3 since yesterday"
              changeType="positive"
              iconType="low-stock"
              onClick={() => {
                setSelectedCategoryFilter('All Categories');
                setCurrentView('inventory');
              }}
            />
            <MetricCard
              title="OUT OF STOCK"
              value={outOfStockCount}
              change="-2 resolved today"
              changeType="negative"
              iconType="out-stock"
              onClick={() => {
                setSelectedCategoryFilter('All Categories');
                setCurrentView('inventory');
              }}
            />
          </div>

          {/* Charts & Table Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns */}
            <div className="lg:col-span-2 space-y-6">
              <StockChart />
              <RecentActivity />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <CategoryChart />

              {/* Bulk Import Banner Card */}
              <div
                onClick={() => setShowBulkImportModal(true)}
                className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg card-hover cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-extrabold mb-1">Need Bulk Import?</h4>
                <p className="text-xs text-blue-100 leading-relaxed mb-4">
                  Upload a CSV file to add multiple products at once and save time.
                </p>
                <span className="inline-flex items-center text-xs font-bold bg-white text-blue-700 px-3.5 py-2 rounded-lg shadow-sm">
                  Upload CSV File →
                </span>
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
