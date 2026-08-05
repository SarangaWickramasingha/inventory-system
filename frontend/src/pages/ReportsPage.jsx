import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { ReportKpis } from '../components/reports/ReportKpis';
import { StockMovementChart } from '../components/reports/StockMovementChart';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { ValuationTable } from '../components/reports/ValuationTable';
import { StockMovementTimeline } from '../components/reports/StockMovementTimeline';
import { LowStockAlerts } from '../components/reports/LowStockAlerts';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/exportUtils';
import { Download, FileText, Printer, FileSpreadsheet, RefreshCw, BarChart2, Layers } from 'lucide-react';

export const ReportsPage = () => {
  const { products, categories, showToast } = useInventory();
  const [activeTab, setActiveTab] = useState('valuation'); // 'valuation', 'movements', 'alerts'

  // Valuation Export to CSV
  const handleExportCSV = () => {
    const data = products.map(p => {
      const buy = Number(p.buyingPrice) || 0;
      const sell = Number(p.sellingPrice) || 0;
      const qty = Number(p.quantity) || 0;
      const costBasis = qty * buy;
      const retailVal = qty * sell;
      const profit = retailVal - costBasis;
      const margin = buy > 0 ? (((sell - buy) / buy) * 100).toFixed(2) : '0';

      return {
        SKU: p.sku,
        ItemName: p.name,
        Category: p.category,
        QuantityInStock: qty,
        BuyingPriceUSD: buy.toFixed(2),
        SellingPriceUSD: sell.toFixed(2),
        TotalCostValuationUSD: costBasis.toFixed(2),
        TotalRetailValuationUSD: retailVal.toFixed(2),
        ProjectedGrossProfitUSD: profit.toFixed(2),
        ProfitMarginPercent: `${margin}%`,
        StockStatus: p.status
      };
    });

    exportToCSV('stockflow_full_valuation_report.csv', data);
    showToast('Valuation report exported to CSV!');
  };

  // Valuation Export to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'stockflow_inventory_data.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported inventory JSON data payload!');
  };

  // PDF / Print export handler
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans print:bg-white print:p-0">
      {/* Hide Sidebar in Print mode */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Hide Header in Print mode */}
        <div className="print:hidden">
          <Header />
        </div>

        <main className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Top Title & Valuation Export Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Reports & Analytics Center
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Real-time financial valuation, inventory stock movements timeline, and audit analytics.
              </p>
            </div>

            {/* Valuation Export Buttons Toolbar */}
            <div className="flex items-center gap-2.5 flex-wrap print:hidden">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-2"
                title="Export complete inventory valuation as CSV"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
              </button>

              <button
                onClick={handleExportJSON}
                className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-2"
                title="Export raw JSON payload"
              >
                <Download className="w-4 h-4 text-blue-600" /> Export JSON
              </button>

              <button
                onClick={handlePrintReport}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print / PDF Summary
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <ReportKpis />

          {/* Navigation Tabs for Analytics Sections */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-bold print:hidden">
            <button
              onClick={() => setActiveTab('valuation')}
              className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'valuation'
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Comprehensive Valuation Table
            </button>

            <button
              onClick={() => setActiveTab('movements')}
              className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'movements'
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" /> Stock Movement Timeline
            </button>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StockMovementChart />
            </div>
            <div>
              <CategoryChart />
            </div>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'valuation' && (
            <div className="space-y-8">
              <ValuationTable />
            </div>
          )}

          {activeTab === 'movements' && (
            <div className="space-y-8">
              <StockMovementTimeline />
            </div>
          )}

          {/* Low Stock Alerts Section */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Replenishment & Warning Queue</h3>
            <LowStockAlerts />
          </div>
        </main>
      </div>
    </div>
  );
};
