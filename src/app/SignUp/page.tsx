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
      const response = await fetch("http://localhost:5062/api/User", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          externalId: crypto.randomUUID(), // ✅ Generate UUID for externalId
          userName: username,  // ✅ Match API field name
          fullName: fullName,
          email: email,
          passwordHash: password, // ✅ Match API field name
          dateCreated: new Date().toISOString(), // ✅ Send correct date format
          dateUpdated: new Date().toISOString(),
        }),
      });
  
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
        <div className="w-96">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4">
            <div className="grid grid-cols-1 gap-4">
              <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Eye size={20} />
                </button>
              </div>
              <Input type={showPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
            <Button onClick={handleSignUp} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 mt-4" disabled={loading}>
              {loading ? "Signing Up..." : "SIGN UP"}
            </Button>
            <div className="text-center text-sm mt-2">
              <span className="text-gray-600">Already have an account? </span>
              <a href="/Login" className="text-red-600 hover:text-gray-800">Log In</a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignUp;
