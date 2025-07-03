import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";

import { AuthFlow, AuthRole } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SignInCardProps {
  setState: (state: AuthFlow) => void;
  role: AuthRole;
}

export const SignInCard = ({ setState, role }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Sign-in attempt:", { email, password, role });
    
    try {
      const endpoint = role === "super_admin" 
        ? "/super-admin/login" 
        : "/school-admin/login";
        
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await res.json();
      
      // Use the login method to set everything atomically
      login(data.user, data.access_token, data.refresh_token);
      
      console.log(`${role} sign-in successful:`, data);
      
      // Reset loading state
      setIsLoading(false);
      
      // Use window.location for more reliable redirect
      const redirectPath = role === "super_admin" ? "/dashboard" : "/school-admin/dashboard";
      window.location.href = redirectPath;
      
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(error instanceof Error ? error.message : "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          {role === "super_admin" ? "Super Administrator" : "School Administrator"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handleSubmit}>
          <Input
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <div className="relative">
            <Input
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign In"}
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5"></div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
