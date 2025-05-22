"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userRole: string | null;
  signOut: () => void;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const checkAuthStatus = () => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("auth_token");
      setIsAuthenticated(!!token);
      return !!token;
    }
    return false;
  };

  const fetchUserRole = async () => {
    try {
      if (isAuthenticated) {
        const response = await authApi.getCurrentUser();
        const { user } = response.data;
        setUserRole(user.role);
        setIsAdmin(user.role === 'admin');
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      setUserRole(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Check auth status on mount and set up storage event listener
    const isAuth = checkAuthStatus();
    
    if (isAuth) {
      fetchUserRole();
    }

    // Listen for storage events (for multi-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        const hasToken = checkAuthStatus();
        if (hasToken) {
          fetchUserRole();
        } else {
          setUserRole(null);
          setIsAdmin(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, fetchUserRole]);

  const signOut = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    setUserRole(null);
    setIsAdmin(false);
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, userRole, signOut, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}; 
