import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { ActionBadge } from '../common/Badge';
import { getDiceBearAvatar } from '../../utils/avatar';

export const RecentActivity = () => {
  const { activities, setCurrentView } = useInventory();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
        <button
          onClick={() => setCurrentView('inventory')}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              <th className="pb-3 pl-2">Product Name</th>
              <th className="pb-3">Action</th>
              <th className="pb-3">User</th>
              <th className="pb-3 text-right pr-2">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {(activities || []).length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-xs text-slate-400 font-medium">
                  No recent activity logged.
                </td>
              </tr>
            ) : (
              (activities || []).slice(0, 5).map((act) => (
              <tr key={act.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 pl-2 font-semibold text-slate-800 max-w-xs truncate">
                  {act.productName}
                </td>
                <td className="py-3.5">
                  <ActionBadge action={act.action} />
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <img
                      src={getDiceBearAvatar(act.user || 'Staff User')}
                      alt={act.user}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200 bg-slate-100"
                    />
                    <span className="text-xs font-semibold text-slate-700">{act.user}</span>
                  </div>
                </td>
                <td className="py-3.5 text-right pr-2 text-xs font-medium text-slate-500">
                  {act.time}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
