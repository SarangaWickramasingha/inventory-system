import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { ArrowUpRight, ArrowDownRight, RefreshCcw, History, Filter, User, Calendar } from 'lucide-react';

export const StockMovementTimeline = () => {
  const { stockLogs, activities } = useInventory();
  const [movementFilter, setMovementFilter] = useState('ALL'); // 'ALL', 'IN', 'OUT', 'ADJUSTMENT'

  // Map real backend MySQL stock_logs array
  const backendLogs = (stockLogs || []).map((l) => {
    const rawVal = Math.abs(Number(l.rawQuantityChanged ?? l.quantityChanged ?? l.quantity_changed ?? l.quantity ?? 0));
    const logType = (l.type || 'IN').toUpperCase();
    
    let qtyDisplay = `${rawVal} units`;
    if (logType === 'IN') {
      qtyDisplay = `+${rawVal} units`;
    } else if (logType === 'OUT') {
      qtyDisplay = `-${rawVal} units`;
    } else {
      qtyDisplay = `Adjusted (${l.previousQuantity ?? 0} → ${l.newQuantity ?? rawVal})`;
    }

    return {
      id: l.id ? `backend-${l.id}` : Math.random().toString(),
      type: logType,
      productName: l.productName || l.product_name || 'Inventory Item',
      sku: l.sku || 'N/A',
      qtyChange: qtyDisplay,
      user: l.user || l.user_name || 'System Administrator',
      role: l.userRole ? (l.userRole || '').toUpperCase() : 'STAFF',
      time: l.createdAt || l.created_at || 'Recently',
      note: l.notes || `Stock ${logType} movement recorded`
    };
  });

  // Fallback to activities if backend logs are empty
  const allLogs = backendLogs.length > 0 ? backendLogs : activities.map((act, i) => ({
    id: act.id || `act-${i}`,
    type: act.action === 'Added' ? 'IN' : act.action === 'Removed' ? 'OUT' : 'ADJUSTMENT',
    productName: act.productName || 'Inventory Item',
    sku: `SKU-${1000 + (i % 20)}`,
    qtyChange: act.action === 'Added' ? '+25 units' : act.action === 'Removed' ? '-10 units' : 'Updated',
    user: act.user || 'System Administrator',
    role: 'ADMIN',
    time: act.time || 'Recently',
    note: `Action performed: ${act.action}`
  }));

  const filteredLogs = allLogs.filter(log => {
    if (movementFilter === 'ALL') return true;
    return log.type === movementFilter;
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <History className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
              Stock Movement Audit Timeline
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Chronological log of inventory receipts, disbursements, and manual stock adjustments.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setMovementFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              movementFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setMovementFilter('IN')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              movementFilter === 'IN' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Inbound (IN)
          </button>
          <button
            onClick={() => setMovementFilter('OUT')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              movementFilter === 'OUT' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Outbound (OUT)
          </button>
          <button
            onClick={() => setMovementFilter('ADJUSTMENT')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              movementFilter === 'ADJUSTMENT' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Adjustments
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {filteredLogs.slice(0, 8).map((log) => {
          let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          let Icon = ArrowUpRight;
          let iconColor = 'bg-emerald-500 text-white';

          if (log.type === 'OUT') {
            badgeBg = 'bg-rose-100 text-rose-800 border-rose-200';
            Icon = ArrowDownRight;
            iconColor = 'bg-rose-500 text-white';
          } else if (log.type === 'ADJUSTMENT') {
            badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';
            Icon = RefreshCcw;
            iconColor = 'bg-amber-500 text-white';
          }

          return (
            <div key={log.id} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 shadow-xs ${iconColor}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Card Container */}
              <div className="bg-slate-50 hover:bg-slate-100/80 rounded-xl p-4 transition-colors border border-slate-200/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${badgeBg}`}>
                      {log.type}
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900">{log.productName}</h4>
                    <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {log.sku}
                    </span>
                  </div>

                  <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs self-start sm:self-auto">
                    {log.qtyChange}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200/50 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{log.user} ({log.role})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="italic">{log.note}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <Calendar className="w-3 h-3 text-slate-400" /> {log.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
