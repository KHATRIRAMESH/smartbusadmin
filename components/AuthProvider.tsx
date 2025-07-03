"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { LoadingSpinner } from "./LoadingSpinner";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isInitialized, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  // Show loading while auth is being initialized
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Initializing..." />
      </div>
    );
  }

  return <>{children}</>;
}; 