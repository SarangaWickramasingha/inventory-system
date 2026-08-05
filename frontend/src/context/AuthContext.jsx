import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';

/**
 * AuthContext Provider
 * Pure PHP HMAC Token Storage, Persistent Session, Pending Approval Workflow & RBAC Manager
 */
const AuthContext = createContext(null);

const DEFAULT_USER_DATABASE = [
  { id: 1, name: 'Saranga Wickramasingha', username: 'saranga_admin', email: 'saranga@stockflow.com', role: 'admin', status: 'active', avatarColor: 'bg-blue-600' },
  { id: 2, name: 'Manuja Jayasinghe', username: 'manuja_dev', email: 'manuja@stockflow.com', role: 'admin', status: 'active', avatarColor: 'bg-indigo-600' },
  { id: 3, name: 'Ashan Silva', username: 'ashan_staff', email: 'ashan@stockflow.com', role: 'staff', status: 'active', avatarColor: 'bg-emerald-600' },
  { id: 4, name: 'Tharindu Fernando', username: 'tharindu_staff', email: 'tharindu@stockflow.com', role: 'staff', status: 'active', avatarColor: 'bg-amber-600' },
  { id: 5, name: 'Dileepa Perera', username: 'dileepa_staff', email: 'dileepa@stockflow.com', role: 'staff', status: 'inactive', avatarColor: 'bg-slate-500' },
  { id: 6, name: 'Sashika Ratnayake', username: 'sashika_staff', email: 'sashika@stockflow.com', role: 'staff', status: 'active', avatarColor: 'bg-purple-600' },
  { id: 7, name: 'Pemila Rodrigo', username: 'pemila_staff', email: 'pemila@stockflow.com', role: 'staff', status: 'active', avatarColor: 'bg-rose-600' },
  { id: 8, name: 'Kasun Perera', username: 'kasun_pending', email: 'kasun.p@stockflow.com', role: 'staff', status: 'pending', avatarColor: 'bg-amber-500' },
];

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => localStorage.getItem('stockflow_token') || null);
  const [user, setUserState] = useState(() => {
    const savedUser = localStorage.getItem('stockflow_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // User database state including pending approval queue
  const [userList, setUserList] = useState(() => {
    const stored = localStorage.getItem('stockflow_user_database');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return DEFAULT_USER_DATABASE;
      }
    }
    return DEFAULT_USER_DATABASE;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('stockflow_user_database', JSON.stringify(userList));
  }, [userList]);

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('stockflow_token', newToken);
    } else {
      localStorage.removeItem('stockflow_token');
    }
    setTokenState(newToken);
  };

  const setUser = (newUser) => {
    if (newUser) {
      localStorage.setItem('stockflow_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('stockflow_user');
    }
    setUserState(newUser);
  };

  // Check login with pending status check
  const login = async (email, password, requestedRole = 'admin') => {
    setIsLoading(true);
    setError(null);

    // 1. Check local user database for pending approval status
    const existingLocalUser = userList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingLocalUser && existingLocalUser.status === 'pending') {
      const pendingMsg = 'Your staff account is pending Admin approval. Please wait for an administrator to approve your account before signing in.';
      setError(pendingMsg);
      setIsLoading(false);
      return { success: false, pendingApproval: true, message: pendingMsg };
    }

    try {
      const response = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response && response.success && response.data) {
        const { token: authToken, user: userData } = response.data;

        if (userData.status === 'pending') {
          const pendingMsg = 'Your staff account is pending Admin approval. Please wait for an administrator to approve your account.';
          setError(pendingMsg);
          setIsLoading(false);
          return { success: false, pendingApproval: true, message: pendingMsg };
        }

        const formattedUser = {
          id: userData.id,
          name: userData.full_name || userData.username,
          username: userData.username,
          email: userData.email,
          role: userData.role || requestedRole,
          status: userData.status || 'active',
        };

        setToken(authToken);
        setUser(formattedUser);
        setIsLoading(false);
        return { success: true, user: formattedUser };
      } else {
        const errMsg = response?.message || 'Invalid login credentials.';
        setError(errMsg);
        setIsLoading(false);
        return { success: false, message: errMsg };
      }
    } catch (err) {
      // Fallback for Quick Demo / Offline mode
      const isDemo = email.includes('admin@stockflow.com') || email.includes('john.doe@stockflow.com') || email.includes('demo') || password === 'admin123' || password === 'staff123';
      
      if (isDemo) {
        const fallbackRole = email.includes('admin') || requestedRole === 'admin' ? 'admin' : 'staff';
        const fallbackUser = {
          id: fallbackRole === 'admin' ? 1 : 2,
          name: fallbackRole === 'admin' ? 'Saranga Wickramasingha (Admin)' : 'John Doe (Staff)',
          username: fallbackRole === 'admin' ? 'admin' : 'johndoe',
          email: email,
          role: fallbackRole,
          status: 'active',
        };
        const demoToken = `demo_token_${Date.now()}`;
        setToken(demoToken);
        setUser(fallbackUser);
        setIsLoading(false);
        return { success: true, user: fallbackUser, isDemo: true };
      }

      const errMsg = 'Backend API server unavailable.';
      setError(errMsg);
      setIsLoading(false);
      return { success: false, message: errMsg };
    }
  };

  // Register handler - sets account status to 'pending'
  const register = async (formData) => {
    setIsLoading(true);
    setError(null);

    const generatedUsername = formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const newUserRecord = {
      id: Date.now(),
      name: formData.fullName,
      username: generatedUsername,
      email: formData.email,
      role: formData.role || 'staff',
      status: 'pending', // Pending Admin approval!
      lastLogin: 'Never',
      avatarColor: 'bg-amber-500',
    };

    // Save locally to user list
    setUserList((prev) => [newUserRecord, ...prev.filter((u) => u.email !== formData.email)]);

    try {
      await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: generatedUsername,
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          role: 'staff',
          status: 'pending'
        }),
      });
    } catch (err) {
      console.warn('Backend API registration offline, registered in local session database.', err);
    }

    setIsLoading(false);
    return {
      success: true,
      pendingApproval: true,
      user: newUserRecord,
      message: 'Registration submitted successfully! Your staff account is currently pending Admin approval.'
    };
  };

  // Admin approves a pending staff member
  const approveStaffUser = (id) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'active' } : u))
    );
  };

  // Admin updates username and name for pre-approved/selected user
  const updateUserInfo = (id, updatedFields) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updatedFields } : u))
    );
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
  };

  const isAuthenticated = Boolean(user && (token || localStorage.getItem('stockflow_user')));
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userList,
        setUserList,
        isAuthenticated,
        isAdmin,
        isStaff,
        isLoading,
        error,
        setUser,
        setToken,
        login,
        register,
        approveStaffUser,
        updateUserInfo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
