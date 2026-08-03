import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Search, ArrowUpDown, DollarSign, TrendingUp, Filter, ShieldAlert } from 'lucide-react';
import { StatusBadge } from '../common/Badge';

export const ValuationTable = () => {
  const { products, categories } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState('valuation'); // 'valuation', 'quantity', 'margin', 'name'
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        if (sortField === 'valuation') {
          valA = (Number(a.buyingPrice) || 0) * (Number(a.quantity) || 0);
          valB = (Number(b.buyingPrice) || 0) * (Number(b.quantity) || 0);
        } else if (sortField === 'quantity') {
          valA = Number(a.quantity) || 0;
          valB = Number(b.quantity) || 0;
        } else if (sortField === 'margin') {
          const buyA = Number(a.buyingPrice) || 1;
          const sellA = Number(a.sellingPrice) || 1;
          valA = ((sellA - buyA) / buyA) * 100;

          const buyB = Number(b.buyingPrice) || 1;
          const sellB = Number(b.sellingPrice) || 1;
          valB = ((sellB - buyB) / buyB) * 100;
        } else {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          if (sortOrder === 'asc') return valA.localeCompare(valB);
          return valB.localeCompare(valA);
        }

        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [products, searchTerm, selectedCategory, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Totals calculations
  const totalQty = filteredProducts.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  const totalCostValuation = filteredProducts.reduce(
    (sum, p) => sum + (Number(p.buyingPrice || 0) * Number(p.quantity || 0)),
    0
  );
  const totalRetailValuation = filteredProducts.reduce(
    (sum, p) => sum + (Number(p.sellingPrice || 0) * Number(p.quantity || 0)),
    0
  );
  const totalGrossProfit = totalRetailValuation - totalCostValuation;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Inventory Valuation & Analytics Breakdown</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Detailed asset cost basis, retail revenue potential, and profit margins per product line.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600 w-52 font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Product Details</th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('quantity')}>
                <div className="flex items-center gap-1">
                  <span>Stock Units</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Buying / Selling</th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('valuation')}>
                <div className="flex items-center gap-1">
                  <span>Cost Basis Value</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Retail Potential</th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('margin')}>
                <div className="flex items-center gap-1">
                  <span>Gross Margin</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-slate-400 font-medium">
                  No matching inventory items found for analytics.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const qty = Number(p.quantity) || 0;
                const buy = Number(p.buyingPrice) || 0;
                const sell = Number(p.sellingPrice) || 0;
                const costValuation = qty * buy;
                const retailValuation = qty * sell;
                const margin = buy > 0 ? (((sell - buy) / buy) * 100).toFixed(1) : '0.0';

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Name & SKU */}
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {p.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-medium">
                            <span className="font-mono bg-slate-100 px-1 rounded">{p.sku}</span>
                            <span>•</span>
                            <span>{p.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Stock Units */}
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {qty.toLocaleString()} units
                    </td>

                    {/* Unit Prices */}
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      <div>Rs. {buy.toFixed(2)} cost</div>
                      <div className="text-[11px] text-slate-400">Rs. {sell.toFixed(2)} retail</div>
                    </td>

                    {/* Cost Valuation */}
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      Rs. {costValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Retail Valuation */}
                    <td className="py-3.5 px-4 font-bold text-blue-700">
                      Rs. {retailValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Margin % */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-md border border-emerald-200/60">
                        <TrendingUp className="w-3 h-3" /> +{margin}%
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Summary Footer Row */}
          {filteredProducts.length > 0 && (
            <tfoot className="bg-slate-900 text-white text-xs font-bold border-t-2 border-slate-800">
              <tr>
                <td className="py-4 px-4 uppercase tracking-wider text-slate-400 font-black">
                  Total Summary ({filteredProducts.length} Items)
                </td>
                <td className="py-4 px-4 font-extrabold text-white text-sm">
                  {totalQty.toLocaleString()} units
                </td>
                <td className="py-4 px-4 text-slate-400 font-normal text-[11px]">
                  Aggregated Metrics
                </td>
                <td className="py-4 px-4 font-black text-emerald-400 text-sm">
                  Rs. {totalCostValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-4 px-4 font-extrabold text-blue-300 text-sm">
                  Rs. {totalRetailValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-4 px-4 font-black text-amber-400 text-xs">
                  +Rs. {totalGrossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Profit
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-1 rounded">
                    Audit Verified
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
