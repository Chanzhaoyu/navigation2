import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  resetPassword: (
    token: string,
    email: string,
    newPassword: string
  ) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (username === "admin" && password === "admin") {
        const newUser: User = {
          id: "1",
          username,
          email: "admin@example.com",
          avatar: "",
          isLoggedIn: true,
          preferences: {
            theme: "system",
            layout: "grid",
            showDescriptions: true,
            itemsPerPage: 12,
          },
        };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = async (
    username: string,
    email: string,
    _password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        avatar: "",
        isLoggedIn: true,
        preferences: {
          theme: "system",
          layout: "grid",
          showDescriptions: true,
          itemsPerPage: 12,
        },
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    token: string,
    email: string,
    newPassword: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(newPassword);
      if (token === "demo-token-123" && email) {
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, resetPassword, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
