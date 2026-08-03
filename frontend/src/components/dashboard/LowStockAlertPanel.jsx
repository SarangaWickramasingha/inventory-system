import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, ArrowRight, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const LowStockAlertPanel = () => {
  const { products, setCurrentView, setSelectedCategoryFilter, setEditingProductId } = useInventory();
  const [filter, setFilter] = useState('all'); // 'all', 'low', 'out'

  // Filter low stock and out of stock items
  const lowStockItems = products.filter(p => p.status === 'Low Stock');
  const outOfStockItems = products.filter(p => p.status === 'Out of Stock');
  
  const alertItems = products.filter(p => {
    if (filter === 'low') return p.status === 'Low Stock';
    if (filter === 'out') return p.status === 'Out of Stock';
    return p.status === 'Low Stock' || p.status === 'Out of Stock' || (p.quantity <= (p.reorderPoint || 30));
  });

  const handleRestock = (product) => {
    setEditingProductId(product.id);
    setCurrentView('edit-product');
  };

  const handleViewAllInventory = () => {
    setSelectedCategoryFilter('All Categories');
    setCurrentView('inventory');
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Panel Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-rose-50/60 via-amber-50/40 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">Low Stock & Reorder Alerts</h3>
              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                {lowStockItems.length + outOfStockItems.length} Urgent
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Items requiring immediate inventory replenishment or supplier reorder.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-center text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({lowStockItems.length + outOfStockItems.length})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'low' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Low ({lowStockItems.length})
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'out' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Out ({outOfStockItems.length})
          </button>
        </div>
      </div>

      {/* Alert List Container */}
      <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
        {alertItems.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">All Stock Levels Optimal</h4>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              No products are currently under critical warning thresholds. Great job!
            </p>
          </div>
        ) : (
          alertItems.map((item) => {
            const reorderPoint = item.reorderPoint || 30;
            const percentage = Math.min(100, Math.round((item.quantity / (reorderPoint * 2)) * 100));
            const isOut = item.quantity === 0 || item.status === 'Out of Stock';

            return (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4 group"
              >
                {/* Product Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{item.name}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.sku}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span>Category: <strong className="text-slate-700 font-semibold">{item.category}</strong></span>
                      <span>•</span>
                      <span>Reorder Level: <strong className="text-slate-700 font-semibold">{reorderPoint} units</strong></span>
                    </div>
                  </div>
                </div>

                {/* Status & Bar */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block w-32">
                    <div className="flex items-center justify-end gap-1.5 text-xs font-bold">
                      <span className={isOut ? 'text-rose-600 font-extrabold' : 'text-amber-600 font-extrabold'}>
                        {item.quantity} left
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOut ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.max(5, percentage)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg ${
                      isOut
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isOut ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    {isOut ? 'Out of Stock' : 'Low Stock'}
                  </span>

                  {/* Quick Action */}
                  <button
                    onClick={() => handleRestock(item)}
                    className="p-2 bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white rounded-xl transition-all shadow-2xs font-bold text-xs flex items-center gap-1.5"
                    title="Update Stock & Order"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Restock</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer link */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs px-6">
        <span className="text-slate-500 font-medium">
          Showing {alertItems.length} warning items
        </span>
        <button
          onClick={handleViewAllInventory}
          className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 transition-colors"
        >
          View Full Inventory List <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
