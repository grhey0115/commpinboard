"use client";

import React, { useState } from "react";
import MainLayout from "../../Components/MainLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(
        "http://localhost:5062/api/user/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            userName: username, 
            password: password,
          }),
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data);
  
      // FIX: Check if userName exists instead of success flag
      if (!data.userName) {
        throw new Error("Invalid credentials or missing user data");
      }
  
      // Store user details
      localStorage.setItem("authenticatedUser", data.userName);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("fullName", data.fullName || "");
      localStorage.setItem("userName", data.userName|| "");
      localStorage.setItem("externalId", data.externalId|| "");
      localStorage.setItem("password", data.passwordHash|| "");
      localStorage.setItem("email", data.email|| "");
  
      router.push("/Dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <MainLayout>
      <div className="flex flex-col items-center z-10">
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl font-extralight font-sans">Hello</h2>
          <h3 className="text-4xl font-extralight text-white font-sans tracking-[0.1em]">Sign In</h3>
        </div>

        <div className="w-96">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4">
            <div className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2 text-left mt-8">
                <label className="text-lg text-red-500">Username</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full border-0 border-b text-lg border-red-500 rounded-none focus:ring-0 focus:border-red-500 px-0 bg-transparent"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2 text-left">
                <label className="text-red-500 text-lg">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full border-0 border-b border-red-500 rounded-none focus:ring-0 focus:border-red-500 px-0 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              {/* Sign In Button */}
              <Button
                onClick={handleLogin}
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3"
                disabled={loading}
              >
                {loading ? "Signing In..." : "SIGN IN"}
              </Button>

              {/* Create Account Link */}
              <div className="text-center text-sm">
                <span className="text-gray-600">New User? </span>
                <a href="/SignUp" className="text-red-600 hover:text-gray-800">
                  Create Account!
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;