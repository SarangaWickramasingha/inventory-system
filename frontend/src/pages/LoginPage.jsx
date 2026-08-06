import React, { useState } from 'react';
import { Box, Lock, Mail, User, ShieldCheck, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { LandingPage } from './LandingPage';
import { FeaturesPage } from './FeaturesPage';
import { AboutPage } from './AboutPage';
import { ContactPage } from './ContactPage';

export const LoginPage = () => {
  const { setCurrentView, previousView, closeAuthModal } = useInventory();
  const { login, setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin', // Default role selection on Sign In page
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const renderBackground = () => {
    switch (previousView) {
      case 'features':
        return <FeaturesPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <LandingPage />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);

    const result = await login(formData.email, formData.password, formData.role);

    setIsLoading(false);

    if (result && result.success) {
      const authenticatedUser = {
        ...(result.user || {}),
        role: formData.role
      };
      setUser(authenticatedUser);

      setSuccess(`Sign in successful as ${formData.role === 'admin' ? 'Administrator' : 'Staff'}! Redirecting...`);
      setTimeout(() => {
        setCurrentView('dashboard');
      }, 800);
    } else {
      setError(result?.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. Actual Background Page Visible Behind Overlay */}
      <div className="pointer-events-none select-none opacity-85 filter brightness-[0.6]">
        {renderBackground()}
      </div>

      {/* 2. Glassy Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeAuthModal();
        }}
      >
        
        {/* Floating Glassmorphism Login Panel */}
        <div className="w-full max-w-md my-auto bg-white/10 backdrop-blur-2xl py-8 px-6 shadow-2xl rounded-3xl border border-white/20 sm:px-10 text-white relative">
          
          {/* Close button to return to previous page */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            title="Close and return to previous page"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-6">
            <div
              onClick={() => setCurrentView('landing')}
              className="inline-flex items-center gap-2.5 mb-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg text-white shadow-blue-500/40 border border-blue-400/30">
                <Box className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">StockFlow</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Sign in to StockFlow Portal
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Monorepo Inventory Management System
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-rose-500/20 border border-rose-400/30 rounded-xl flex items-center gap-2.5 text-rose-200 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center gap-2.5 text-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Role Selection Switch Toggle on Sign In */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-200 uppercase tracking-wider mb-2">
                Sign In Role
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-white/15">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'admin' }))}
                  className={`py-2.5 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                    formData.role === 'admin'
                      ? 'bg-blue-600 text-white shadow-md border border-blue-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 ${formData.role === 'admin' ? 'text-white' : 'text-slate-400'}`} />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'staff' }))}
                  className={`py-2.5 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                    formData.role === 'staff'
                      ? 'bg-blue-600 text-white shadow-md border border-blue-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className={`w-4 h-4 ${formData.role === 'staff' ? 'text-white' : 'text-slate-400'}`} />
                  <span>Staff</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 h-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@stockflow.com"
                  required
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-white/20 rounded-xl text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-950/60 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 h-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-950/40 border border-white/20 rounded-xl text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-950/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-300 cursor-pointer select-none font-medium">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600 bg-slate-900/50 border-white/30 focus:ring-blue-500 mr-2" />
                Remember me
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  setSuccess('Password reset link has been dispatched to your email address.');
                }}
                className="font-extrabold text-blue-400 hover:text-blue-300 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-2 border border-blue-400/30"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Link to Staff Registration Page */}
          <div className="mt-6 pt-6 border-t border-white/15 text-center">
            <p className="text-xs text-slate-300 font-medium">
              New staff member?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('register')}
                className="font-extrabold text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
              >
                Sign up for a Staff account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
