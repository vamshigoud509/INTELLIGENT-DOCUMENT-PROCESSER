import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { apiLogin, apiRegister, apiGetMe } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (payload: { email: string; password: string; name: string; organization?: string }) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('docusphere_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('docusphere_token');
      if (storedToken) {
        try {
          const profile = await apiGetMe();
          setUser(profile);
          setToken(storedToken);
        } catch (err) {
          console.warn('Session expired or invalid, logging out.');
          localStorage.removeItem('docusphere_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await apiLogin(email, pass);
    localStorage.setItem('docusphere_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (payload: { email: string; password: string; name: string; organization?: string }) => {
    const data = await apiRegister(payload);
    localStorage.setItem('docusphere_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const loginAsDemo = async () => {
    await login('demo@docusphere.io', 'password123');
  };

  const logout = () => {
    localStorage.removeItem('docusphere_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
