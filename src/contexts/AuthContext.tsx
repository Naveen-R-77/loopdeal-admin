import React, { createContext, useContext, useState, ReactNode } from "react";
import { API_BASE_URL } from "@/config";

interface AuthContextType {
  isAuthenticated: boolean;
  adminName: string;
  adminEmail: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminName, setAdminName] = useState(() => localStorage.getItem("admin_name") || "Naveen Ramesh");
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem("admin_email") || "naveen@loopdeal.in");
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("admin_auth") === "true"
  );

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setAdminName(data.user.name);
        setAdminEmail(data.user.email);
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_name", data.user.name);
        localStorage.setItem("admin_email", data.user.email);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Auth Exception:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      return response.ok;
    } catch (error) {
      console.error("Registration Exception:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_name");
    localStorage.removeItem("admin_email");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminName, adminEmail, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
