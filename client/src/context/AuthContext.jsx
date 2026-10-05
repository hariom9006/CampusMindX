import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => apiService.getAuthToken());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session verification on mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuthSession() {
      const storedToken = apiService.getAuthToken();
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await apiService.getMe();
        if (isMounted) {
          if (res.success && res.user) {
            setUser(res.user);
            setIsAuthenticated(true);
            setToken(storedToken);
          } else {
            apiService.logout();
            setUser(null);
            setIsAuthenticated(false);
            setToken(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[AuthContext] Session verification failed:', err);
          apiService.logout();
          setUser(null);
          setIsAuthenticated(false);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkAuthSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await apiService.login(email, password);
      if (res.success && res.user) {
        setUser(res.user);
        setToken(res.token);
        setIsAuthenticated(true);
        return { success: true, user: res.user };
      } else {
        const errMsg = res.message || 'Invalid email or password.';
        setError(errMsg);
        return { success: false, message: errMsg };
      }
    } catch (err) {
      const errMsg = 'Network error or server unavailable. Please try again.';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  }, []);

  // Register handler
  const register = useCallback(async ({ name, email, password, role = 'student' }) => {
    setError(null);
    try {
      const res = await apiService.register({ name, email, password, role });
      if (res.success && res.user) {
        setUser(res.user);
        setToken(res.token);
        setIsAuthenticated(true);
        return { success: true, user: res.user };
      } else {
        const errMsg = res.message || 'Registration failed. Please check your information.';
        setError(errMsg);
        return { success: false, message: errMsg };
      }
    } catch (err) {
      const errMsg = 'Network error or server unavailable. Please try again.';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    apiService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // Update profile handler
  const updateProfile = useCallback(async (data) => {
    try {
      const res = await apiService.updateProfile(data);
      if (res.success && res.user) {
        setUser((prev) => ({ ...prev, ...res.user }));
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Profile update failed.' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
