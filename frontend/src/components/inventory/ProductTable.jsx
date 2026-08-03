import React, { useState } from 'react';
import { Eye, Edit3, Trash2, ChevronLeft, ChevronRight, Sliders } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { StatusBadge } from '../common/Badge';
import { StockAdjustModal } from './StockAdjustModal';

const getProductStatus = (prod) => {
  const qty = Number(prod.quantity ?? 0);
  const reorder = Number(prod.reorderPoint ?? prod.min_stock_alert ?? 5);
  if (qty === 0) return 'Out of Stock';
  if (qty <= reorder) return 'Low Stock';
  return 'In Stock';
};

export const ProductTable = ({ products, onSelectView, onSelectEdit, onSelectAdjust }) => {
  const { deleteProduct } = useInventory();
  const [currentPage, setCurrentPage] = useState(1);
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3.5 px-4">Image</th>
              <th className="py-3.5 px-4">Product Name</th>
              <th className="py-3.5 px-4">SKU</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-center">Quantity</th>
              <th className="py-3.5 px-4 text-right">Buying Price</th>
              <th className="py-3.5 px-4 text-right">Selling Price</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {displayedProducts.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">
                  No products found matching your filter criteria.
                </td>
              </tr>
            ) : (
              displayedProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100"
                    />
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 max-w-xs">
                    {prod.name}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-slate-500 font-semibold">
                    {prod.sku}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {prod.category || prod.category_name || 'Uncategorized'}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800">
                    {prod.quantity ?? 0}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-600">
                    Rs. {Number(prod.buyingPrice ?? prod.cost_price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    Rs. {Number(prod.sellingPrice ?? prod.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={getProductStatus(prod)} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400">
                      <button
                        onClick={() => onSelectView(prod.id)}
                        className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setAdjustingProduct(prod)}
                        className="p-1.5 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Adjust Stock Quantity"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSelectEdit(prod.id)}
                        className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <p className="text-xs font-semibold text-slate-500">
          Showing <span className="font-bold text-slate-800">{products.length === 0 ? 0 : startIndex + 1}</span> to{' '}
          <span className="font-bold text-slate-800">{Math.min(startIndex + itemsPerPage, products.length)}</span> of{' '}
          <span className="font-bold text-slate-800">{products.length}</span> results
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-50 text-slate-600 flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 text-xs font-bold rounded-lg border transition-colors ${
                currentPage === num
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-50 text-slate-600 flex items-center gap-1"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustModal
        isOpen={Boolean(adjustingProduct)}
        onClose={() => setAdjustingProduct(null)}
        product={adjustingProduct}
      />
    </div>
  );
};
