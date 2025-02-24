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
    <nav className="flex justify-between items-center" style={{width: "100vw",zIndex:"11", top:"0", position:"fixed", padding:"1rem 1rem 0 1rem"}}>
      <div className="flex flex-col text-white leading-tight">
        <h1 className="text-left text-lg font-light">THE</h1>
        <h1 className="text-left text-lg" style={{ letterSpacing: "0.3em" }}>COMMUNITY</h1>
        <h1 className="text-left text-lg font-bold">PINBOARD</h1>
      </div>

      <div className="flex items-center gap-6" style={{ position: "fixed", top: "20", left: "50%", transform: "translateX(-50%)", zIndex: "9",overflow:"visible" }}>
        <div style={{backgroundColor:"#161616"}} className="flex gap-10 px-10 py-2 rounded-full shadow-xl items-center bg-white border-[2px] border-black">
          <NavIcon
            color="text-white"
            icon={Home} 
            onClick={() => router.push('/Dashboard')}
          />
          <NavIcon 
            icon={CirclePlus} 
            onClick={onShowModal}
            color="text-red-600 hover:text-red-700"
          />
          <NavIcon 
            color="text-white"
            icon={Pin} 
            onClick={() => router.push('/Pinned')}
          />
          {!hideSearchBar && (
            <div className="relative group" ref={searchRef}>
              <Search className="absolute left-3 top-2.5 text-white" size={20} />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="rounded-3xl pl-10 bg-transparent border-gray-300 text-white w-64 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6 relative">
  {/* User Profile Card */}
  <div className="border border-white flex-shrink-0 flex items-center justify-start gap-2 px-3 py-1 rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl" style={{minWidth:"200px"}}>
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
    <span className="text-white font-medium text-sm">
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