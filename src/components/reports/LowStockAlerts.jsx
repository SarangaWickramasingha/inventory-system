import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { StatusBadge } from '../common/Badge';

export const LowStockAlerts = () => {
  const { products, updateProduct, navigateToEdit } = useInventory();

  // Filter products with stock <= reorder point or 0
  const lowStockItems = products.filter(p => p.quantity <= (p.reorderPoint || 30));

  const handleQuickReorder = (prod) => {
    const newQty = prod.quantity + 50;
    updateProduct(prod.id, { quantity: newQty });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800">Low Stock Alerts</h3>
        <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">View All →</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-2.5 px-3">SKU</th>
              <th className="py-2.5 px-3">Product Name</th>
              <th className="py-2.5 px-3 text-center">Current Stock</th>
              <th className="py-2.5 px-3 text-center">Reorder Point</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {lowStockItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                  All items are sufficiently stocked!
                </td>
              </tr>
            ) : (
              lowStockItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-500">{item.sku}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">{item.name}</td>
                  <td className="py-3 px-3 text-center font-bold text-rose-600">{item.quantity}</td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-500">{item.reorderPoint || 30}</td>
                  <td className="py-3 px-3 text-center">
                    <StatusBadge status={item.quantity === 0 ? 'Critical' : 'Warning'} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleQuickReorder(item)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors text-[11px]"
                    >
                      + Reorder (50)
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
