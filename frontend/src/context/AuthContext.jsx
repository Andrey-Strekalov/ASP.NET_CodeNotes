import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password, confirmPassword) => {
    try {
      const data = await authService.register(username, email, password, confirmPassword);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка регистрации',
      };
    }
  };

  const login = async (username, password, rememberMe = false) => {
    try {
      const data = await authService.login(username, password, rememberMe);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Неверный логин или пароль',
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user && authService.isAuthenticated(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
