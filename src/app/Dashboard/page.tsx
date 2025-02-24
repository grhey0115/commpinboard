"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import PostModal from "@/Components/PostModal";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { Clock, User, Settings, Home, CirclePlus, Pin, Search, Calendar, MapPin, MessageSquare, Heart } from "lucide-react";
import MainLayout from "@/Components/HomeLayout";
import { Input } from "@/Components/ui/input";
import Navigation from "@/Components/Navigation";
import { formatDistanceToNow } from "date-fns";
import "@/styles/scrollbar.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import CommentModal from "@/Components/CommentModal";

interface Post {
  externalId: string;
  fullName: string;
  postId: number;
  title: string;
  content: string;
  eventDate: string;
  location: string;
  dateCreated: string;
  isPinned?: boolean;
}

const Dashboard: React.FC = () => {
  useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all');
  const settingsRef = useRef<HTMLDivElement>(null);
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [pinnedPosts, setPinnedPosts] = useState<Set<string>>(new Set());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("fullName") || "Guest";
    setFullName(storedName);
    const storedUserId = localStorage.getItem("userId") || "1";
    setUserId(storedUserId);
  
    // Fetch all posts
    const fetchPosts = async () => {
      try {
        const response = await fetch(`https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/post/withUsers?userExternalId=${storedUserId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("API Response:", data);
    
        const postsArray = data?.$values || [];
    
        if (!Array.isArray(postsArray)) {
          throw new Error("Invalid API response format");
        }
    
        const formattedPosts = postsArray.map((post) => ({
          externalId: post.externalId,
          postId: post.postId,
          fullName: post.user?.fullName || "Unknown User",
          title: post.title,
          content: post.content,
          eventDate: post.eventDate ? new Date(post.eventDate).toISOString() : "",
          location: post.location || "No location",
          dateCreated: post.dateCreated ? new Date(post.dateCreated).toISOString() : new Date().toISOString(),
        }));
    
        const sortedPosts = formattedPosts.sort((a, b) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        );
    
        setPosts(sortedPosts);
      } catch (err: any) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
  
    fetchPosts();
  
    fetchPinnedPosts();
  }, []);
  


  const fetchPinnedPosts = async () => {
    try {
      const userIdString = localStorage.getItem("userId");
      if (!userIdString) {
        console.log("User not found. Please log in.");
        return;
      }
  
      const userId = Number(userIdString);
      if (isNaN(userId)) {
        console.log("Invalid User ID. Please log in again.");
        return;
      }
  
      const response = await fetch(
        `https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/pinnedpost?userId=${userId}`
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch pinned posts: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched pinned posts:", data);
  
      const pinnedPostIds = data?.$values?.map((pinnedPost: any) => pinnedPost.externalId) || [];
      setPinnedPosts(new Set(pinnedPostIds));
    } catch (error) {
      console.error("Error fetching pinned posts:", error);
    }
  };
  

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.fullName.toLowerCase().includes(searchLower)
        
      );
    });
  }, [posts, searchTerm]);

  const addPost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and Content are required!");
      return;
    }
  
    const userIdString = localStorage.getItem("userId");
  
    if (!userIdString) {
      alert("User not found. Please log in.");
      return;
    }
  
    const userId = parseInt(userIdString, 10);
  
    if (isNaN(userId)) {
      alert("Invalid User ID. Please log in again.");
      return;
    }
  
    // Constructing the post data
    const postData: any = {
      title,
      content,
      userId,
    };
  
    // Include optional fields only if they exist
    if (eventDate) {
      postData.eventDate = eventDate;
    }
  
    if (location.trim()) {
      postData.location = location;
    }
  
    try {
      const response = await fetch(
        "https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/Post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add post");
      }
  
      const newPost = await response.json();
  
      // Add the new post to the UI
      setPosts((prevPosts) => [newPost, ...prevPosts]);
  
      // Reset form fields
      setShowModal(false);
      setTitle("");
      setContent("");
      setEventDate(null);
      setLocation("");
    } catch (err: any) {
      alert(`Error adding post: ${err.message}`);
    }

    console.log("Sending data:", JSON.stringify(postData, null, 2));
  };
  
  
  
  



  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const handlePinPost = async (postId: string) => {
    try {
      console.log("Starting handlePinPost for postId:", postId);
  
      const userIdString = localStorage.getItem("userId");
      console.log("Retrieved userId from localStorage:", userIdString);
  
      if (!userIdString) {
        alert("User not found. Please log in.");
        return;
      }
  
      const userId = Number(userIdString);
      console.log("Parsed userId:", userId);
  
      if (isNaN(userId)) {
        alert("Invalid User ID. Please log in again.");
        return;
      }
  
      const isPinned = pinnedPosts.has(postId);
      console.log("Is post already pinned?", isPinned);
  
      const method = isPinned ? "DELETE" : "POST";
      console.log("Using HTTP method:", method);
  
      // Find the post being pinned/unpinned
      const postToPin = posts.find((post) => post.externalId === postId);
      console.log("Found post to pin/unpin:", postToPin);
  
      if (!postToPin) {
        alert("Post not found.");
        return;
      }
  
      // Use the post's externalId and postId
      const externalId = postToPin.externalId;
      const numericPostId = postToPin.postId; // Use the postId from the post object
      console.log("Using post's externalId:", externalId);
      console.log("Using post's postId:", numericPostId);
  
      // Construct the request body as expected by the API
      const requestBody = {
        externalId: externalId, // Use the post's externalId
        postId: numericPostId, // Use the post's postId
        userId: userId, // Use the logged-in user's ID
        dateCreated: new Date().toISOString(), 
        dateUpdated: new Date().toISOString(), 
      };
  
      console.log("Constructed request body:", requestBody);
  
      const response = await fetch(
        "https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/pinnedpost",
        {
          method,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      console.log("Response status:", response.status);
  
      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server returned an error:", errorText);
        throw new Error(errorText || `Failed to ${isPinned ? "unpin" : "pin"} post`);
      }
  
      // Update the pinnedPosts state
      setPinnedPosts((prev) => {
        const newPinned = new Set(prev);
        isPinned ? newPinned.delete(postId) : newPinned.add(postId);
        console.log("Updated pinnedPosts state:", newPinned);
        return newPinned;
      });
  
      // Update the posts state to reflect the pinned status
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.externalId === postId ? { ...post, isPinned: !isPinned } : post
        )
      );
  
      console.log("Successfully updated pinned status for post:", postId);
  
    } catch (error) {
      console.error("Error toggling pin status:", error);
      alert("Failed to update pin status. Please try again.");
    }
  };
  
  
  
  
  const refreshPosts = async () => {
    try {
      const storedUserId = localStorage.getItem("userId") || "1";
      const response = await fetch(`https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/post/withUsers?userExternalId=${storedUserId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }
  
      const data = await response.json();
      const postsArray = data?.$values || [];
  
      const formattedPosts: Post[] = postsArray.map((post: any) => ({
        externalId: post.externalId,
        postId: post.postId,
        fullName: post.user?.fullName || "Unknown User",
        title: post.title,
        content: post.content,
        eventDate: post.eventDate ? new Date(post.eventDate).toISOString() : "",
        location: post.location || "No location",
        dateCreated: post.dateCreated ? new Date(post.dateCreated).toISOString() : new Date().toISOString(),
      }));
  
      const sortedPosts = formattedPosts.sort((a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      );
  
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error refreshing posts:", error);
    }
  };

  return (
    <MainLayout>
       <Navigation
      onShowModal={() => setShowModal(true)}
      searchTerm={searchTerm}
      onSearchChange={(value) => setSearchTerm(value)}
    />  

      <div className="w-full max-w-3xl h-[100vh] overflow-y-auto p-0 pt-[8rem] bg-transparent z-10 scrollbar-hide">
        {loading ? (
          <p className="text-center text-white">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-white">
            {searchTerm ? "No posts found matching your search" : "No posts available"}
          </p>
        ) : (
          filteredPosts.map((post) => (
            <Card key={`${post.externalId}-${post.postId}`} className="mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Header with user info and timestamp */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light" alt="User" />
                  <AvatarFallback className="text-gray-600 text-xs">U</AvatarFallback>
                </Avatar>

                  <span className="font-semibold text-gray-900">{post.fullName || "Unknown User"}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {post.dateCreated && !isNaN(new Date(post.dateCreated).getTime()) &&
                    formatDistanceToNow(new Date(post.dateCreated), { addSuffix: true })}
                </span>
              </div>

              {/* Post title and content */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 text-left">{post.title}</h2>
              <p className="text-gray-700 mb-4 text-left">{post.content}</p>

              {/* Event details */}
              <div className="space-y-2 mb-4">
                {post.eventDate && !isNaN(new Date(post.eventDate).getTime()) && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span>{new Date(post.eventDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  <span>{post.location}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  <MessageSquare size={18} className="text-gray-600" />
                  <span className="text-gray-700">Comments</span>
                </button>
                <button
                  onClick={() => handlePinPost(post.externalId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    pinnedPosts.has(post.externalId)
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  <Pin size={18} />
                  <span>{pinnedPosts.has(post.externalId) ? 'Pinned' : 'Pin'}</span>
                </button>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      

      <PostModal
        showModal={showModal}
        setShowModal={setShowModal}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        eventDate={eventDate}
        setEventDate={setEventDate}
        location={location}
        setLocation={setLocation}
        addPost={addPost}
        onSuccess={refreshPosts}
      />

      {selectedPost && (
        <CommentModal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          postId={selectedPost.postId}
          postTitle={selectedPost.title}
          postContent={selectedPost.content}
        />
      )}
    </MainLayout>
  );
};

export default Dashboard;