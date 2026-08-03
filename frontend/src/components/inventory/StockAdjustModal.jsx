import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Sliders, AlertTriangle, CheckCircle2, Package, User, Plus, Minus, RotateCcw } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const StockAdjustModal = ({
  isOpen,
  onClose,
  product: initialProduct = null,
  initialType = 'IN'
}) => {
  const { products, adjustStock, profile } = useInventory();

  const [selectedProductId, setSelectedProductId] = useState(initialProduct?.id || (products[0]?.id || ''));
  const [movementType, setMovementType] = useState(initialType === 'OUT' ? 'OUT' : 'IN'); // 'IN', 'OUT'
  const [quantity, setQuantity] = useState(10);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync when props change or modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialProduct?.id) {
        setSelectedProductId(initialProduct.id);
      } else if (products.length > 0 && !selectedProductId) {
        setSelectedProductId(products[0].id);
      }
      setMovementType(initialType === 'OUT' ? 'OUT' : 'IN');
      setQuantity(10);
      setNotes('');
      setErrorMsg('');
    }
  }, [isOpen, initialProduct, initialType, products]);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || initialProduct || products[0];

  const currentQty = currentProduct ? Number(currentProduct.quantity || 0) : 0;
  const numQty = Math.max(0, Number(quantity) || 0);

  // Calculate new quantity projection
  let projectedQty = currentQty;
  if (movementType === 'IN') {
    projectedQty = currentQty + numQty;
  } else if (movementType === 'OUT') {
    projectedQty = currentQty - numQty;
  }

  // Calculate projected status
  const reorderPoint = Number(currentProduct?.reorderPoint ?? currentProduct?.min_stock_alert ?? 5);
  let projectedStatus = 'In Stock';
  let projectedBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';

  if (projectedQty <= 0) {
    projectedStatus = 'Out of Stock';
    projectedBadgeClass = 'bg-rose-100 text-rose-800 border-rose-200';
  } else if (projectedQty <= reorderPoint) {
    projectedStatus = 'Low Stock';
    projectedBadgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
  }

  const isNegativeError = projectedQty < 0;

  const handleQuickPreset = (delta) => {
    setErrorMsg('');
    setQuantity(prev => Math.max(1, (Number(prev) || 0) + delta));
  };

  const presetReasons = [
    { label: '📦 Stock Receiving', type: 'IN', text: 'Received shipment from supplier' },
    { label: '🛒 Customer Order Dispatch', type: 'OUT', text: 'Dispatched for customer order fulfillment' },
    { label: '⚠️ Damaged / Defective', type: 'OUT', text: 'Damaged item written off after inspection' },
    { label: '🔄 Customer Return', type: 'IN', text: 'Item returned by customer in original condition' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentProduct) {
      setErrorMsg('Please select a valid product.');
      return;
    }

    if (numQty <= 0 && movementType !== 'ADJUSTMENT') {
      setErrorMsg('Quantity must be greater than 0.');
      return;
    }

    if (isNegativeError) {
      setErrorMsg(`Cannot remove ${numQty} items. Current stock is only ${currentQty}.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const result = await adjustStock(
        currentProduct.id,
        movementType,
        numQty,
        notes || (movementType === 'IN' ? 'Stock received' : movementType === 'OUT' ? 'Stock dispatched' : 'Stock level adjusted')
      );

      if (result?.success) {
        onClose();
      } else if (result?.message) {
        setErrorMsg(result.message);
      }
    } catch (err) {
      console.error('Adjustment failed', err);
      setErrorMsg('An unexpected error occurred during adjustment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sliders className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Stock Movement & Adjustment</h3>
              <p className="text-xs text-slate-400">Log stock transactions with instant inventory updating</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Product Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Product <span className="text-rose-500">*</span>
            </label>
            {initialProduct ? (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{currentProduct.name}</h4>
                    <p className="text-xs text-slate-500">
                      SKU: <span className="font-mono font-medium text-slate-700">{currentProduct.sku}</span> • {currentProduct.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium">Current Stock</span>
                  <p className="text-sm font-extrabold text-slate-900">{currentQty} pcs</p>
                </div>
              </div>
            ) : (
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) — Stock: {p.quantity} pcs
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Movement Type Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Transaction Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setMovementType('IN'); setErrorMsg(''); }}
                className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  movementType === 'IN'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>STOCK IN</span>
                </div>
                <span className="text-[10px] opacity-80 font-normal">(Receiving / Add)</span>
              </button>

              <button
                type="button"
                onClick={() => { setMovementType('OUT'); setErrorMsg(''); }}
                className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  movementType === 'OUT'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20 ring-2 ring-rose-600/30'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>STOCK OUT</span>
                </div>
                <span className="text-[10px] opacity-80 font-normal">(Dispatch / Deduct)</span>
              </button>
            </div>
          </div>

          {/* Quantity Input & Quick Modifier Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quantity Count
              </label>
              <span className="text-xs text-slate-500 font-medium">Quick Modifiers:</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset(-10)}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                title="Decrease by 10"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(-1)}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                title="Decrease by 1"
              >
                -1
              </button>

              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter quantity"
                className="w-full text-center py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-lg font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />

              <button
                type="button"
                onClick={() => handleQuickPreset(1)}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                title="Increase by 1"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(10)}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                title="Increase by 10"
              >
                +10
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(50)}
                className="px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors"
                title="Increase by 50"
              >
                +50
              </button>
            </div>
          </div>

          {/* Live Calculation Preview Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
              <span>Transaction Calculation Preview</span>
              <span className="text-slate-700">{movementType}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Current Stock</span>
                <p className="text-base font-extrabold text-slate-800">{currentQty} <span className="text-xs font-normal text-slate-500">pcs</span></p>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Delta Shift</span>
                <p className={`text-base font-extrabold ${
                  movementType === 'IN' ? 'text-emerald-600' : movementType === 'OUT' ? 'text-rose-600' : 'text-amber-600'
                }`}>
                  {movementType === 'IN' ? `+${numQty}` : movementType === 'OUT' ? `-${numQty}` : `➔ ${numQty}`}
                </p>
              </div>

              <div className={`p-2.5 bg-white rounded-xl border ${isNegativeError ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">New Projected</span>
                <p className={`text-base font-extrabold ${isNegativeError ? 'text-rose-600' : 'text-slate-900'}`}>
                  {projectedQty} <span className="text-xs font-normal text-slate-500">pcs</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 font-medium">New Item Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${projectedBadgeClass}`}>
                {projectedStatus}
              </span>
            </div>
          </div>

          {/* Preset Notes / Quick Badges */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason / Audit Notes
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {presetReasons.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setNotes(preset.text);
                    if (preset.type) setMovementType(preset.type);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add optional transaction reference, PO number, or audit notes..."
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isNegativeError}
              className={`px-6 py-2.5 rounded-xl font-extrabold text-xs text-white shadow-md transition-all flex items-center gap-2 ${
                isNegativeError
                  ? 'bg-slate-400 cursor-not-allowed opacity-60'
                  : movementType === 'IN'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              {isSubmitting ? (
                <>Processing Transaction...</>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Stock {movementType}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustModal;
