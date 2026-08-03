import React, { useState } from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { Hero, FeatureSection } from '../components/landing/Hero';
import { Modal } from '../components/common/Modal';
import { useInventory } from '../context/InventoryContext';
import { Box, Check } from 'lucide-react';

export const LandingPage = () => {
  const { navigateToAuth } = useInventory();
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <LandingNavbar onOpenAuth={(mode = 'login') => navigateToAuth(mode)} />
        <main>
          <Hero onOpenDemo={() => setShowDemoModal(true)} />
          <FeatureSection />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-8 text-sm">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Box className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-lg">StockFlow</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Enterprise grade inventory management platform designed for modern business operations.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li>Features</li>
              <li>Pricing</li>
              <li>Integrations</li>
              <li>Changelog</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li>About Us</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
              <li>Security</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 StockFlow. All rights reserved.</p>
          <p>Designed for Enterprise ERP Performance</p>
        </div>
      </footer>

      {/* Interactive Demo Video Modal */}
      <Modal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} title="StockFlow Walkthrough Demo" maxWidth="max-w-3xl">
        <div className="space-y-4">
          <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center relative">
            <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=80" alt="Demo preview" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-16 h-16 rounded-full bg-blue-600/90 flex items-center justify-center mb-3 shadow-xl">
                <Check className="w-8 h-8 text-white stroke-[3]" />
              </div>
              <h3 className="text-xl font-bold">Interactive ERP System Preview</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md">Sign up as staff to access real-time product catalogs, category organization, stock tracking, and reporting!</p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setShowDemoModal(false);
                navigateToAuth('register');
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl"
            >
              Sign Up as Staff
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
