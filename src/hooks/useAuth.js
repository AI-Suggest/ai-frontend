import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    
    try {
      const userData = await apiService.login(credentials);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    setIsLoading(true);
    
    try {
      const newUser = await apiService.signup(userData);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const profile = await apiService.getProfile();
      setUser(profile);
      return profile;
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
      return null;
    }
  }, [logout]);

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    checkAuthStatus,
  };
};