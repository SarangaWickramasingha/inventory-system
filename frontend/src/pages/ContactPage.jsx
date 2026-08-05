import React, { useState } from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { useInventory } from '../context/InventoryContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, Box, HelpCircle, MessageSquare } from 'lucide-react';

export const ContactPage = () => {
  const { setCurrentView, navigateToAuth, showToast } = useInventory();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Support', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (showToast) showToast('Inquiry submitted! Our support team will contact you shortly.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <LandingNavbar onOpenAuth={(mode = 'login') => navigateToAuth(mode)} />

        <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
          {/* Title Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider rounded-full border border-blue-200">
              Get in Touch
            </span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Contact StockFlow Support</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Have questions about StockFlow Enterprise ERP licensing, CSV data migration, or technical support? Our team is here to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Direct Contact Info
                </h3>

                <div className="space-y-4 text-xs font-medium text-slate-600">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Email Support</p>
                      <p className="text-slate-500">support@stockflow.com</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">24/7 Priority Desk</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Phone Hotline</p>
                      <p className="text-slate-500">+94 11 234 5678</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Mon - Fri: 8:30 AM - 5:30 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Head Office</p>
                      <p className="text-slate-500">StockFlow Enterprise HQ, Level 8</p>
                      <p className="text-slate-500">Colombo 03, Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-6 text-white space-y-3">
                <HelpCircle className="w-6 h-6 text-amber-400" />
                <h4 className="text-sm font-extrabold">Looking for Immediate Help?</h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Sign in or register a staff demo account to access interactive system guides, sample data, and stock registry tools.
                </p>
                <button
                  onClick={() => setCurrentView('login')}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2"
                >
                  Sign In to System
                </button>
              </div>
            </div>

            {/* Main Form Container */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-2xs">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Thank You for Reaching Out!</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Your inquiry has been logged in our support queue. A representative will contact you at <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'General Support', message: '' });
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-600">
                  <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-bold text-slate-900">Send Us a Direct Message</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Saranga Wickramasingha"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="saranga@stockflow.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Inquiry Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="General Support">General Platform Support</option>
                      <option value="Enterprise ERP License">Enterprise ERP Licensing & Deployment</option>
                      <option value="Technical Issue">Technical & API Integration</option>
                      <option value="CSV Data Migration">Bulk CSV Data Migration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Message Details *</label>
                    <textarea
                      rows="5"
                      required
                      placeholder="Please describe your requirements, system size, or inquiry details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end pt-3">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Submit Inquiry
                    </button>
                  </div>
                </form>
              )}
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
