import React from 'react';
import { Package, Shapes, AlertTriangle, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const MetricCard = ({ title, value, change, changeType, iconType, onClick }) => {
  let Icon = Package;
  let iconBg = 'bg-blue-50 text-blue-600';
  let changeColor = 'text-emerald-600';
  let ChangeIcon = TrendingUp;

  if (iconType === 'categories') {
    Icon = Shapes;
    iconBg = 'bg-indigo-50 text-indigo-600';
  } else if (iconType === 'low-stock') {
    Icon = AlertTriangle;
    iconBg = 'bg-amber-50 text-amber-600';
  } else if (iconType === 'out-stock') {
    Icon = AlertCircle;
    iconBg = 'bg-rose-50 text-rose-600';
  }

  if (changeType === 'negative') {
    changeColor = 'text-rose-600';
    ChangeIcon = TrendingDown;
  } else if (changeType === 'neutral') {
    changeColor = 'text-slate-500';
    ChangeIcon = Minus;
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs card-hover cursor-pointer flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        <div className={`flex items-center gap-1 text-xs font-semibold mt-1.5 ${changeColor}`}>
          <ChangeIcon className="w-3.5 h-3.5" />
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
};
