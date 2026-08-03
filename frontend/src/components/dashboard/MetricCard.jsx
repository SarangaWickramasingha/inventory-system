import React from 'react';
import { Package, Shapes, AlertTriangle, AlertCircle, TrendingUp, TrendingDown, Minus, DollarSign, Activity } from 'lucide-react';

export const MetricCard = ({ title, value, change, changeType, iconType, onClick, subtitle }) => {
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
  } else if (iconType === 'valuation') {
    Icon = DollarSign;
    iconBg = 'bg-emerald-50 text-emerald-600';
  } else if (iconType === 'activity') {
    Icon = Activity;
    iconBg = 'bg-sky-50 text-sky-600';
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
      className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs card-hover cursor-pointer flex flex-col justify-between transition-all ${
        onClick ? 'hover:border-blue-300' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2.5xl font-black text-slate-900 tracking-tight">{value}</div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-semibold mt-1.5 ${changeColor}`}>
            <ChangeIcon className="w-3.5 h-3.5" />
            <span>{change}</span>
          </div>
        )}
        {subtitle && (
          <p className="text-[11px] font-medium text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
