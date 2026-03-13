import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const SESSION_KEY = "user_account_session";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string | null;
  pickup_or_dropoff: string | null;
};

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function saveSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  setAuthenticatedUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(loadSession);
  const [isLoggedIn, setIsLoggedIn] = useState(user !== null);

  const setAuthenticatedUser = useCallback((u: User) => {
    setUser(u);
    setIsLoggedIn(true);
    saveSession(u);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase
      .from("user_account")
      .select("user_id, first_name, last_name, email, address, pickup_or_dropoff, password")
      .eq("email", email)
      .single();

    if (error || !data) {
      throw new Error("Invalid email or password.");
    }

    if (data.password !== password) {
      throw new Error("Invalid email or password.");
    }

    const u: User = {
      id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      address: data.address,
      pickup_or_dropoff: data.pickup_or_dropoff,
    };
    setUser(u);
    setIsLoggedIn(true);
    saveSession(u);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, setAuthenticatedUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
