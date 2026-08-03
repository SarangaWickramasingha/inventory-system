import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MoreVertical } from 'lucide-react';

const data = [
  { month: 'Jan', stock: 680 },
  { month: 'Feb', stock: 790 },
  { month: 'Mar', stock: 820 },
  { month: 'Apr', stock: 960 },
  { month: 'May', stock: 1040 },
  { month: 'Jun', stock: 1120 },
  { month: 'Jul', stock: 1240 },
];

export const StockChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800">Stock Levels Over Time</h3>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1 rounded">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12 }}
              domain={[0, 1400]}
              ticks={[0, 200, 400, 600, 800, 1000, 1200, 1400]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '10px',
                border: 'none',
                color: '#FFF',
                fontSize: '12px',
                fontWeight: '600'
              }}
              formatter={(value) => [`${value} units`, 'Total Stock']}
            />
            <Area
              type="monotone"
              dataKey="stock"
              stroke="#2563EB"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#stockGradient)"
              dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#FFF' }}
              activeDot={{ r: 6, fill: '#1D4ED8', strokeWidth: 3, stroke: '#FFF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
