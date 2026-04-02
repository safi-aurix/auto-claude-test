'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';

const AuthContext = createContext(null);

const DEMO_CREDENTIALS = {
  email: 'agent@travelco.com',
  password: 'travel123',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback(({ email, password }) => {
    if (
      email === DEMO_CREDENTIALS.email
      && password === DEMO_CREDENTIALS.password
    ) {
      const userData = { email, name: 'Travel Agent' };
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
