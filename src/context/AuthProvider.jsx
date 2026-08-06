import { useCallback, useMemo, useState } from 'react';
import { login as loginRequest } from '../api/authApi.js';
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
  updateStoredAuthUser,
} from '../utils/authStorage.js';
import AuthContext from './AuthContext.js';

function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getAuthSession());

  const login = useCallback(async (credentials) => {
    const loginResponse = await loginRequest(credentials);
    const nextSession = saveAuthSession(loginResponse);

    setSession(nextSession);

    return nextSession.user;
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
  }, []);

  const refreshUser = useCallback((userData) => {
    const nextSession = updateStoredAuthUser(userData);
    if (nextSession) setSession(nextSession);
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      login,
      logout,
      refreshUser,
      hasRole: (role) => session?.user?.role === role,
    }),
    [session, login, logout, refreshUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
