"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Clock, User, Settings, Home, CirclePlus, Pin, X } from "lucide-react";
import MainLayout from "@/Components/HomeLayout";
import "@/styles/scrollbar.css";

interface Post {
  externalId: string;
  userExternalId: string;
  title: string;
  content: string;
  eventDate: string;
  location: string;
  dateCreated: string;
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const settingsRef = useRef<HTMLDivElement>(null);
  const [fullName, setFullName] = useState("");

  // Retrieve fullName from localStorage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem("fullName") || "Guest";
    setFullName(storedName);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5062/api/Post");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const addPost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and Content are required!");
      return;
    }

    const userId = 1; // Replace with dynamic userId from localStorage or state

    try {
      const response = await fetch("http://localhost:5062/api/Post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          externalId: crypto.randomUUID(), // Generate a new GUID
          title,
          content,
          eventDate: new Date().toISOString(), // Current date-time
          location: "Some location", 
          userId, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add post");
      }

      const newPost = await response.json();
      setPosts((prevPosts) => [newPost, ...prevPosts]); 
      setShowModal(false);
      setTitle("");
      setContent("");
    } catch (err: any) {
      alert(`Error adding post: ${err.message}`);
    }
  };

  return (
    <MainLayout>
      {/* Top Navigation Bar */}
      <nav className="w-full p-4 flex justify-between items-center text-white">
        <div className="text-2xl font-bold text-left">
          THE <br /> COMMUNITY <br /> PINBOARD
        </div>

        <div className="flex gap-8 bg-black px-8 py-4 rounded-full items-center">
          <Home size={20} className="cursor-pointer" />
          <CirclePlus
            size={20}
            className="cursor-pointer text-red-500"
            onClick={() => setShowModal(true)}
          />
          <Pin size={20} className="cursor-pointer" />
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full cursor-pointer">
            <User size={20} />
            <span>{fullName}</span> {/* Display fullName dynamically */}
          </div>
          <div className="relative" ref={settingsRef}>
            <Settings
              className="cursor-pointer"
              size={24}
              onClick={() => setShowSettings(!showSettings)}
            />
            {showSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-200">Update Account</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Posts Section */}
      <div className="w-full max-w-2xl h-[600px] overflow-y-auto p-4 bg-transparent z-10 scrollbar-hide">
        {loading ? (
          <p className="text-center text-white">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-white">No posts available</p>
        ) : (
          posts.map((post, index) => (
            <Card key={index} className="mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User className="text-gray-500" size={16} />
                    <span className="font-bold">{post.userExternalId || "Unknown User"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock size={16} />
                    <span>{new Date(post.dateCreated).toLocaleTimeString()}</span>
                  </div>
                </div>
                <h2 className="text-lg font-semibold mt-2 text-left">{post.title}</h2>
                <p className="text-sm text-gray-700 mt-2">{post.content}</p>
                <div className="mt-4 flex gap-2">
                  <Button className="bg-gray-200 text-gray-700">💬 Comments</Button>
                  <Button className="bg-transparent text-red-600">📌 Pin</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Post Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
            <button className="absolute top-2 right-2" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">Create a New Post</h2>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-2"
            />
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button className="bg-gray-300 text-gray-700" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-500 text-white" onClick={addPost}>
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;