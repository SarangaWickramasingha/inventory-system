import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useInventory } from '../../context/InventoryContext';
import { Layers } from 'lucide-react';

const BAR_COLORS = ['#2563EB', '#0D9488', '#D97706', '#8B5CF6', '#EC4899', '#0284C7', '#64748B'];

export const CategoryStockBarChart = () => {
  const { products, categories } = useInventory();

  // Aggregate quantity per category dynamically
  const categoryData = (categories || []).map((cat, index) => {
    const catName = (cat?.name || '').toLowerCase();
    const matchingProducts = (products || []).filter(p => {
      const prodCat = (p?.category || p?.category_name || '').toLowerCase();
      return prodCat === catName;
    });

    const totalQty = matchingProducts.reduce((sum, p) => sum + (Number(p?.quantity) || 0), 0);
    const totalValuation = matchingProducts.reduce(
      (sum, p) => sum + ((Number(p?.quantity) || 0) * (Number(p?.buyingPrice ?? p?.price) || 0)),
      0
    );

    return {
      name: cat?.name || 'Uncategorized',
      stockUnits: totalQty,
      valuation: totalValuation,
      color: cat?.color || BAR_COLORS[index % BAR_COLORS.length]
    };
  });

  const totalStockAllCategories = categoryData.reduce((sum, c) => sum + c.stockUnits, 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Layers className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
              Stock Quantity by Category
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Total stock units allocated across product categories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700">
            {totalStockAllCategories.toLocaleString()} Total Units
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData} margin={{ top: 15, right: 20, left: 10, bottom: 55 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              interval={0}
              height={60}
              tick={(props) => {
                const { x, y, payload } = props;
                const rawText = payload.value || '';
                const displayLabel = rawText.length > 20 ? `${rawText.substring(0, 18)}…` : rawText;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={14}
                      dx={-4}
                      textAnchor="end"
                      fill="#64748B"
                      fontSize={11}
                      fontWeight={600}
                      transform="rotate(-20)"
                    >
                      {displayLabel}
                    </text>
                  </g>
                );
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '12px',
                border: 'none',
                color: '#FFF',
                fontSize: '12px',
                padding: '10px 14px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
              }}
              formatter={(value, name, item) => [
                `${value.toLocaleString()} units (Valuation: Rs. ${item.payload.valuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
                'Stock Quantity'
              ]}
              labelStyle={{ fontWeight: 'bold', color: '#94A3B8', marginBottom: '4px' }}
            />
            <Bar dataKey="stockUnits" radius={[8, 8, 0, 0]} maxBarSize={44}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} hover={{ opacity: 0.85 }} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
