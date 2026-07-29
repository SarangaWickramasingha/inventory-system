import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const Toast = () => {
  const { toast } = useInventory();
  if (!toast) return null;

  const { message, type } = toast;

  let bg = 'bg-slate-900 text-white border-slate-700';
  let Icon = CheckCircle;
  let iconColor = 'text-emerald-400';

  if (type === 'warning') {
    Icon = AlertTriangle;
    iconColor = 'text-amber-400';
  } else if (type === 'error') {
    Icon = XCircle;
    iconColor = 'text-rose-400';
  } else if (type === 'info') {
    Icon = Info;
    iconColor = 'text-blue-400';
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border ${bg}`}>
        <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
        <p className="text-sm font-medium pr-2">{message}</p>
      </div>
    </div>
  );
};
