"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Home, CirclePlus, Pin, Search, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavigationProps {
  onShowModal: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  hideSearchBar?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  onShowModal,
  searchTerm = "",
  onSearchChange,
  hideSearchBar = false,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [fullName, setFullName] = useState("");
  const settingsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("fullName") || "Guest";
    setFullName(storedName);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authenticatedUser");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    router.replace("/Login");
  };

  return (
    <nav className="w-full p-4 flex justify-between items-center text-white">
      <div className="text-2xl font-bold text-left">
        THE <br /> COMMUNITY <br /> PINBOARD
      </div>

      <div className="flex flex-col items-center gap-4 mt-7">
        <div className="flex gap-8 bg-black px-8 py-4 rounded-full items-center">
          <Home size={20} className="cursor-pointer hover:text-gray-300 transition-colors"
          onClick={() => router.push('/Dashboard')} />
          <CirclePlus
            size={20}
            className="cursor-pointer text-red-500 hover:text-red-400 transition-colors"
            onClick={onShowModal}
          />
          <Pin size={20} className="cursor-pointer hover:text-gray-300 transition-colors" 
          onClick={() => router.push('/Pinned')}/>
        </div>

        {!hideSearchBar && ( // Conditionally render search bar
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 bg-white-800 border-gray-700 text-gray-800 w-64"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full cursor-pointer">
          <User size={20} />
          <span>{fullName}</span>
        </div>
        <div className="relative" ref={settingsRef}>
          <Settings
            className="cursor-pointer hover:text-gray-300 transition-colors"
            size={24}
            onClick={() => setShowSettings(!showSettings)}
          />
          {showSettings && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 shadow-lg rounded-lg py-2 z-50">
              <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              onClick={() => router.push('/updateAccount')}>
                Update Account
              </button>
              <button
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
