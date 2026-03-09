import React, { createContext, useContext, useState, useCallback } from "react";

type User = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string | null;
  pickup_or_dropoff: string | null;
};

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const setAuthenticatedUser = useCallback((user: User) => {
    setUser(user);
    setIsLoggedIn(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${apiBaseUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let message = "Unable to sign in.";
      try {
        const data = await response.json();
        if (typeof data?.message === "string") {
          message = data.message;
        }
      } catch {
        // ignore bad JSON
      }
      throw new Error(message);
    }

    const data = await response.json();
    const returnedUser = data?.user;

    if (!returnedUser) {
      throw new Error("No user returned from server.");
    }

    setUser(returnedUser);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, setAuthenticatedUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};