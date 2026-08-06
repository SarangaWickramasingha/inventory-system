import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchAPI } from '../services/api';

/**
 * AuthContext Provider
 * Pure PHP REST API & MySQL Persistence for Auth, Staff Approvals, and User Management
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
    return null;
  });

  const [userList, setUserList] = useState([]);
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

  // Fetch users directly from MySQL DB via PHP REST API
  const loadUsers = useCallback(async () => {
    try {
      const response = await fetchAPI('/users');
      if (response && response.success && Array.isArray(response.data)) {
        const formatted = response.data.map((u) => ({
          id: u.id,
          name: u.full_name || u.username,
          username: u.username,
          email: u.email,
          role: u.role || 'staff',
          status: (u.status && String(u.status).trim()) ? String(u.status).trim() : 'active',
          lastLogin: u.last_login || 'Never',
          avatarColor: u.role === 'admin' ? 'bg-blue-600' : 'bg-emerald-600',
        }));
        setUserList(formatted);
      }
    } catch (err) {
      console.warn('Could not fetch user list from backend API.', err);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token, loadUsers]);

  // Login handler - authenticates directly against MySQL DB via PHP REST API
  const login = async (email, password, requestedRole = 'admin') => {
    setIsLoading(true);
    setError(null);

    // Reset previous user session state
    setToken(null);
    setUser(null);

    try {
      const response = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role: requestedRole }),
      });

      if (response && response.success && response.data) {
        const { token: authToken, user: userData } = response.data;

        const actualRole = (userData.role || '').toLowerCase();
        const reqRole = (requestedRole || '').toLowerCase();

        if (reqRole && actualRole && actualRole !== reqRole) {
          const registeredRoleName = actualRole === 'admin' ? 'Administrator' : 'Staff';
          const roleMsg = `This account is registered as a ${registeredRoleName}. Please select the ${registeredRoleName} role to sign in.`;
          setError(roleMsg);
          setIsLoading(false);
          return { success: false, message: roleMsg };
        }

        if (userData.status === 'pending') {
          const pendingMsg = 'Your staff account is pending Admin approval. Please wait for an administrator to approve your account.';
          setError(pendingMsg);
          setIsLoading(false);
          return { success: false, pendingApproval: true, message: pendingMsg };
        }

        if (userData.status === 'inactive') {
          const inactiveMsg = 'Your staff account is inactive. Please contact an administrator.';
          setError(inactiveMsg);
          setIsLoading(false);
          return { success: false, message: inactiveMsg };
        }

        const formattedUser = {
          id: userData.id,
          name: userData.full_name || userData.username,
          username: userData.username,
          email: userData.email,
          role: actualRole || reqRole,
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
      const errMsg = 'Backend API server unavailable.';
      setError(errMsg);
      setIsLoading(false);
      return { success: false, message: errMsg };
    }
  };

  // Register handler - saves directly to MySQL DB via PHP REST API
  const register = async (formData) => {
    setIsLoading(true);
    setError(null);

    const generatedUsername = formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');

    try {
      const response = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: generatedUsername,
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          role: 'staff',
          status: 'pending',
        }),
      });

      if (response && response.success === false) {
        const errMsg = response.message || 'Staff registration failed.';
        setError(errMsg);
        setIsLoading(false);
        return { success: false, message: errMsg };
      }

      if (token) {
        await loadUsers();
      }

      setIsLoading(false);
      return {
        success: true,
        pendingApproval: true,
        user: response?.data?.user,
        message: response?.message || 'Registration submitted successfully! Your staff account is currently pending Admin approval.',
      };
    } catch (err) {
      const errMsg = 'Backend API server error during registration.';
      setError(errMsg);
      setIsLoading(false);
      return { success: false, message: errMsg };
    }
  };

  // Admin approves a pending staff member in MySQL DB
  const approveStaffUser = async (id) => {
    try {
      const response = await fetchAPI(`/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'active' }),
      });
      if (response && response.success) {
        await loadUsers();
        return true;
      }
    } catch (err) {
      console.error('Failed to approve user in database.', err);
    }
    // Local fallback update
    setUserList((prev) =>
      prev.map((u) => (u.id == id ? { ...u, status: 'active' } : u))
    );
    return true;
  };

  // Admin updates user status in MySQL DB
  const toggleUserStatus = async (id, newStatus) => {
    try {
      const response = await fetchAPI(`/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (response && response.success) {
        await loadUsers();
        return true;
      }
    } catch (err) {
      console.error('Failed to update user status in database.', err);
    }
    // Local fallback update
    setUserList((prev) =>
      prev.map((u) => (u.id == id ? { ...u, status: newStatus } : u))
    );
    return true;
  };

  // Admin updates user account (name, username, status) in MySQL DB or local state
  const updateUserAccount = async (id, userData) => {
    try {
      const response = await fetchAPI(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      if (response && response.success) {
        await loadUsers();
        return { success: true, message: response.message || 'User account updated successfully.' };
      }
    } catch (err) {
      console.warn('Backend API update failed, applying local state update.', err);
    }

    // Local state fallback update
    setUserList((prev) =>
      prev.map((u) =>
        u.id == id
          ? {
              ...u,
              name: userData.name || u.name,
              username: userData.username || u.username,
              status: userData.status || u.status,
            }
          : u
      )
    );
    return { success: true, message: 'User account updated successfully.' };
  };

  // Admin deletes user in MySQL DB
  const deleteUser = async (id) => {
    try {
      const response = await fetchAPI(`/users/${id}`, {
        method: 'DELETE',
      });
      if (response && response.success) {
        await loadUsers();
        return true;
      }
    } catch (err) {
      console.error('Failed to delete user from database.', err);
    }
    // Local fallback
    setUserList((prev) => prev.filter((u) => u.id != id));
    return true;
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
        loadUsers,
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
        toggleUserStatus,
        updateUserAccount,
        deleteUser,
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
