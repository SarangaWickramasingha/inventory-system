import React from 'react';

export const StatusBadge = ({ status }) => {
  let bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dotClass = 'bg-emerald-500';

  if (status === 'Low Stock' || status === 'Warning') {
    bgClass = 'bg-amber-50 text-amber-700 border-amber-200';
    dotClass = 'bg-amber-500';
  } else if (status === 'Out of Stock' || status === 'Critical') {
    bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
    dotClass = 'bg-rose-500';
  }

  return (
    <span className={`inline-flex items-center justify-center gap-1.5 w-28 py-1 rounded-full text-xs font-semibold border ${bgClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`}></span>
      <span className="whitespace-nowrap">{status}</span>
    </span>
  );
};

export const ActionBadge = ({ action }) => {
  let style = 'bg-emerald-100 text-emerald-800';
  if (action === 'Updated') {
    style = 'bg-blue-100 text-blue-800';
  } else if (action === 'Removed') {
    style = 'bg-rose-100 text-rose-800';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${style}`}>
      {action === 'Added' && '+ '}
      {action === 'Updated' && '⟳ '}
      {action === 'Removed' && '- '}
      {action}
    </span>
  );
};
