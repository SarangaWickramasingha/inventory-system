import React from 'react';
import { DollarSign, ArrowUpRight, Award, TrendingUp } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const ReportKpis = () => {
  const { products, categories, activities } = useInventory();

  // Dynamic calculations
  const totalCostValuation = products.reduce(
    (sum, p) => sum + (Number(p.buyingPrice || 0) * Number(p.quantity || 0)),
    0
  );

  const totalRetailValuation = products.reduce(
    (sum, p) => sum + (Number(p.sellingPrice || 0) * Number(p.quantity || 0)),
    0
  );

  const totalUnits = products.reduce(
    (sum, p) => sum + Number(p.quantity || 0),
    0
  );

  // Top category by total stock quantity
  const categoryQtyMap = {};
  products.forEach(p => {
    categoryQtyMap[p.category] = (categoryQtyMap[p.category] || 0) + Number(p.quantity || 0);
  });

  let topCategory = 'General';
  let maxQty = 0;
  Object.keys(categoryQtyMap).forEach(cat => {
    if (categoryQtyMap[cat] > maxQty) {
      maxQty = categoryQtyMap[cat];
      topCategory = cat;
    }
  });

  const grossProfitMargin = totalCostValuation > 0
    ? (((totalRetailValuation - totalCostValuation) / totalCostValuation) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Asset Valuation */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            TOTAL ASSET VALUATION
          </span>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2.5xl font-black text-slate-900 tracking-tight">
            Rs. {totalCostValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Cost basis inventory value</span>
          </div>
        </div>
      </div>

      {/* Retail Market Potential */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            RETAIL VALUE POTENTIAL
          </span>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2.5xl font-black text-slate-900 tracking-tight">
            Rs. {totalRetailValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{grossProfitMargin}% projected gross margin</span>
          </div>
        </div>
      </div>

      {/* Total Inventory Stock Units */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            TOTAL STOCK UNITS
          </span>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2.5xl font-black text-slate-900 tracking-tight">
            {totalUnits.toLocaleString()} units
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Across {products.length} product lines & {categories.length} categories
          </p>
        </div>
      </div>

      {/* Top Performing Category */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            TOP STOCK CATEGORY
          </span>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2.5xl font-black text-slate-900 truncate">{topCategory}</div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {maxQty.toLocaleString()} units in active stock
          </p>
        </div>
      </div>
    </div>
  );
};
