"use client";

import React, { useState } from "react";
import MainLayout from "../../Components/MainLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async () => {
    if (!username || !fullName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/User",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            externalId: crypto.randomUUID(),
            userName: username,
            fullName: fullName,
            email: email,
            passwordHash: password,
            dateCreated: new Date().toISOString(),
            dateUpdated: new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create an account.");
      }

      router.push("/Login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center z-10">
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl font-extralight font-sans">Hello</h2>
          <h3 className="text-4xl font-extralight text-white font-sans tracking-[0.1em]">Sign Up</h3>
        </div>

        <div className="w-120">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4">
            <div className="space-y-6">
              {/* Username and Full Name (Two Columns) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <label className="text-lg text-red-500">Username</label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-0 border-b text-lg border-red-500 rounded-none focus:ring-0 focus:border-red-500 px-0 bg-transparent"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-lg text-red-500">Full Name</label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border-0 border-b text-lg border-red-500 rounded-none focus:ring-0 focus:border-red-500 px-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2 text-left">
                <label className="text-lg text-red-500">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-0 border-b text-lg border-red-500 rounded-none focus:ring-0 focus:border-red-500 px-0 bg-transparent"
                />
              </div>

              {/* Password and Confirm Password (Two Columns) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <label className="text-lg text-red-500">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-0 border-b text-lg border-red-500 rounded-none focus:ring-0 focus:border-red-500 px-0 bg-transparent"
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
                <div className="space-y-2 text-left">
                  <label className="text-lg text-red-500">Confirm Password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-0 border-b text-lg border-red-500 rounded-none focus:ring-0 focus:border-red-500 px-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              {/* Sign Up Button */}
              <Button
                onClick={handleSignUp}
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "SIGN UP"}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <a href="/Login" className="text-red-600 hover:text-gray-800">
                  Log In
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignUp;