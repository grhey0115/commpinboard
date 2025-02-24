"use client";

import React from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      <div
        className="flex whitespace-nowrap animate-[scroll_25s_linear_infinite]"
        style={{
          animation: "scroll 25s linear infinite",
        }}
      >
        {/* First set of images */}
        {images.map((image, index) => (
          <div key={`first-${index}`} className="w-1/3 flex-shrink-0">
            <img src={image} alt={`Slide ${index + 1}`} className="w-full h-64 object-cover" />
          </div>
        ))}
        {/* Duplicate set of images for seamless loop */}
        {images.map((image, index) => (
          <div key={`second-${index}`} className="w-1/3 flex-shrink-0">
            <img src={image} alt={`Slide ${index + 1}`} className="w-full h-64 object-cover" />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
const LandingPage: React.FC = () => {
  const images: string[] = ["/front1.avif", "/front2.avif", "/front3.webp"];
  const router = useRouter();

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(to right, #d33c2f, #7e1308)",
      }}
    >
     
      {/* Background Image at the Bottom (Behind Content) */}
      <div
        className="absolute bottom-0 left-0 w-full h-48 z-[1]"
        style={{
          backgroundImage: "url('/lower.svg')",
          backgroundSize: "cover",
          backgroundBlendMode: "normal",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

        {/* Upper Right Dots */}
        <div
        className="absolute top-5 mt-7 right-5 w-24 h-24 bg-contain bg-no-repeat z-10"
        style={{ backgroundImage: "url('/dots.png')" }}
      />
       {/* Lower Left Dots */}
       <div
        className="absolute bottom-5 left-5 ml-5 mb-5 w-24 h-24 bg-contain bg-no-repeat z-10"
        style={{ backgroundImage: "url('/dots.png')" }}
      />
      
      {/* Navigation */}
      <nav className="p-4 flex justify-between items-center">
        <div className="text-white mt-6">
          <h1 className="text-4xl  font-light">THE</h1>
          <h2 className="text-5xl tracking-[0.4em] ">COMMUNITY</h2>
          <h3 className="text-4xl font-bold">PINBOARD</h3>
        </div>
      </nav>

      {/* Carousel */}
      <div className="w-full px-4 py-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <ImageCarousel images={images} />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <p className="text-white font-extralight tracking-[0.3em] text-lg md:text-xl max-w-2xl mb-8 z-10">
          Your digital hub for local news, events, and announcements that keep
          neighbors connected and informed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button
            variant="outline"
            className="w-full z-10 bg-transparent text-white border-white hover:bg-white hover:text-red-600"
            onClick={() => router.push('/Login')}
          >
            SIGN IN
          </Button>
          <Button 
            className="w-full z-10 bg-white text-red-600 hover:bg-gray-100"
            onClick={() => router.push('/SignUp')}
          >
            SIGN UP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
