import React from 'react';
import { DollarSign, ArrowUpRight, TrendingUp, Award } from 'lucide-react';

export const ReportKpis = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Inventory Value */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL INVENTORY VALUE</span>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">$1.24M</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑4.2%
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">vs last month ($1.19M)</p>
        </div>
      </div>

      {/* Monthly Movement */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">MONTHLY MOVEMENT</span>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">14,289</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑12.5%
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">Items received/shipped</p>
        </div>
      </div>

      {/* Top Selling Category */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOP SELLING CATEGORY</span>
          <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-extrabold text-slate-900">Electronics</div>
          <div className="flex items-center justify-between mt-1 text-xs">
            <span className="text-slate-400 font-medium">32% of total sales</span>
            <span className="font-bold text-blue-600 cursor-pointer hover:underline">View Details</span>
          </div>
        </div>
      </div>
    </div>
  );
};
