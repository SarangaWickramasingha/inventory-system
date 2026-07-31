import React from 'react';
import { LayoutDashboard, Package, Shapes, BarChart3, Users, Settings, Plus, Box } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const Sidebar = () => {
  const { currentView, setCurrentView } = useInventory();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'categories', label: 'Categories', icon: Shapes },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-20 select-none">
      <div>
        {/* Brand Header */}
        <div
          onClick={() => setCurrentView('landing')}
          className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          title="Go to Home Landing Page"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md text-white">
            <Box className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">StockFlow</h1>
            <p className="text-xs font-medium text-slate-400">Enterprise ERP</p>
          </div>
        </div>


        {/* Navigation Items */}
        <nav className="mt-2 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.id === 'inventory' && (currentView === 'add-product' || currentView === 'edit-product'));

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-blue-600 rounded-l-full"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100">
        {currentView !== 'add-product' && currentView !== 'edit-product' && (
          <button
            onClick={() => setCurrentView('add-product')}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> New Product
          </button>
        )}
      </div>
    </aside>
  );
};
