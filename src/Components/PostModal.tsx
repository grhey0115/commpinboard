"use client";

import React from 'react';
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
  addPost 
}: PostModalProps) => {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-red bg-opacity-80 backdrop-blur-sm z-50">
          <div className="bg-black border border-gray-800 p-8 rounded-2xl w-[500px] shadow-2xl relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowModal(false)}
              type="button"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Create a New Post</h2>
              <p className="text-gray-400 mt-1">Share something with your community</p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                className="bg-gray-900 border-gray-800 text-white placeholder-gray-500 focus:border-gray-700 h-12"
              />

              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                className="bg-gray-900 border-gray-800 text-white placeholder-gray-500 focus:border-gray-700 min-h-[120px]"
              />

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-3 text-gray-500" size={18} />
                  <Input
                    type="datetime-local"
                    value={eventDate || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventDate(e.target.value)}
                    className="bg-gray-900 border-gray-800 text-white pl-10 h-12 focus:border-gray-700"
                  />
                </div>

                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 text-gray-500" size={18} />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                    className="bg-gray-900 border-gray-800 text-white pl-10 h-12 focus:border-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button 
                onClick={() => setShowModal(false)}
                className="bg-gray-800 text-white hover:bg-gray-700"
                type="button"
              >
                Cancel
              </Button>
              <Button 
                onClick={addPost}
                className="bg-red-500 text-white hover:bg-red-600"
                type="button"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostModal;