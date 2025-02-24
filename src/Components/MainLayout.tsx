import React from "react";
import { Card, CardContent } from "@/Components/ui/card";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        background: "linear-gradient(to right, #D83F31, #6D0900)",
        minHeight: "100vh",
        width: "100vw",
        position: "relative", 
      }}
    >
      {/* Background Image at the Bottom (Behind Content) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "400px",
          backgroundImage: "url('/lower.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      />

      {/* Upper Right Dots */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "47px",
          height: "96px",
          backgroundImage: "url('/dots.png')",
          backgroundSize: "contain",
          zIndex: 8,
        }}
      />

      {/* Lower Left Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          width: "47px",
          height: "96px",
          backgroundImage: "url('/dots.png')",
          backgroundSize: "contain",
          zIndex: 10,
        }}
      />

       {/* Navigation */}
       <nav className="p-4 flex justify-between items-center">
        <div className="text-white mt-6">
          <h1 className="text-3xl font-light" style={{fontWeight:"100"}}>THE</h1>
          <h2 className="text-3xl tracking-[0.4em] ">COMMUNITY</h2>
          <h3 className="text-3xl font-bold">PINBOARD</h3>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;