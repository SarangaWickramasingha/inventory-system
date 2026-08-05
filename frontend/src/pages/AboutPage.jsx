import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { useInventory } from '../context/InventoryContext';
import { Building2, Shield, CheckCircle2, Users, Award, Box, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  const { setCurrentView, navigateToAuth } = useInventory();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <LandingNavbar onOpenAuth={(mode = 'login') => navigateToAuth(mode)} />

        <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
          {/* Hero Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider rounded-full border border-indigo-200">
              About StockFlow Enterprise ERP
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Eliminating Inventory Friction Through Intelligent Software
            </h1>
            <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
              Engineered to bring complete accuracy, real-time asset valuation, and role-differentiated operational clarity to technology businesses worldwide.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-2xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
                <Building2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Our Mission & Purpose</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Traditional spreadsheets and legacy ERPs often suffer from stock discrepancies, missing reorder signals, and opaque financial valuation. StockFlow was built to unify asset registration, category management, automated warnings, and audit feeds into a single intuitive web platform.
              </p>

              <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-time cost-basis and retail valuation calculation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dedicated Administrator and Staff operational portals</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Sub-second CSV bulk product upload and export suite</span>
                </div>
              </div>
            </div>

            {/* Stat Counters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center space-y-1">
                <div className="text-3xl font-black text-blue-600">99.9%</div>
                <div className="text-xs font-extrabold text-slate-800">Inventory Accuracy</div>
                <p className="text-[10px] text-slate-400 font-medium">Verified SKU tracking</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center space-y-1">
                <div className="text-3xl font-black text-indigo-600">6</div>
                <div className="text-xs font-extrabold text-slate-800">IT Hardware Groups</div>
                <p className="text-[10px] text-slate-400 font-medium">Standardized categories</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center space-y-1">
                <div className="text-3xl font-black text-emerald-600">2</div>
                <div className="text-xs font-extrabold text-slate-800">Tailored Roles</div>
                <p className="text-[10px] text-slate-400 font-medium">Admin & Staff Portals</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center space-y-1">
                <div className="text-3xl font-black text-amber-600">0s</div>
                <div className="text-xs font-extrabold text-slate-800">CSV Import Delay</div>
                <p className="text-[10px] text-slate-400 font-medium">Instant catalog parse</p>
              </div>
            </div>
          </div>

          {/* Architecture Pillars */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Core Pillars of StockFlow</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Groundbreaking features designed for enterprise stability</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Security & RBAC</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Role-Based Access Control protects administrative settings while giving staff members fast, frictionless operational capabilities.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Collaborative Audit Trail</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Every product addition, stock adjustment, and category modification is logged with timestamps and user avatars for complete auditability.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Enterprise SLA</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Guaranteed 99.9% system availability, sub-second search index querying, and automated database backups.
                </p>
              </div>
            </div>
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
