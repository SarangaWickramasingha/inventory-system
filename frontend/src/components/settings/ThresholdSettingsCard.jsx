import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Sliders, Bell, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

export const ThresholdSettingsCard = () => {
  const { showToast } = useInventory();
  const [defaultThreshold, setDefaultThreshold] = useState('30');
  const [criticalThreshold, setCriticalThreshold] = useState('5');
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);
  const [enableDashboardAlerts, setEnableDashboardAlerts] = useState(true);
  const [autoReorderFlag, setAutoReorderFlag] = useState(false);

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    showToast('Low-stock threshold settings updated successfully!');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Sliders className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Low-Stock & Reorder Thresholds</h3>
            <p className="text-xs text-slate-500 font-medium">
              Configure global system inventory warning triggers and automated alerts.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-[11px] rounded-full">
          Active Monitor
        </span>
      </div>

      <form onSubmit={handleSaveThresholds} className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Default Reorder Threshold */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Default Low-Stock Threshold
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="1000"
                value={defaultThreshold}
                onChange={(e) => setDefaultThreshold(e.target.value)}
                className="w-full pl-4 pr-14 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none select-none">
                units
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Products with quantity at or below this value trigger "Low Stock" status.
            </p>
          </div>

          {/* Critical Threshold */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Critical Warning Level
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(e.target.value)}
                className="w-full pl-4 pr-14 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none select-none">
                units
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Triggers urgent red notification banners on the operational dashboard.
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Notification Rules
          </h4>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-xs font-bold text-slate-800">Dashboard Warning Banners</div>
                <div className="text-[11px] text-slate-500">Show alert badges when stock dips below reorder point</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableDashboardAlerts}
              onChange={(e) => setEnableDashboardAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80 transition-colors">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-800">Auto-Flag PO Reorder Queue</div>
                <div className="text-[11px] text-slate-500">Automatically queue low stock items in supplier reorder tab</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoReorderFlag}
              onChange={(e) => setAutoReorderFlag(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save Threshold Settings
          </button>
        </div>
      </form>
    </div>
  );
};
