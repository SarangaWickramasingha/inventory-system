import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

/**
 * ProtectedRoute Component
 * Role-Based Access Control (RBAC) Route Guard
 * Owner: Manuja (Auth, RBAC & User Management)
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setCurrentView } = useInventory();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Verifying Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Authentication Required</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          You must be signed in to access this page. Please sign in with your account credentials.
        </p>
        <button
          onClick={() => setCurrentView('login')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Access Denied (403 Forbidden)</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          Your account role (<span className="text-amber-400 font-bold uppercase">{user.role}</span>) does not have authorization to view this Administrator page.
        </p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
