import React from "react";
import { Card, CardContent } from "@/Components/ui/card";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        background: "linear-gradient(to right, #d33c2f, #7e1308)",
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

      

      {/* Main Content */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;