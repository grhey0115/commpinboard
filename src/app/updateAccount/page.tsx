"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import MainLayout from "@/Components/HomeLayout";
import Navigation from "@/Components/Navigation";
import "@/styles/scrollbar.css";

const UpdateAccount: React.FC = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Fetch user details on mount using userId from localStorage
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userIdString = localStorage.getItem("userId");
      if (!userIdString) {
        setError("User not found. Please log in.");
        setLoading(false);
        return;
      }

      const userId = parseInt(userIdString, 10);
      if (isNaN(userId)) {
        setError("Invalid User ID. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/user/${userId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.status}`);
        }

        const userData = await response.json();
        setFullName(userData.fullName || "");
        setEmail(userData.email || "");
      } catch (err: any) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Handle form submission to update account using PUT on /user with userId from localStorage
  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    const userIdString = localStorage.getItem("userId");
    if (!userIdString) {
      setError("User not found. Please log in.");
      return;
    }

    const userId = parseInt(userIdString, 10);
    if (isNaN(userId)) {
      setError("Invalid User ID. Please log in again.");
      return;
    }

    const updatedData = {
      userId, // Explicitly included from localStorage
      fullName,
      email,
    };

    try {
      const response = await fetch(
        `https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update account");
      }

      alert("Account updated successfully!");
    } catch (err: any) {
      setError(`Error updating account: ${err.message}`);
    }
  };

  return (
    <MainLayout>
      <Navigation
        onShowModal={() => {}} // No modal needed, but keeping Navigation intact
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
      />

      <div className="w-full max-w-2xl h-[600px] overflow-y-auto p-4 bg-transparent z-10 scrollbar-hide">
        {loading ? (
          <p className="text-center text-white">Loading account details...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <Card className="mb-4 bg-white border-black-700 hover:border-gray-600 transition-colors">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Update Account
              </h2>
              <form onSubmit={handleUpdateAccount} className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-800"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-800"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                  >
                    Update Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default UpdateAccount;