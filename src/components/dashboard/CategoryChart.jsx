import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Electronics', value: 45, color: '#0052CC' },
  { name: 'Furniture', value: 30, color: '#00875A' },
  { name: 'Office Supplies', value: 15, color: '#9E6A03' },
  { name: 'Other', value: 10, color: '#6B778C' },
];

export const CategoryChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-800 mb-2">Category Distribution</h3>

      <div className="h-52 w-full my-auto flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '8px',
                border: 'none',
                color: '#FFF',
                fontSize: '12px'
              }}
              formatter={(val) => [`${val}%`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 mt-2 pt-3 border-t border-slate-100">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="font-semibold text-slate-700">{item.name}</span>
            </div>
            <span className="font-bold text-slate-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
