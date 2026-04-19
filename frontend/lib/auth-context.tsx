'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface DemoUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  name?: string;
  role?: 'user' | 'employer';
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  province?: string;
  district?: string;
  school?: string;
  major?: string;
  companyName?: string;
  website?: string;
  address?: string;
  taxId?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: DemoUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (user: DemoUser) => void;
  logout: () => void;
  getToken?: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('demoUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newUser: DemoUser) => {
    setUser(newUser);
    localStorage.setItem('demoUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demoUser');
  };

  const getToken = () => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
