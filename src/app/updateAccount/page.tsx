"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import MainLayout from "@/Components/HomeLayout";
import Navigation from "@/Components/Navigation";
import "@/styles/scrollbar.css";

interface UserData {
  userId: number;
  fullName: string;
  email: string;
  username: string;
  password: string;
}

const UpdateAccount: React.FC = () => {
  useAuth();
  const [userData, setUserData] = useState<UserData>({
    userId: 0,
    fullName: "",
    email: "",
    username: "",
    password: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log("Fetching user data from localStorage...");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed user data from localStorage:", parsedUser);
      setUserData({
        userId: parsedUser.userId || 0,
        fullName: parsedUser.fullName || "",
        email: parsedUser.email || "",
        username: parsedUser.userName || "",
        password: parsedUser.password || "",
      });
    } else {
      console.log("No user data found in localStorage.");
    }
  }, []);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Preparing to update account...");
      const externalId = localStorage.getItem("externalId") || "";
      const userId = localStorage.getItem("userId") || "";
      console.log("Retrieved externalId from localStorage:", externalId);

      const updatedData = {
        userId: userId,
        userName: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        passwordHash: userData.password,
        externalId: externalId,
      };

      console.log("Data being sent in PUT request:", updatedData);

      const updateResponse = await fetch(
        "https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/user",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update account");
      }

      console.log("Account updated successfully!");
      alert("Account updated successfully!");
    } catch (error: any) {
      console.error("Update error:", error.message);
      alert(`Error updating account: ${error.message}`);
    }
  };

  return (
    <MainLayout>
      <Navigation
        onShowModal={() => {}}
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
      />
      <div className="w-full max-w-2xl h-[600px] overflow-y-auto p-4 bg-transparent z-10 scrollbar-hide">
        <Card className="mb-4 bg-white border-black-700 hover:border-gray-600 transition-colors">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Update Account</h2>
            <form onSubmit={handleUpdateAccount} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={userData.fullName}
                  onChange={(e) => {
                    console.log("Updating fullName:", e.target.value);
                    setUserData({ ...userData, fullName: e.target.value });
                  }}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-800"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  onChange={(e) => {
                    console.log("Updating email:", e.target.value);
                    setUserData({ ...userData, email: e.target.value });
                  }}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-800"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={userData.username}
                  onChange={(e) => {
                    console.log("Updating username:", e.target.value);
                    setUserData({ ...userData, username: e.target.value });
                  }}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-800"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={userData.password}
                  onChange={(e) => {
                    console.log("Updating password:", e.target.value);
                    setUserData({ ...userData, password: e.target.value });
                  }}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-800"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                  Update Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UpdateAccount;