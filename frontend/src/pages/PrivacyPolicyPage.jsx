import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { useInventory } from '../context/InventoryContext';
import { Shield, Lock, FileText, CheckCircle2, Box } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  const { setCurrentView, navigateToAuth } = useInventory();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <LandingNavbar onOpenAuth={(mode = 'login') => navigateToAuth(mode)} />

        <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Header */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Last Updated: August 2026 • StockFlow Enterprise ERP Data Protection Standards
                </p>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-6 text-xs text-slate-600 font-medium leading-relaxed">
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-blue-700">1. Data Ownership & Scope</h3>
              <p>
                StockFlow Enterprise ERP operates as a data processor for corporate and individual customers. All registered inventory records, financial valuation cost basis numbers, supplier details, SKU codes, and stock movement activities remain the exclusive property of the customer organization.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-blue-700">2. Information Collection Practices</h3>
              <p>We collect only essential information required for system authentication and stock accounting:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Account Information: Name, work email address, username, hashed password, and role title (Admin/Staff).</li>
                <li>Inventory Data: SKU identifiers, product names, category tags, buying/selling unit prices, quantities, and reorder point thresholds.</li>
                <li>Audit Logs: Timestamps of stock additions, modifications, CSV batch uploads, and status changes.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-blue-700">3. Encryption & Infrastructure Security</h3>
              <p>
                All data transmitted between web browsers and StockFlow services is protected using Transport Layer Security (TLS 1.3). Database records are encrypted at rest using AES-256 standards, and role-based access control enforces strict data isolation.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-blue-700">4. Third-Party Sharing Policy</h3>
              <p>
                StockFlow strictly prohibits selling, leasing, or monetizing customer operational logs, product prices, or valuation metrics to advertising networks, data brokers, or external entities.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-blue-700">5. Data Retention & Export Rights</h3>
              <p>
                Administrators maintain full control over inventory data. At any time, administrators can export complete database backups in standardized CSV or JSON formats, or request complete account erasure.
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
