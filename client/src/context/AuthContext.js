import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for token on initial load
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check expiry
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setCurrentUser(null);
        } else {
          // You could also fetch full user profile here via API if needed
          setCurrentUser({
            id: decoded.id,
            role: decoded.role,
            // name and email might require a quick lookup or be stored in localStorage
            ...JSON.parse(localStorage.getItem('user_details') || '{}')
          });
        }
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  const loginContext = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user_details', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logoutContext = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_details');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loginContext,
    logoutContext,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
