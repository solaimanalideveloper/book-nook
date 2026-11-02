"use client";

import * as React from "react";

export type User = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "booknook-user";

// Mock session store (replace with real auth later). Kept as an external
// store so `useSyncExternalStore` can hydrate safely without a flash of
// wrong UI and without setState-inside-effect.
let currentUser: User | null = null;
let initialized = false;
const listeners = new Set<() => void>();

function readStored(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function setUser(next: User | null) {
  currentUser = next;
  try {
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // storage unavailable — session lasts until reload
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): User | null {
  if (!initialized) {
    initialized = true;
    currentUser = readStored();
  }
  return currentUser;
}

function getServerSnapshot(): User | null {
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const login = React.useCallback((name: string, email: string) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) return;
    setUser({ name: trimmedName, email: trimmedEmail });
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
