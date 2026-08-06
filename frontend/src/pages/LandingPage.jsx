import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { Hero, FeatureSection, AboutSection } from '../components/landing/Hero';
import { useInventory } from '../context/InventoryContext';
import { Box } from 'lucide-react';

export const LandingPage = () => {
  const { setCurrentView } = useInventory();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <LandingNavbar />
        <main>
          <Hero />
          <FeatureSection />
          <AboutSection />
        </main>
      </div>

      {/* Clean Footer with Page Navigation */}
      <footer className="bg-white border-t border-slate-200 py-12 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-8 text-sm">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
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
              <li>
                <button onClick={() => setCurrentView('features')} className="hover:text-blue-600 transition-colors">
                  Features Overview
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contact')} className="hover:text-blue-600 transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li>
                <button onClick={() => setCurrentView('about')} className="hover:text-blue-600 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contact')} className="hover:text-blue-600 transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li>
                <button onClick={() => setCurrentView('privacy')} className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('terms')} className="hover:text-blue-600 transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 StockFlow ERP. All rights reserved.</p>
          <p>Enterprise ERP Performance & Reliability</p>
        </div>
      </footer>
    </div>
  );
};
