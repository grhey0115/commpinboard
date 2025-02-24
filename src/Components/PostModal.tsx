"use client";

import React, { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { X, Calendar, MapPin } from 'lucide-react';

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
  addPost: () => Promise<void>;
  onSuccess?: () => void;
}

const PostModal = ({ 
  showModal, 
  setShowModal, 
  title, 
  setTitle, 
  content, 
  setContent,
  eventDate,
  setEventDate,
  location,
  setLocation,
  addPost,
  onSuccess 
}: PostModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await addPost();
      setShowSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        setShowSuccess(false);
        setShowModal(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-900 border-2 border-gray-800 dark:border-gray-800 p-8 rounded-2xl w-[500px] shadow-2xl relative">
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center h-40">
                <div className="text-green-500 mb-4">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">Posted Successfully!</p>
              </div>
            ) : (
              <>
                <button 
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                  onClick={() => setShowModal(false)}
                  type="button"
                >
                  <X size={24} />
                </button>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create a New Post</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Share something with your community</p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent h-12"
                  />

                  <Textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[120px]"
                  />

                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-3 text-gray-500" size={18} />
                      <Input
                        type="datetime-local"
                        value={eventDate || ""}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white pl-10 h-12 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-3 text-gray-500" size={18} />
                      <Input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white pl-10 h-12 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button 
                    onClick={() => setShowModal(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                    type="button"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Posting...
                      </div>
                    ) : 'Post'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostModal;