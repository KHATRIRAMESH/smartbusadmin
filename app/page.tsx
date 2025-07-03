"use client";

import { AuthScreen } from "@/components/auth-screen";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Home() {
  const { user, isAuthenticated, isInitialized, isLoading, accessToken } = useAuthStore();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Reset hasRedirected when user is not authenticated
    if (!isAuthenticated || !user || !accessToken) {
      hasRedirected.current = false;
      return;
    }

    // Only redirect if auth is initialized and user is authenticated
    if (isInitialized && isAuthenticated && user && accessToken && !hasRedirected.current) {
      hasRedirected.current = true;
      // Redirect to appropriate dashboard based on role
      const redirectPath = user.role === "super_admin" ? "/dashboard" : "/school-admin/dashboard";
      console.log("Redirecting to:", redirectPath);
      router.push(redirectPath);
    }
  }, [isInitialized, isAuthenticated, user, accessToken, router]);

  // Show loading while auth is being initialized
  if (!isInitialized || isLoading) {
    return <LoadingSpinner message="Initializing..." />;
  }

  // If authenticated and has token, show loading while redirecting
  if (isAuthenticated && user && accessToken) {
    return <LoadingSpinner message="Redirecting to dashboard..." />;
  }

  // If not authenticated, show auth screen
  return (
    <main className="min-h-screen">
      <AuthScreen />
    </main>
  );
}
