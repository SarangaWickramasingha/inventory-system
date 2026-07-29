import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { useInventory } from '../context/InventoryContext';
import { Modal } from '../components/common/Modal';
import { Lock, AlertTriangle, LogOut, Edit2, Mail, User } from 'lucide-react';

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
    showToast('Password updated successfully!');
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
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-8 space-y-8 max-w-4xl w-full mx-auto">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-sm text-slate-500 font-medium">
              Manage your account settings and preferences.
            </p>
          </div>

          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                />
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
                <p className="text-xs font-semibold text-slate-500">{profile.role}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{profile.email}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowEditProfileModal(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors shadow-2xs"
            >
              Edit Profile
            </button>
          </div>

          {/* Security Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-700" />
              <h3 className="text-base font-bold text-slate-800">Security</h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
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
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
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
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-rose-50/40 rounded-2xl p-6 border border-rose-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-bold text-rose-900">Danger Zone</h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Logging out will end your current session. You will need to authenticate again to access your dashboard.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('landing')}
              className="px-4 py-2.5 bg-white border border-rose-300 text-rose-600 hover:bg-rose-100 font-bold text-sm rounded-xl shadow-2xs transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" /> Log Out Session
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role Title</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowEditProfileModal(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
