'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from './api';
import type { CitizenProfile } from './types';

interface AuthCtx {
  token: string | null;
  citizen: CitizenProfile | null;
  ready: boolean;
  requestOtp: (nin: string, phone: string) => Promise<{ otpId: string; devCode: string }>;
  login: (otpId: string, code: string) => Promise<CitizenProfile>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  token: null,
  citizen: null,
  ready: false,
  requestOtp: async () => ({ otpId: '', devCode: '' }),
  login: async () => ({} as CitizenProfile),
  logout: () => {},
  refresh: async () => {},
});

const KEY = 'manara_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [citizen, setCitizen] = useState<CitizenProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) {
      setReady(true);
      return;
    }
    api
      .me(saved)
      .then((c) => {
        setToken(saved);
        setCitizen(c);
      })
      .catch(() => localStorage.removeItem(KEY))
      .finally(() => setReady(true));
  }, []);

  const requestOtp = useCallback(async (nin: string, phone: string) => {
    const res = await api.requestOtp(nin, phone);
    return { otpId: res.otpId, devCode: res.devCode };
  }, []);

  const login = useCallback(async (otpId: string, code: string) => {
    const res = await api.verifyOtp(otpId, code);
    localStorage.setItem(KEY, res.token);
    setToken(res.token);
    setCitizen(res.citizen);
    return res.citizen;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setToken(null);
    setCitizen(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      setCitizen(await api.me(token));
    } catch {
      /* keep stale */
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, citizen, ready, requestOtp, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
