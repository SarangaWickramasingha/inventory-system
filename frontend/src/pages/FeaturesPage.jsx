import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { useInventory } from '../context/InventoryContext';
import { Layers, BarChart2, Shapes, Bell, Zap, ShieldCheck, ArrowRight, CheckCircle2, Box } from 'lucide-react';

export const FeaturesPage = () => {
  const { setCurrentView, navigateToAuth } = useInventory();

  const featureCards = [
    {
      icon: Layers,
      title: 'Real-Time Inventory Tracking',
      badge: 'Core Engine',
      description: 'Live automatic recalculations of stock quantities on every purchase order, intake, and sales adjustment. Eliminates manual audit errors.',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      bullets: ['Automated reorder triggers', 'Real-time stock status sync', 'SKU & barcode lookup']
    },
    {
      icon: BarChart2,
      title: 'Financial Valuation & Analytics',
      badge: 'Executive Suite',
      description: 'Complete visibility into total cost-basis valuation, retail market potential, and projected gross profit margins across your entire hardware catalog.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      bullets: ['Cost basis asset valuation', 'Gross profit margin calculation', 'One-click CSV & PDF export']
    },
    {
      icon: Shapes,
      title: 'IT Hardware Categorization',
      badge: 'Structure',
      description: 'Structured classification across 6 specialized IT hardware categories: Computers & Laptops, Servers & Storage, Networking & Telecom, Monitors, Peripherals, and Power.',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      bullets: ['Dynamic category creation', 'Group stock unit aggregation', 'Custom color badges']
    },
    {
      icon: Bell,
      title: 'Automated Stock Alert Engine',
      badge: 'Proactive Alert',
      description: 'Instant warning banners and notification drawer alerts whenever stock drops below customized reorder points or hits critical zero stock levels.',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      bullets: ['Low-stock warning queue', 'Out-of-stock emergency alerts', 'Fast 1-click restock action']
    },
    {
      icon: Zap,
      title: 'Bulk CSV Product Import',
      badge: 'Data Batch',
      description: 'Import hundreds of inventory items instantly from spreadsheet CSV files with auto-header parsing, validation, and batch insert.',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      bullets: ['CSV Drag & Drop upload', 'Auto-schema validation', 'Instant catalog population']
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access Control (RBAC)',
      badge: 'Security',
      description: 'Dual-role architecture providing specialized interfaces for Administrators (valuation & user controls) and Staff Members (daily operations).',
      color: 'bg-sky-50 text-sky-600 border-sky-200',
      bullets: ['Admin Executive Dashboard', 'Staff Operational Portal', 'Detailed Audit Trails']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <LandingNavbar onOpenAuth={(mode = 'login') => navigateToAuth(mode)} />

        <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider rounded-full border border-blue-200">
              StockFlow Features & Capabilities
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Built for Precision, Scale, and Operational Control
            </h1>
            <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
              Explore the complete feature suite powering modern hardware inventory management, financial valuation, and warehouse reordering.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((f, index) => {
              const Icon = f.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs card-hover flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${f.color} border`}>
                        <Icon className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                        {f.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{f.description}</p>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700">
                      {f.bullets.map((b, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentView('register')}
                    className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-slate-200/80"
                  >
                    Try Feature with Staff Account <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Card */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black mb-2">Ready to Transform Your Inventory?</h2>
              <p className="text-xs md:text-sm text-slate-300 font-medium">
                Sign up as staff to access real-time stock registries, category organization, and automated reorder alerts.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('register')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2"
            >
              Sign Up as Staff Member <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <Box className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">StockFlow ERP</span>
          </div>
          <p>© 2026 StockFlow ERP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
