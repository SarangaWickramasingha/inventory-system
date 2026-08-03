import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Building2, MapPin, Phone, Mail, DollarSign, Check } from 'lucide-react';

export const CompanyProfileCard = () => {
  const { showToast } = useInventory();
  const [companyName, setCompanyName] = useState('StockFlow Logistics Corp');
  const [taxId, setTaxId] = useState('TAX-892401-US');
  const [currency, setCurrency] = useState('USD ($)');
  const [address, setAddress] = useState('742 Evergreen Terrace, Sector 7G, Springfield, IL');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [supportEmail, setSupportEmail] = useState('ops@stockflow.internal');

  const handleSaveCompany = (e) => {
    e.preventDefault();
    showToast('Company profile updated successfully!');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <Building2 className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-800">Company Profile & Organization Details</h3>
          <p className="text-xs text-slate-500 font-medium">
            Business metadata displayed on invoices, purchase orders, and audit reports.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveCompany} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Organization Name
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tax / VAT ID Number
            </label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              System Base Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
            >
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
              <option value="GBP (£)">GBP (£) - British Pound</option>
              <option value="LKR (Rs)">LKR (Rs) - Sri Lankan Rupee</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Warehouse / Primary Business Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save Company Details
          </button>
        </div>
      </form>
    </div>
  );
};
