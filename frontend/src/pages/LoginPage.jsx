import React, { useState } from 'react';
import { Box, Lock, Mail, User, ShieldCheck, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { setCurrentView } = useInventory();
  const { login, setUser, setToken } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin', // Default role selection on Sign In page
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      // Ensure user object preserves selected role for RBAC
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

  const handleQuickDemo = (role) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUser({
        name: role === 'admin' ? 'Saranga Wickramasingha' : 'Manuja Staff',
        email: role === 'admin' ? 'admin@stockflow.com' : 'staff@stockflow.com',
        role: role,
      });
      setToken(`mock-hmac-sha256-${role}-token`);
      setCurrentView('dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow graphics */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div
          onClick={() => setCurrentView('landing')}
          className="flex justify-center items-center gap-3 mb-3 cursor-pointer hover:opacity-80 transition-opacity"
          title="Return to Home Landing Page"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white shadow-blue-500/30">
            <Box className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="text-3xl font-extrabold text-white tracking-tight">StockFlow</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          Sign in to StockFlow Portal
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Monorepo Inventory Management & Asset Tracking System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-200 sm:px-10">
          
          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-700 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Role Selection Switch Toggle on Sign In */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Sign In Role
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'admin' }))}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    formData.role === 'admin'
                      ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200/50'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 ${formData.role === 'admin' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>👑 Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'staff' }))}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    formData.role === 'staff'
                      ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200/50'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <User className={`w-4 h-4 ${formData.role === 'staff' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>👤 Staff</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-600 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 mr-2" />
                Remember me
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link has been sent to your email.'); }} className="font-bold text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
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

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
              >
                👑 Demo Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('staff')}
                className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-colors"
              >
                👤 Demo Staff
              </button>
            </div>
          </div>

          {/* Link to Staff Registration Page */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600 font-medium">
              New staff member?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('register')}
                className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Sign up for a Staff account
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Protected by pure PHP HMAC SHA-256 token authentication & RBAC.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
