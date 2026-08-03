import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { useInventory } from '../context/InventoryContext';
import { Modal } from '../components/common/Modal';
import { ThresholdSettingsCard } from '../components/settings/ThresholdSettingsCard';
import { CompanyProfileCard } from '../components/settings/CompanyProfileCard';
import { SystemHealthCard } from '../components/settings/SystemHealthCard';
import { Lock, AlertTriangle, LogOut, Edit2, Mail, Shield, User, Key, Check } from 'lucide-react';

export const SettingsPage = () => {
  const { profile, updateProfile, setCurrentView, showToast } = useInventory();

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [email, setEmail] = useState(profile.email);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    showToast('Security password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, role, email });
    setShowEditProfileModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 md:p-8 space-y-8 max-w-5xl w-full mx-auto">
          {/* Top Title Bar */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-100 text-blue-700 rounded-xl font-bold text-xs uppercase tracking-wider">
                  Page 8
                </span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">System & Account Settings</h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Configure threshold alerts, company profiles, system diagnostics, and account security.
              </p>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                />
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
                  title="Change avatar & profile"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{profile.name}</h3>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-extrabold rounded-md uppercase">
                    {profile.role}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.email}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowEditProfileModal(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
            >
              Edit Personal Profile
            </button>
          </div>

          {/* System Health Stats Component */}
          <SystemHealthCard />

          {/* Low-Stock Threshold Settings Component */}
          <ThresholdSettingsCard />

          {/* Company Profile Details Component */}
          <CompanyProfileCard />

          {/* Security & Password Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Lock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Security & Authentication</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Update your password and authentication security credentials.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Key className="w-4 h-4" /> Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-rose-950">Session & Access Controls</h4>
                <p className="text-xs text-rose-800 font-medium mt-0.5">
                  Terminating your session will sign you out across all active browser windows.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('landing')}
              className="px-4 py-2.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 font-extrabold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
            >
              <LogOut className="w-4 h-4" /> Log Out Active Session
            </button>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditProfileModal} onClose={() => setShowEditProfileModal(false)} title="Edit Profile Details" maxWidth="max-w-md">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role Title</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowEditProfileModal(false)}
              className="px-4 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
