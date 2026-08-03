import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useInventory } from '../../context/InventoryContext';
import { PieChart as PieIcon } from 'lucide-react';

const FALLBACK_COLORS = ['#2563EB', '#0D9488', '#D97706', '#8B5CF6', '#EC4899', '#0284C7', '#64748B'];

export const CategoryChart = () => {
  const { products, categories } = useInventory();

  const totalProductsCount = products.length || 1;

  // Compute category breakdown dynamically
  const data = (categories || []).map((cat, index) => {
    const catName = (cat?.name || '').toLowerCase();
    const count = (products || []).filter(p => {
      const prodCat = (p?.category || p?.category_name || '').toLowerCase();
      return prodCat === catName;
    }).length;
    const share = Math.round((count / totalProductsCount) * 100) || 0;

    return {
      name: cat?.name || 'Uncategorized',
      value: count,
      share: share,
      color: cat?.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
    };
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <PieIcon className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Category Distribution</h3>
          <p className="text-xs text-slate-500 font-medium">Product count breakdown by category</p>
        </div>
      </div>

      <div className="h-52 w-full my-auto flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '10px',
                border: 'none',
                color: '#FFF',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              formatter={(val, name, item) => [`${val} products (${item.payload.share}%)`, 'Count']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900">{products.length}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Items</span>
        </div>
      </div>

      <div className="space-y-2.5 mt-2 pt-3 border-t border-slate-100 max-h-48 overflow-y-auto">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="font-semibold text-slate-700">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-400 text-[11px]">{item.value} items</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {item.share}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
