"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Home, CirclePlus, Pin, Search, User, Settings, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"


interface NavigationProps {
  onShowModal: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  hideSearchBar?: boolean;
}

interface NavIconProps {
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
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
  const searchRef = useRef<HTMLDivElement>(null);
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

  const NavIcon: React.FC<NavIconProps> = ({ icon: Icon, onClick, color = "text-gray-700 hover:text-gray-900" }) => (
    <div 
      className={`cursor-pointer ${color} transition-all duration-200 transform hover:scale-110`}
      onClick={onClick}
    >
      <Icon size={24} strokeWidth={2} />
    </div>
  );

  return (
    <nav className="w-full p-6 flex justify-between items-center">
      <div className="flex flex-col text-gray-900">
        <h1 className="text-left text-3xl font-light tracking-tight">THE</h1>
        <h1 className="text-left text-3xl tracking-[0.3em] my-1">COMMUNITY</h1>
        <h1 className="text-left text-3xl font-bold">PINBOARD</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-10 px-10 py-4 rounded-full shadow-lg items-center bg-white">
          <NavIcon 
            icon={Home} 
            onClick={() => router.push('/Dashboard')}
          />
          <NavIcon 
            icon={CirclePlus} 
            onClick={onShowModal}
            color="text-red-600 hover:text-red-700"
          />
          <NavIcon 
            icon={Pin} 
            onClick={() => router.push('/Pinned')}
          />
          {!hideSearchBar && (
            <div className="relative group" ref={searchRef}>
              <Search className="absolute left-3 top-2.5 text-gray-600" size={20} />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 bg-white border-gray-300 text-gray-900 w-64 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6 relative">
  {/* User Profile Card */}
  <div className="flex items-center gap-3 px-5 py-2.5 rounded-full shadow-lg bg-white cursor-pointer transition-all duration-200 hover:shadow-xl hover:bg-gray-50">
    {/* Avatar */}
    <Avatar className="h-8 w-8"> 
      <AvatarImage 
        src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light" 
        alt="User" 
        className="object-cover"
      />
      <AvatarFallback className="text-sm font-medium">U</AvatarFallback>
    </Avatar>

    {/* User Name */}
    <span className="text-gray-900 font-medium text-sm">
      {fullName}
    </span>
  </div>



        
        <div className="relative" ref={settingsRef}>
          <Settings
            className="cursor-pointer text-white hover:text-white-900 transition-transform duration-200 hover:rotate-90"
            size={24}
            strokeWidth={2}
            onClick={() => setShowSettings(!showSettings)}
          />
          {showSettings && (
            <div className="absolute right-0 mt-3 w-56 rounded-lg py-2 shadow-xl bg-white border border-gray-200">
              <button 
                className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors flex items-center gap-2"
                onClick={() => router.push('/updateAccount')}
              >
                <User size={18} strokeWidth={2} />
                Update Account
              </button>
              <button
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                onClick={handleLogout}
              >
                <Settings size={18} strokeWidth={2} />
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