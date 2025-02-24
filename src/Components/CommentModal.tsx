import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { User, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"

interface Comment {
  commentId: number;
  content: string;
  dateCreated: string;
  dateUpdated: string;
  userId: number;
  postId: number;
}

interface UserDetails {
  userId: number;
  fullName: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  postTitle: string;
  postContent?: string;
  postImage?: string;
}

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  postId,
  postTitle,
  postContent,
  postImage,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false); // Loading state for fetching comments
  const [submitLoading, setSubmitLoading] = useState(false); // Loading state for submitting comments
  const [userDetailsMap, setUserDetailsMap] = useState<Record<number, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchUserDetails = async (userId: number): Promise<string> => {
    try {
      const response = await fetch(
        `http://localhost:5062/api/user`
      );
      if (!response.ok) throw new Error("Failed to fetch user details");

      const userData = await response.json();
      const userArray = userData.data?.$values || [];
      const user = userArray.find((u: any) => u.userId === userId);

      return user ? user.fullName : "Unknown User";
    } catch (error) {
      console.error("Error fetching user details:", error);
      return "Unknown User";
    }
  };

  const fetchComments = async () => {
    setFetchLoading(true); 
    try {
      const response = await fetch(
        "http://localhost:5062/api/comment"
      );
      if (!response.ok) throw new Error("Failed to fetch comments");

      const data = await response.json();
      const allComments = data.$values || [];
      const filteredComments = allComments.filter((comment: Comment) => comment.postId === postId);

      const userDetailsPromises = filteredComments.map(async (comment: Comment) => {
        const fullName = await fetchUserDetails(comment.userId);
        return { userId: comment.userId, fullName };
      });

      const userDetails = await Promise.all(userDetailsPromises);
      const userDetailsMap = userDetails.reduce((acc, { userId, fullName }) => {
        acc[userId] = fullName;
        return acc;
      }, {} as Record<number, string>);

      setUserDetailsMap(userDetailsMap);
      setComments(filteredComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setFetchLoading(false); 
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to comment");
      return;
    }

    const currentDate = new Date().toISOString();

    try {
      setSubmitLoading(true); 
      const response = await fetch(
        "http://localhost:5062/api/comment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: newComment,
            postId: postId,
            userId: parseInt(userId),
            dateCreated: currentDate,
            dateUpdated: currentDate,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add comment");

      setNewComment("");
      await fetchComments(); 
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitLoading(false); 
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[720px] p-0 bg-white rounded-xl shadow-lg">
        <DialogHeader className="border-b border-gray-200 px-6 py-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Comments on "{postTitle}"
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[80vh] divide-x divide-gray-200">
          {/* Left Side: Post Content */}
          <div className="w-1/2 p-6 overflow-y-auto bg-gray-50">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                
                <h3 className="text-lg font-semibold text-gray-800 truncate">Post Body: </h3>
              </div>
              {postContent ? (
                <p className="text-gray-700 leading-relaxed text-l">{postContent}</p>
              ) : (
                <p className="text-gray-500 italic text-sm">No content available for this post.</p>
              )}
              {postImage && (
                <img
                  src={postImage || "/api/placeholder/400/300"}
                  alt={postTitle}
                  className="w-full h-auto rounded-lg shadow-sm object-cover max-h-64"
                />
              )}
            </div>
          </div>

          {/* Right Side: Comments */}
          <div className="w-1/2 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-white">
              {fetchLoading ? (
                <p className="text-center text-gray-500 py-4">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-center text-gray-500 italic py-4">No comments yet. Be the first!</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.commentId}
                    className="flex gap-3 transition-all duration-200 hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <div className="bg-gray-200 rounded-full p-2 h-9 w-9 flex items-center justify-center flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light" alt="User" />
                      <AvatarFallback className="text-gray-600 text-xs">U</AvatarFallback>
                    </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-xl p-3 shadow-sm">
                        <div className="text-gray-800 text-sm font-bold">
                          {userDetailsMap[comment.userId] || "Unknown User"}
                        </div>
                        <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                      </div>
                     
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-full p-2 h-9 w-9 flex items-center justify-center flex-shrink-0">
                <Avatar className="h-8 w-8">
                      <AvatarImage src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light" alt="User" />
                      <AvatarFallback className="text-gray-600 text-xs">U</AvatarFallback>
                    </Avatar>
                </div>
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 min-h-[44px] resize-none rounded-2xl px-4 py-2 border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all duration-150 text-gray-800 text-sm"
                  aria-label="Write a comment"
                  disabled={submitLoading}
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={submitLoading || !newComment.trim()}
                  size="icon"
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 transition-colors duration-200 h-9 w-9"
                  aria-label="Post comment"
                >
                  {submitLoading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;