import React from 'react';
import { Layers, BarChart2, Shapes, Bell, Play, Zap, ShieldCheck, Activity, CheckCircle2, ArrowRight, Box } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const Hero = ({ onOpenDemo }) => {
  const { setCurrentView } = useInventory();

  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white min-h-[440px] flex items-center shadow-2xl w-full">
        {/* Background Graphic Overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-blue-950/60"></div>

        <div className="relative z-10 max-w-3xl px-12 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Master Your Stock with Precision
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-xl">
            Manage inventory with ease, efficiency, and clarity using our modern enterprise ERP platform.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setCurrentView('register')}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base rounded-xl shadow-lg transition-all"
            >
              Sign Up as Staff
            </button>
            <button
              onClick={onOpenDemo}
              className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-base rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-900" /> Watch Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export const FeatureSection = () => {
  const features = [
    {
      icon: Layers,
      title: 'Real-Time Inventory Tracking',
      description: 'Automated stock count updates and instant status calculations across all product lines.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: BarChart2,
      title: 'Financial Valuation Reports',
      description: 'Comprehensive financial cost-basis valuation, gross profit projection, and sales margin analytics.',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: Shapes,
      title: 'IT Hardware Categories',
      description: 'Organized hierarchy for Computers, Servers, Networking, Monitors, Peripherals, and Power items.',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: Bell,
      title: 'Automated Reorder Alerts',
      description: 'Instant warning notifications when inventory counts drop below customized reorder points.',
      color: 'bg-rose-100 text-rose-600'
    },
    {
      icon: Zap,
      title: 'Bulk Product CSV Import',
      description: 'Upload hundreds of inventory items instantly from standard CSV spreadsheets with one click.',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access Control',
      description: 'Differentiated Administrator Overviews and Staff Operational Portals tailored for team efficiency.',
      color: 'bg-sky-100 text-sky-600'
    }
  ];

  return (
    <section id="features" className="py-16 px-8 max-w-6xl mx-auto scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider rounded-full">
          Platform Features
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-3 mb-3">
          Powerful Capabilities for Enterprise Stock
        </h2>
        <p className="text-slate-500 font-medium">
          Everything you need to keep your stock organized, tracked, and financially optimized in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs card-hover flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{f.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const AboutSection = () => {
  const { setCurrentView } = useInventory();

  return (
    <section id="about" className="py-16 px-8 max-w-6xl mx-auto border-t border-slate-200/80 scroll-mt-20">
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <span className="px-3.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-black uppercase tracking-wider rounded-full">
              About StockFlow ERP
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-4 mb-4 tracking-tight leading-tight">
              Eliminate Inventory Friction. Elevate Operational Control.
            </h2>
            <p className="text-sm text-slate-300 font-medium leading-relaxed mb-6">
              StockFlow Enterprise ERP was engineered from the ground up to solve complex hardware inventory challenges. By uniting real-time cost-basis valuation with role-differentiated staff portals, StockFlow ensures zero stockouts, accurate audit trails, and effortless reordering.
            </p>

            <div className="space-y-3 mb-8 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>99.9% Inventory Accuracy with instant SKU search and barcode tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Purpose-built role views for Administrators and Warehouse Staff</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant export capabilities to CSV, JSON, and printable PDF summaries</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('register')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              Get Started with Staff Portal <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-white mb-1">100%</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Real-Time Valuation</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-white mb-1">6</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">IT Hardware Groups</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-white mb-1">2</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tailored Role Portals</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-white mb-1">0s</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">CSV Batch Import</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
