import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../utils/apiClient.js';

const AuthContext = createContext();

const TOKEN_KEY = 'taskflow_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await apiClient.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      const { data } = await apiClient.post('/auth/login', credentials);
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to login');
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await apiClient.post('/auth/register', payload);
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      toast.success('Account created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to register');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    toast.success('Logged out');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

