"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="p-3 bg-white text-black flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded" />
        <div>
          <h1 className="text-xl font-bold">SmartBus Admin</h1>
          {isAuthenticated && user && (
            <p className="text-sm text-gray-600">
              {user.role === "super_admin" ? "Super Administrator" : "School Administrator"}
            </p>
          )}
        </div>
      </div>
      
      {isAuthenticated && user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            Welcome, {user.name}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}
