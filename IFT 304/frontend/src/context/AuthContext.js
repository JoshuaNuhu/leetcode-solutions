import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiFetch } from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on app startup
    SecureStore.getItemAsync('user_jwt').then((token) => {
      if (token) setUser({ token });
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await SecureStore.setItemAsync('user_jwt', data.access_token);
    setUser({ ...data.user, token: data.access_token });
  };

  const signup = async (name, email, password) => {
    await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    await login(email, password);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('user_jwt');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};