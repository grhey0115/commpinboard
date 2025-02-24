"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import PostModal from "@/Components/PostModal";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { Clock, User, Pin, Calendar, MapPin, MessageSquare } from "lucide-react";
import MainLayout from "@/Components/HomeLayout";
import Navigation from "@/Components/Navigation";
import { formatDistanceToNow } from "date-fns";
import "@/styles/scrollbar.css";

interface Post {
  externalId: string;
  fullName: string;
  title: string;
  content: string;
  eventDate: string;
  location: string;
  dateCreated: string;
  isPinned?: boolean;
}

interface PostModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  eventDate: string | null;
  setEventDate: (date: string | null) => void;
  location: string;
  setLocation: (location: string) => void;
  addPost: () => Promise<void>; // Ensure this is a Promise
}

interface PinnedPost {
  id: number;
  postId: number;
  userId: number;
  externalId: string;
  dateCreated: string;
}

const Pinned: React.FC = () => {
  useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const router = useRouter();
  const [pinnedPosts, setPinnedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPinnedPosts = async () => {
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
          "https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/pinnedpost"
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch pinned posts: ${response.status}`);
        }

        const data = await response.json();
        const pinnedPostsArray = data?.$values || [];

        if (!Array.isArray(pinnedPostsArray)) {
          throw new Error("Invalid API response format");
        }

        const userPinnedPosts = pinnedPostsArray.filter(
          (pinnedPost: PinnedPost) => pinnedPost.userId === userId
        );
        const pinnedPostIds = userPinnedPosts.map(
          (pinnedPost: PinnedPost) => pinnedPost.externalId
        );

        setPinnedPosts(new Set(pinnedPostIds));

        const postsResponse = await fetch(
          "https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/Post/withusers"
        );
        if (!postsResponse.ok) {
          throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
        }

        const postsData = await postsResponse.json();
        const postsArray = postsData?.$values || [];

        if (!Array.isArray(postsArray)) {
          throw new Error("Invalid API response format");
        }

        const formattedPosts = postsArray.map((post: any) => ({
          externalId: post.externalId,
          fullName: post.user?.fullName || "Unknown User",
          title: post.title,
          content: post.content,
          eventDate: post.eventDate ? new Date(post.eventDate).toISOString() : "",
          location: post.location || "No location",
          dateCreated: post.dateCreated ? new Date(post.dateCreated).toISOString() : new Date().toISOString(),
        }));

        const userPosts = formattedPosts.filter((post: Post) =>
          pinnedPostIds.includes(post.externalId)
        );
        setPosts(userPosts);
      } catch (err: any) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPinnedPosts();
  }, []);

  const addPost = async (): Promise<void> => {
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
  };

  const unpinPost = async (externalId: string) => {
    try {
  
      // Use query parameter format as in Swagger
      const apiUrl = `https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/pinnedpost?externalId=${externalId}`;
      console.log("API URL:", apiUrl);
  
      const response = await fetch(apiUrl, {
        method: "DELETE",
      });
  
      // Log the response status and details
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error(`Failed to unpin post: ${response.status}`);
      }
  
      // Log success message
      console.log("Post unpinned successfully:", externalId);
  
      // Remove the post from the pinnedPosts set
      setPinnedPosts((prevPinnedPosts) => {
        const newPinnedPosts = new Set(prevPinnedPosts);
        newPinnedPosts.delete(externalId);
        return newPinnedPosts;
      });
  
      // Remove the post from the posts list
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.externalId !== externalId)
      );
    } catch (err: any) {
      console.error("Unpin error:", err.message);
      alert(`Error unpinning post: ${err.message}`);
    }
  };

  return (
    <MainLayout>
      <Navigation
        onShowModal={() => setShowModal(true)}
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
      />

      <div className="w-full max-w-2xl h-[600px] overflow-y-auto p-4 bg-transparent z-10 scrollbar-hide">
        {loading ? (
          <p className="text-center text-white">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-white">No pinned posts available</p>
        ) : (
          posts.map((post) => (
            <Card key={post.externalId} className="mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User className="text-black-400" size={16} />
                    <span className="font-bold text-black">
                      {post.fullName || "Unknown User"}
                    </span>
                  </div>
                  {post.dateCreated && !isNaN(new Date(post.dateCreated).getTime()) && (
                    <div className="flex items-center gap-1 text-gray-800">
                      <Clock size={16} />
                      <span>
                        {formatDistanceToNow(new Date(post.dateCreated), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-semibold mt-2 text-gray-800">
                  {post.title}
                </h2>
                <p className="text-gray-800 mt-2">{post.content}</p>
                <div className="flex items-center gap-2 mt-2 text-gray-800">
                  {post.eventDate && !isNaN(new Date(post.eventDate).getTime()) && (
                    <>
                      <Calendar size={16} />
                      <span>
                        {new Date(post.eventDate).toLocaleDateString()}
                      </span>
                    </>
                  )}
                  <MapPin size={16} className="ml-4" />
                  <span>{post.location}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button className="bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                    <MessageSquare size={16} className="mr-2" /> Comments
                  </Button>
                  <Button
                    onClick={() => unpinPost(post.externalId)}
                    className={`${
                      pinnedPosts.has(post.externalId)
                        ? "bg-blue-600"
                        : "bg-gray-700"
                    } text-white hover:bg-gray-600 transition-colors`}
                  >
                    <Pin size={16} className="mr-2" />
                    {pinnedPosts.has(post.externalId) ? "Pinned" : "Pin"}
                  </Button>
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
      />
    </MainLayout>
  );
};

export default Pinned;