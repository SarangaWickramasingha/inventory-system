import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Mail, Phone, MapPin, Send, CheckCircle2, Shield, Lock, FileText, Building2, HelpCircle } from 'lucide-react';

// 1. Contact Us Modal
export const ContactModal = ({ isOpen, onClose, showToast }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Support', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (showToast) showToast('Thank you! Your message has been sent to support.');
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'General Support', message: '' });
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact StockFlow Support" maxWidth="max-w-xl">
      {submitted ? (
        <div className="p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Message Sent Successfully!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Our technical support team will respond to your inquiry at <strong>{formData.email || 'your email'}</strong> within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kasun Perera"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="kasun@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Inquiry Topic</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="General Support">General Support & Guidance</option>
              <option value="Enterprise ERP License">Enterprise ERP Licensing</option>
              <option value="Technical Issue">Technical & API Issue</option>
              <option value="CSV Data Migration">Bulk CSV Data Migration Assistance</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Message *</label>
            <textarea
              rows="4"
              required
              placeholder="Describe your inquiry or technical requirement..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>

          {/* Quick Info Bar */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-4 text-[11px] font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>support@stockflow.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>+94 11 234 5678</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Inquiry
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

// 2. Privacy Policy Modal
export const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="StockFlow Privacy Policy" maxWidth="max-w-2xl">
      <div className="space-y-4 text-xs text-slate-600 max-h-[420px] overflow-y-auto pr-2">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-blue-900">
          <Shield className="w-6 h-6 text-blue-600 shrink-0" />
          <div>
            <h4 className="font-extrabold text-sm">Data Protection & Privacy Commitment</h4>
            <p className="text-[11px] text-blue-700">Last Updated: August 2026 • StockFlow Enterprise ERP v2.4</p>
          </div>
        </div>

        <div className="space-y-3 font-medium leading-relaxed">
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs mb-1">1. Information We Collect</h4>
            <p>
              StockFlow collects user credentials (name, email address, role title) and inventory system operational data (SKUs, quantities, category labels, buying/selling prices) strictly required to operate inventory accounting and stock management.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 text-xs mb-1">2. Data Security & Encryption</h4>
            <p>
              All customer product data and financial valuation records are encrypted in transit via TLS 1.3 and stored in compliant SQL database infrastructure with strict role-based access controls (RBAC).
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 text-xs mb-1">3. Third-Party Sharing Policy</h4>
            <p>
              We do <strong>NOT</strong> sell, rent, or trade customer inventory logs or company valuation data to advertising networks or third parties under any circumstances.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 text-xs mb-1">4. Data Retention & Deletion</h4>
            <p>
              System Administrators retain full ownership of inventory data and may request account deletion or CSV database export at any time.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </Modal>
  );
};

// 3. Terms of Service Modal
export const TermsOfServiceModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="StockFlow Terms of Service" maxWidth="max-w-2xl">
      <div className="space-y-4 text-xs text-slate-600 max-h-[420px] overflow-y-auto pr-2">
        <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-3 text-slate-900">
          <FileText className="w-6 h-6 text-slate-700 shrink-0" />
          <div>
            <h4 className="font-extrabold text-sm">Enterprise Service Level Agreement</h4>
            <p className="text-[11px] text-slate-500">Effective Date: August 2026 • Enterprise License Terms</p>
          </div>
        </div>

        <div className="space-y-3 font-medium leading-relaxed">
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs mb-1">1. Acceptance of Terms</h4>
            <p>
              By creating a Staff or Administrator account on StockFlow, you agree to comply with system usage policies, security practices, and administrative access guidelines.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 text-xs mb-1">2. User Roles & Account Responsibilities</h4>
            <p>
              Administrators are responsible for managing access permissions for Staff users. Users must maintain credential security and immediately report unauthorized account activity.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 text-xs mb-1">3. System Availability & Service SLA</h4>
            <p>
              StockFlow provides 99.9% uptime for inventory tracking and database synchronization. Scheduled maintenance windows will be communicated via top notification banners.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 text-xs mb-1">4. Limitation of Liability</h4>
            <p>
              StockFlow provides automated valuation and reorder alerts as operational tools. Users are encouraged to verify supplier reorder contracts prior to placing external orders.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            Accept Terms
          </button>
        </div>
      </div>
    </Modal>
  );
};
