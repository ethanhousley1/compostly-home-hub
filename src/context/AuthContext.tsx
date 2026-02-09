import React, { createContext, useContext, useState, useCallback } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => void;
  signup: (data: { firstName: string; lastName: string; email: string; password: string }) => void;
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
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const login = useCallback((email: string, _password: string) => {
    setUser({ name: email.split("@")[0], email });
    setIsLoggedIn(true);
  }, []);

  const signup = useCallback((data: { firstName: string; lastName: string; email: string; password: string }) => {
    setUser({ name: `${data.firstName} ${data.lastName}`, email: data.email });
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
