import React, { createContext, useContext, useState } from 'react';

/**
 * AuthContext Provider
 * Owner: Manuja (Auth, RBAC & User Management)
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Admin User', role: 'admin' });
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
