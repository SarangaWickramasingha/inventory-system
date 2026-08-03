import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChevronDown } from 'lucide-react';

const movementData = [
  { month: 'Jan', inbound: 1500, outbound: 800 },
  { month: 'Feb', inbound: 1800, outbound: 1200 },
  { month: 'Mar', inbound: 1400, outbound: 950 },
  { month: 'Apr', inbound: 1600, outbound: 1100 },
  { month: 'May', inbound: 2400, outbound: 1800 },
  { month: 'Jun', inbound: 2600, outbound: 2100 },
];

export const StockMovementChart = () => {
  const [timeRange, setTimeRange] = useState('Last 6 Months');

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800">Monthly Stock Movement</h3>
        </div>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="Last Year">Last Year</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={movementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '8px',
                border: 'none',
                color: '#FFF',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="inbound" name="Inbound" fill="#0052CC" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outbound" name="Outbound" fill="#94A3B8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-700 rounded-sm"></span>
          <span>Inbound</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-slate-400 rounded-sm"></span>
          <span>Outbound</span>
        </div>
      </div>
    </div>
  );
};
