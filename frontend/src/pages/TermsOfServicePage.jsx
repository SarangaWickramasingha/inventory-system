import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { useInventory } from '../context/InventoryContext';
import { FileText, CheckCircle2, ShieldCheck, Box } from 'lucide-react';

export const TermsOfServicePage = () => {
  const { setCurrentView, navigateToAuth } = useInventory();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <LandingNavbar onOpenAuth={(mode = 'login') => navigateToAuth(mode)} />

        <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Header */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <FileText className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Effective Date: August 2026 • Enterprise License & Software Service Agreement
                </p>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-6 text-xs text-slate-600 font-medium leading-relaxed">
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-indigo-700">1. Acceptance of Terms</h3>
              <p>
                By accessing or using the StockFlow Enterprise ERP web application, you agree to bound by these Terms of Service. If you are entering into this agreement on behalf of a company, you represent that you have authority to bind the entity to these terms.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-indigo-700">2. Account Registration & User Roles</h3>
              <p>
                System Administrators are responsible for creating, assigning, and deactivating Staff member accounts. Users must maintain confidentiality of login credentials and immediately notify administrators of any unauthorized account access.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-indigo-700">3. System Uptime & Service SLA</h3>
              <p>
                StockFlow target service availability is 99.9% uptime for core inventory registry queries, CSV batch imports, and financial calculation views. Scheduled maintenance windows will be announced via top notification banners.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-indigo-700">4. Acceptable Use Policy</h3>
              <p>Users agree not to:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Attempt to bypass Role-Based Access Control (RBAC) restrictions.</li>
                <li>Upload malicious CSV payloads or attempt database injection attacks.</li>
                <li>Reverse engineer or redistribute proprietary ERP source code without authorization.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-indigo-700">5. Limitation of Liability</h3>
              <p>
                StockFlow automated valuation numbers and reorder warnings are provided as decision-support tools. Organization managers should verify external supplier contracts prior to executing physical purchase orders.
              </p>
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
