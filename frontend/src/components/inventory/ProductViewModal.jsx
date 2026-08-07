import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import { Edit3, Package, DollarSign, Tag, Layers, Truck } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const ProductViewModal = ({ productId, isOpen, onClose }) => {
  const { products, navigateToEdit } = useInventory();
  const product = products.find(p => p.id === productId);

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details" maxWidth="max-w-2xl">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="w-full md:w-1/3">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-xl border border-slate-200"
            />
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex gap-2 mt-2">
                {product.additionalImages.map((img, idx) => (
                  <img key={idx} src={img} alt="Thumbnail" className="w-12 h-12 rounded object-cover border border-slate-200" />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full md:w-2/3 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={product.status} />
                <span className="text-xs font-semibold text-slate-400">SKU: {product.sku}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Category</span>
                <p className="font-bold text-slate-800">{product.category || product.category_name || 'Uncategorized'}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Brand</span>
                <p className="font-bold text-slate-800">{product.brand || 'N/A'}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Buying Price</span>
                <p className="font-bold text-slate-700">Rs. {Number(product.buyingPrice ?? product.cost_price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Selling Price</span>
                <p className="font-bold text-blue-600">Rs. {Number(product.sellingPrice ?? product.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Current Stock</span>
                <p className="font-bold text-slate-900">{product.quantity} units</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Supplier</span>
                <p className="font-bold text-slate-800">{product.supplier || 'Standard Supply'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              navigateToEdit(product.id);
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" /> Edit Product
          </button>
        </div>
      </div>
    </Modal>
  );
};
