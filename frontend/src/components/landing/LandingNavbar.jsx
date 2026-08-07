import React from 'react';
import { Box, ArrowRight } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const LandingNavbar = () => {
  const { currentView, setCurrentView } = useInventory();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 py-3.5 shadow-2xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
        {/* Brand Logo & Name */}
        <div
          className={`flex items-center gap-3 cursor-pointer transition-all py-1 ${
            currentView === 'landing' ? 'opacity-100' : 'hover:opacity-80'
          }`}
          onClick={() => setCurrentView('landing')}
          title="StockFlow Home"
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Box className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">StockFlow</span>
        </div>

        {/* Center Page Nav Links with Blue Highlight Underline */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <button
            onClick={() => setCurrentView('features')}
            className={`py-1 text-sm transition-all ${
              currentView === 'features'
                ? 'text-blue-600 font-extrabold border-b-[3px] border-blue-600'
                : 'text-slate-600 hover:text-blue-600 font-semibold border-b-[3px] border-transparent'
            }`}
          >
            Features
          </button>
          <button
            onClick={() => setCurrentView('about')}
            className={`py-1 text-sm transition-all ${
              currentView === 'about'
                ? 'text-blue-600 font-extrabold border-b-[3px] border-blue-600'
                : 'text-slate-600 hover:text-blue-600 font-semibold border-b-[3px] border-transparent'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setCurrentView('contact')}
            className={`py-1 text-sm transition-all ${
              currentView === 'contact'
                ? 'text-blue-600 font-extrabold border-b-[3px] border-blue-600'
                : 'text-slate-600 hover:text-blue-600 font-semibold border-b-[3px] border-transparent'
            }`}
          >
            Contact
          </button>
        </div>

        {/* Right Auth Action Buttons */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setCurrentView('login')}
            className={`py-1 text-sm transition-all ${
              currentView === 'login'
                ? 'text-blue-600 font-extrabold border-b-[3px] border-blue-600'
                : 'text-slate-700 hover:text-blue-600 font-bold border-b-[3px] border-transparent'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setCurrentView('register')}
            className={`px-5 py-2.5 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 ${
              currentView === 'register'
                ? 'bg-blue-700 text-white ring-2 ring-blue-600 ring-offset-2'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Sign Up as Staff <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
