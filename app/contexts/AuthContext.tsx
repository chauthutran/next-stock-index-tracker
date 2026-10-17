"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import * as Utils from "@/lib/utils";
import { TUser } from "../../types/models";

interface AuthContextProps {
  user: TUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (user: Partial<TUser>) => Promise<void>;
  setUser: (user: TUser | null) => void;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async (userData: Partial<TUser>) => {},
  setUser: (userData: TUser | null) => {},
  error: null,
  loading: false,
});

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType: "login", email, password }),
      });
      if (!response.ok) {
        throw new Error("Failed to log in.");
      }
      const userData = await response.json();
      if (userData) {
        setUser(userData);
      } else {
        setError("Username/password is wrong.");
      }
    } catch (err) {
      setError(Utils.getErrMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: Partial<TUser>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType: "add", payload: userData }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to register.");
      }
      const newUser = result;
      setUser(newUser);
    } catch (err) {
      setError(Utils.getErrMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, error: error, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
