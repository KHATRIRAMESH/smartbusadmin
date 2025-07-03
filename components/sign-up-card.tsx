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
import { AuthFlow } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SignUpCardProps {
  setState: (state: AuthFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Client-side validation
    if (!name || !email || !password || !secretKey) {
      alert("All fields are required including the secret key");
      return;
    }
    
    setIsLoading(true);
    console.log("Super admin sign-up attempt:", { name, email });
    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, secretKey }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await res.json();
      
      // Use the login method to set everything atomically
      login(data.user, data.access_token, data.refresh_token);
      
      console.log("Super admin sign-up successful:", data);
      
      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
      setSecretKey("");
      setShowPassword(false);
      setShowSecretKey(false);
      
      // Reset loading state
      setIsLoading(false);
      
      // Use window.location for more reliable redirect
      window.location.href = "/dashboard";
      
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert(error instanceof Error ? error.message : "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Register as Super Admin Account</CardTitle>
        <CardDescription>
          Register as a Super Administrator to manage the SmartBus system. You will need a valid secret key to complete registration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handleSubmit}>
          <Input
            disabled={isLoading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            type="text"
            required
          />
          <Input
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
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
          <div className="relative">
            <Input
              disabled={isLoading}
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Secret Key"
              type={showSecretKey ? "text" : "password"}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowSecretKey(!showSecretKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              disabled={isLoading}
            >
              {showSecretKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            The secret key is required to verify your authorization to create a super admin account.
          </p>
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Super Admin Account"}
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5"></div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signIn")}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
