import React, { useState, useMemo } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Sliders,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Package,
  Clock,
  Plus,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { StockAdjustModal } from '../components/inventory/StockAdjustModal';
import { useInventory } from '../context/InventoryContext';

/**
 * StaffActivityPage Component (Page 9: Staff & Admin Activity Portal)
 * Dedicated Staff portal for fast Stock IN / Stock OUT entries, personal activity log feed, and stock transaction audit trail.
 * Owner: Sashika (Staff Activity Portal & Stock Movements)
 */
export const StaffActivityPage = () => {
  const { stockLogs = [], activities = [], products = [], profile, showToast } = useInventory();

  // Combine stockLogs and activities if needed
  const allLogs = useMemo(() => {
    const combined = [...stockLogs];
    activities.forEach((act) => {
      if (!combined.some((l) => l.id === act.id)) {
        combined.push({
          id: act.id,
          productName: act.productName || 'Stock Item',
          sku: act.sku || 'SKU-LOG',
          category: act.category || 'General',
          type: act.action === 'Added' ? 'IN' : act.action === 'Removed' ? 'OUT' : 'ADJUSTMENT',
          quantityChanged: act.action === 'Added' ? '+10' : act.action === 'Removed' ? '-5' : 'Set',
          previousQuantity: act.previousQuantity || 0,
          newQuantity: act.newQuantity || 0,
          notes: act.notes || `${act.action} product record`,
          user: act.user || 'Alex Mercer',
          userRole: act.userRole || 'Staff',
          userAvatar: act.userAvatar || profile.avatar,
          userInitials: act.userInitials || 'AM',
          timestamp: act.timestamp || new Date().toISOString(),
          time: act.time || 'Recently'
        });
      }
    });
    return combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [stockLogs, activities, profile]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('IN');
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL'); // 'ALL', 'IN', 'OUT', 'ADJUSTMENT'
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL', 'TODAY', 'WEEK', 'MONTH'
  const [selectedTab, setSelectedTab] = useState('logs'); // 'logs', 'quick-adjust'

  const openAdjustModal = (type = 'IN', product = null) => {
    setModalType(type);
    setSelectedProductForModal(product);
    setIsModalOpen(true);
  };

  // Filtered Logs Calculation
  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      // Type Filter
      if (selectedTypeFilter !== 'ALL' && log.type !== selectedTypeFilter) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesProduct = (log.productName || '').toLowerCase().includes(q);
        const matchesSku = (log.sku || '').toLowerCase().includes(q);
        const matchesUser = (log.user || '').toLowerCase().includes(q);
        const matchesNotes = (log.notes || '').toLowerCase().includes(q);
        if (!matchesProduct && !matchesSku && !matchesUser && !matchesNotes) {
          return false;
        }
      }

      // Date Range Filter
      if (dateFilter !== 'ALL') {
        const logDate = new Date(log.timestamp);
        const now = new Date();
        if (dateFilter === 'TODAY') {
          if (logDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === 'WEEK') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (logDate < sevenDaysAgo) return false;
        } else if (dateFilter === 'MONTH') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (logDate < thirtyDaysAgo) return false;
        }
      }

      return true;
    });
  }, [allLogs, selectedTypeFilter, searchQuery, dateFilter]);

  // Statistics Summary
  const stats = useMemo(() => {
    const totalTransactions = allLogs.length;
    const stockInCount = allLogs.filter(l => l.type === 'IN').length;
    const stockOutCount = allLogs.filter(l => l.type === 'OUT').length;
    const adjustmentCount = allLogs.filter(l => l.type === 'ADJUSTMENT').length;

    return { totalTransactions, stockInCount, stockOutCount, adjustmentCount };
  }, [allLogs]);

  // Export CSV Functionality
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      showToast('No logs available to export.', 'warning');
      return;
    }

    const headers = ['Transaction ID', 'Timestamp', 'User', 'Product Name', 'SKU', 'Type', 'Qty Changed', 'Prev Qty', 'New Qty', 'Notes'];
    const rows = filteredLogs.map(l => [
      l.id,
      new Date(l.timestamp).toLocaleString(),
      `"${l.user}"`,
      `"${l.productName}"`,
      l.sku,
      l.type,
      `"${l.quantityChanged}"`,
      l.previousQuantity,
      l.newQuantity,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `StockFlow_Movement_Log_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Stock movement audit log downloaded as CSV!');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Banner & Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                  <Activity className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                    Staff Activity & Stock Movements
                  </h1>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Fast Receiving & Dispatch Portal • Real-Time Transaction Audit Trail
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Trigger Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => openAdjustModal('IN')}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                Stock IN (Receiving)
              </button>

              <button
                onClick={() => openAdjustModal('OUT')}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <ArrowDownRight className="w-4 h-4 stroke-[3]" />
                Stock OUT (Dispatch)
              </button>

              <button
                onClick={() => openAdjustModal('ADJUSTMENT')}
                className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <Sliders className="w-4 h-4 stroke-[2.5]" />
                Stock Adjustment
              </button>

              <button
                onClick={handleExportCSV}
                className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                title="Export audit log to CSV"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Transactions</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalTransactions}</h3>
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5 inline-block">Logged Movements</span>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock IN (Received)</p>
                <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.stockInCount}</h3>
                <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Additions
                </span>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock OUT (Dispatched)</p>
                <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{stats.stockOutCount}</h3>
                <span className="text-[11px] font-semibold text-rose-700 mt-0.5 inline-flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> Deductions
                </span>
              </div>
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 stroke-[2.5]" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Adjustments</p>
                <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{stats.adjustmentCount}</h3>
                <span className="text-[11px] font-semibold text-amber-700 mt-0.5 inline-block">Audit Corrections</span>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Sliders className="w-6 h-6 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setSelectedTab('logs')}
              className={`py-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                selectedTab === 'logs'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              Activity Movement Audit Log ({filteredLogs.length})
            </button>

            <button
              onClick={() => setSelectedTab('quick-adjust')}
              className={`py-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                selectedTab === 'quick-adjust'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              Quick Stock Adjustment Table ({products.length})
            </button>
          </div>

          {selectedTab === 'logs' ? (
            /* Activity Logs Audit View */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              {/* Filter & Search Bar */}
              <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Product Name, SKU, Staff Member, or Notes..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex bg-slate-200/70 p-1 rounded-xl gap-1 text-xs font-bold">
                    {['ALL', 'IN', 'OUT', 'ADJUSTMENT'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedTypeFilter(type)}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          selectedTypeFilter === type
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {type === 'ALL' ? 'All Types' : type}
                      </button>
                    ))}
                  </div>

                  {/* Date Filter Dropdown */}
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="ALL">📅 All Dates</option>
                    <option value="TODAY">Today Only</option>
                    <option value="WEEK">Past 7 Days</option>
                    <option value="MONTH">Past 30 Days</option>
                  </select>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/60 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Timestamp / Date</th>
                      <th className="py-3.5 px-6">Staff Member</th>
                      <th className="py-3.5 px-6">Product Details</th>
                      <th className="py-3.5 px-6">Transaction Type</th>
                      <th className="py-3.5 px-6 text-right">Delta Shift</th>
                      <th className="py-3.5 px-6 text-center">Stock Shift</th>
                      <th className="py-3.5 px-6">Audit Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-400">
                          <Activity className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="font-semibold text-slate-600">No stock movement logs found</p>
                          <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or transaction type filter.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Date */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <div>
                                <span className="font-bold text-slate-800">
                                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <p className="text-[10px] text-slate-400">
                                  {new Date(log.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* User */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              {log.userAvatar ? (
                                <img
                                  src={log.userAvatar}
                                  alt={log.user}
                                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                                  {log.userInitials || 'SM'}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-slate-800 leading-tight">{log.user}</p>
                                <span className="text-[10px] font-medium text-slate-400">{log.userRole || 'Staff'}</span>
                              </div>
                            </div>
                          </td>

                          {/* Product */}
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{log.productName}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                SKU: <span className="font-mono text-slate-700">{log.sku}</span>
                              </p>
                            </div>
                          </td>

                          {/* Type */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            {log.type === 'IN' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                                STOCK IN
                              </span>
                            ) : log.type === 'OUT' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                                <ArrowDownRight className="w-3.5 h-3.5 stroke-[3]" />
                                STOCK OUT
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                                <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
                                ADJUSTMENT
                              </span>
                            )}
                          </td>

                          {/* Delta */}
                          <td className="py-4 px-6 text-right whitespace-nowrap font-extrabold text-sm">
                            <span className={
                              log.type === 'IN' ? 'text-emerald-600' : log.type === 'OUT' ? 'text-rose-600' : 'text-amber-600'
                            }>
                              {log.quantityChanged}
                            </span>
                          </td>

                          {/* Shift */}
                          <td className="py-4 px-6 text-center whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-700 border border-slate-200">
                              {log.previousQuantity} ➔ {log.newQuantity}
                            </span>
                          </td>

                          {/* Notes */}
                          <td className="py-4 px-6 max-w-xs truncate text-slate-600 font-medium">
                            {log.notes || '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Quick Inventory Stock Adjustment Table View */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Quick Inventory Stock Adjustment Table</h3>
                <p className="text-xs text-slate-500">Click "+ Adjust" on any item to open instant stock modal</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/60 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Product Info</th>
                      <th className="py-3.5 px-6">Category</th>
                      <th className="py-3.5 px-6 text-right">Current Stock</th>
                      <th className="py-3.5 px-6 text-center">Status</th>
                      <th className="py-3.5 px-6 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <img src={prod.image} alt={prod.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200" />
                            <div>
                              <p className="font-bold text-slate-900">{prod.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{prod.sku}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-6 text-slate-600 font-medium">{prod.category}</td>

                        <td className="py-3.5 px-6 text-right font-extrabold text-sm text-slate-900">
                          {prod.quantity} <span className="text-xs font-normal text-slate-500">pcs</span>
                        </td>

                        <td className="py-3.5 px-6 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            prod.quantity === 0
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : prod.quantity <= (prod.reorderPoint || 30)
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}>
                            {prod.quantity === 0 ? 'Out of Stock' : prod.quantity <= (prod.reorderPoint || 30) ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>

                        <td className="py-3.5 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openAdjustModal('IN', prod)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" /> + IN
                            </button>
                            <button
                              onClick={() => openAdjustModal('OUT', prod)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                            >
                              <ArrowDownRight className="w-3.5 h-3.5" /> - OUT
                            </button>
                            <button
                              onClick={() => openAdjustModal('ADJUSTMENT', prod)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                            >
                              <Sliders className="w-3.5 h-3.5" /> Adjust
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProductForModal}
        initialType={modalType}
      />
    </div>
  );
};

export default StaffActivityPage;
