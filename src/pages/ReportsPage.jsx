import React from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { ReportKpis } from '../components/reports/ReportKpis';
import { StockMovementChart } from '../components/reports/StockMovementChart';
import { LowStockAlerts } from '../components/reports/LowStockAlerts';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/exportUtils';
import { Download, FileText } from 'lucide-react';

export const ReportsPage = () => {
  const { products, showToast } = useInventory();

  const handleExportCSV = () => {
    const data = products.map(p => ({
      SKU: p.sku,
      Name: p.name,
      Category: p.category,
      Quantity: p.quantity,
      ReorderPoint: p.reorderPoint || 30,
      Status: p.status,
      BuyingPrice: p.buyingPrice,
      SellingPrice: p.sellingPrice,
      TotalValue: (p.quantity * p.buyingPrice).toFixed(2)
    }));
    exportToCSV('stockflow_inventory_analytics_report.csv', data);
    showToast('Exported CSV Analytics Report!');
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Title & Top Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports & Analytics</h1>
              <p className="text-sm text-slate-500 font-medium">
                Real-time insights across all inventory categories.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl shadow-2xs transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-slate-500" /> Export to CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> Export to PDF
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <ReportKpis />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StockMovementChart />
            </div>
            <div>
              <CategoryChart />
            </div>
          </div>

          {/* Low Stock Alerts */}
          <LowStockAlerts />
        </main>
      </div>
    </div>
  );
};
