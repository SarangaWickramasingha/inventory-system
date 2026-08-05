import React, { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, User, Settings, LogOut, Check, ExternalLink, X } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from './Modal';
import { getDiceBearAvatar } from '../../utils/avatar';

export const Header = () => {
  const { user } = useAuth();
  const {
    searchTerm,
    setSearchTerm,
    notifications,
    markNotificationRead,
    profile,
    setCurrentView,
    products,
    navigateToEdit
  } = useInventory();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const safeNotifications = notifications || [];
  const safeProducts = products || [];
  const safeProfile = {
    name: user?.name || profile?.name || 'Admin User',
    username: user?.username || profile?.username || 'admin',
    email: user?.email || profile?.email || 'admin@stockflow.com',
    avatar: getDiceBearAvatar(user?.name || profile?.name || 'Admin User'),
  };

  const unreadCount = safeNotifications.filter(n => !n.read).length;

  // Search Results
  const matchingProducts = searchTerm.trim()
    ? safeProducts.filter(p =>
        (p?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p?.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p?.category || p?.category_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-2xs">
      {/* Search Input Box */}
      <div className="relative w-full max-w-lg">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search products, SKUs, categories..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Results Dropdown */}
        {isSearchFocused && matchingProducts.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-40">
            <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
              Matching Products ({matchingProducts.length})
            </div>
            <div className="divide-y divide-slate-100">
              {matchingProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigateToEdit(p.id);
                    setSearchTerm('');
                  }}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover border border-slate-200" />
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.sku} • <span className="text-blue-600 font-medium">{p.category}</span></div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-900">${p.sellingPrice.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-40 animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-800">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {safeNotifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">No notifications</div>
                ) : (
                  safeNotifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help Center Icon */}
        <button
          onClick={() => setShowHelpModal(true)}
          className="p-2 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          title="Help & Support"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <img
              src={safeProfile.avatar}
              alt={safeProfile.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <span className="text-sm font-semibold text-slate-700 hidden sm:inline">Profile</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-40 animate-fade-in">
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <p className="text-sm font-bold text-slate-800">{safeProfile.name}</p>
                <p className="text-xs text-slate-500 truncate">{safeProfile.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Settings className="w-4 h-4 text-slate-500" /> Account Settings
                </button>
              </div>
              <div className="border-t border-slate-100 py-1">
                <button
                  onClick={() => {
                    setCurrentView('login');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Modal */}
      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="StockFlow Quick Guide"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-blue-900">
            <div>
              <span className="font-extrabold text-sm block">StockFlow Enterprise ERP v2.4</span>
              <span className="text-xs font-semibold text-blue-700">IT Hardware & Equipment Inventory Management Platform</span>
            </div>
            <span className="px-2.5 py-1 bg-blue-600 text-white font-extrabold text-[10px] uppercase rounded-md shadow-xs">
              System Guide
            </span>
          </div>

          <div className="space-y-3 font-medium">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <span>🔍 Global Search & Navigation</span>
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                Use the top search bar to instantly lookup products by name, SKU, or category. Click any search result to edit product details directly.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <span>⏳ Staff Approval & RBAC Security</span>
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                Staff member self-registration defaults to <strong>Pending Approval</strong>. System Administrators manage the approval queue, assign usernames, and toggle active/inactive access in <strong>User & Staff Management</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <span>💻 6 IT Industry Categories</span>
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                Hardware is structured across 6 core categories: <em>Computers & Laptops, Servers & Storage, Networking & Telecom, Monitors & Displays, Peripherals & Components, Power & Infrastructure</em>.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <span>🎨 DiceBear SVG Avatars & Security</span>
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                Every user is assigned a dynamic <strong>DiceBear Initials SVG Avatar</strong> based on their full name. User email addresses are locked and immutable for account security.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <span>🛡️ Unified Modal Dialogs</span>
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                All deletion prompts and critical actions use StockFlow's custom styled confirmation modals instead of native browser popups.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setShowHelpModal(false)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
            >
              Got it, Close Guide!
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
};
