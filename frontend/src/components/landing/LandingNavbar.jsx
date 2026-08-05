import React from 'react';
import { Box, ArrowRight } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const LandingNavbar = () => {
  const { setCurrentView } = useInventory();

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setCurrentView('landing')}>
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Box className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">StockFlow</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <button onClick={() => setCurrentView('features')} className="hover:text-blue-600 transition-colors font-semibold">
            Features
          </button>
          <button onClick={() => setCurrentView('about')} className="hover:text-blue-600 transition-colors font-semibold">
            About
          </button>
          <button onClick={() => setCurrentView('contact')} className="hover:text-blue-600 transition-colors font-semibold">
            Contact
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('login')}
            className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => setCurrentView('register')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            Sign Up as Staff <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
