"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { AuthResponse, User } from "@/lib/types";

type Credentials = { email: string; password: string };
type Registration = Credentials & { displayName: string };

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (registration: Registration) => Promise<void>;
  logout: () => void;
};

const STORAGE_KEY = "structlab-session";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const session = JSON.parse(saved) as { token: string; user: User };
          setToken(session.token);
          setUser(session.user);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const saveSession = useCallback((response: AuthResponse) => {
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: response.token, user: response.user }),
    );
  }, []);

  const login = useCallback(
    async (credentials: Credentials) => {
      const response = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      saveSession(response);
    },
    [saveSession],
  );

  const register = useCallback(
    async (registration: Registration) => {
      const response = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(registration),
      });
      saveSession(response);
    },
    [saveSession],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return context;
}
