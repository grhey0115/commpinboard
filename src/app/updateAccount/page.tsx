"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import MainLayout from "@/Components/HomeLayout";
import Navigation from "@/Components/Navigation";
import { Pencil } from "lucide-react"; // Assuming you're using lucide-react for icons
import "@/styles/scrollbar.css";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";

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
  const [editData, setEditData] = useState<UserData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData({
        userId: parsedUser.userId || 0,
        fullName: parsedUser.fullName || "",
        email: parsedUser.email || "",
        username: parsedUser.userName || "",
        password: parsedUser.password || "",
      });
    }
  }, []);

  const handleEditClick = () => {
    setEditData({ ...userData });
    setIsModalOpen(true);
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    setIsSubmitting(true);

    try {
      const externalId = localStorage.getItem("externalId") || "";
      const userId = localStorage.getItem("userId") || "";

      const updatedData = {
        userId: userId,
        userName: editData.username,
        fullName: editData.fullName,
        email: editData.email,
        passwordHash: editData.password,
        externalId: externalId,
      };

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

      setUserData(editData);
      setIsModalOpen(false);
      alert("Account updated successfully!");
    } catch (error: any) {
      alert(`Error updating account: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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
            {/* Profile Card Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {/* Avatar Section */}
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={localStorage.getItem("avatar") || "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"}
                      alt="User"
                    />
                    <AvatarFallback className="text-gray-600 text-xs">
                      {localStorage.getItem("fullName")?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                </div>
              </div>

                {/* User Info */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {localStorage.getItem("fullName") || "Guest"}
                  </h2>
                  <h3 className="text-sm text-left text-gray-600">
                    @{localStorage.getItem("userName") || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {localStorage.getItem("email") || "Not Provided"}
                  </p>
                </div>
              </div>


              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditClick}
                className="text-gray-600 hover:text-gray-800"
              >
                <Pencil className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Edit Modal */}
        {isModalOpen && editData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md m-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Profile</h2>
              <form onSubmit={handleUpdateAccount} className="space-y-4">
              <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={editData.fullName}
                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    placeholder={localStorage.getItem("fullName") || "Enter your full name"}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    placeholder={localStorage.getItem("userName") || "Enter your User Name"}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    placeholder={localStorage.getItem("email") || "Enter your Email"}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={editData.password}
                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      
    </MainLayout>
  );
};

export default UpdateAccount;