import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';

/**
 * AuthContext Provider
 * Pure PHP HMAC Token Storage, Persistent Session & RBAC Manager
 * Owner: Manuja (Auth, RBAC & User Management)
 */
const AuthContext = createContext(null);

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
    // Default: null when unauthenticated
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Login handler connected to backend API
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response && response.success && response.data) {
        const { token: authToken, user: userData } = response.data;
        const formattedUser = {
          id: userData.id,
          name: userData.full_name || userData.username,
          username: userData.username,
          email: userData.email,
          role: userData.role || 'staff',
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
      const errMsg = 'Backend API server unavailable. Please make sure the backend server is running.';
      setError(errMsg);
      setIsLoading(false);
      return { success: false, message: errMsg };
    }
  };

  // Register handler
  const register = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: formData.email.split('@')[0],
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          role: formData.role || 'staff',
        }),
      });

      if (response && response.success && response.data) {
        const { token: authToken, user: userData } = response.data;
        const formattedUser = {
          id: userData.id,
          name: userData.full_name || userData.username,
          username: userData.username,
          email: userData.email,
          role: userData.role || 'staff',
        };

        setToken(authToken);
        setUser(formattedUser);
        setIsLoading(false);
        return { success: true, user: formattedUser };
      } else {
        const errMsg = response?.message || 'Registration failed.';
        setError(errMsg);
        setIsLoading(false);
        return { success: false, message: errMsg };
      }
    } catch (err) {
      const errMsg = 'Backend API server unavailable.';
      setError(errMsg);
      setIsLoading(false);
      return { success: false, message: errMsg };
    }
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
        isAuthenticated,
        isAdmin,
        isStaff,
        isLoading,
        error,
        setUser,
        setToken,
        login,
        register,
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
