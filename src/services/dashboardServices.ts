import { DashboardContext, Post } from "@/types/dashboard";

export const fetchPosts = async (ctx: DashboardContext): Promise<Post[]> => {
  const response = await fetch(
    `http://localhost:5062/api/post/withUsers?userExternalId=${ctx.userId}`
  );
  if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status}`);
  const data = await response.json();
  return (data.$values || []).map((post: any) => ({
    externalId: post.externalId,
    postId: post.postId,
    fullName: post.user?.fullName || "Unknown User",
    title: post.title,
    content: post.content,
    eventDate: post.eventDate ? new Date(post.eventDate).toISOString() : "",
    location: post.location || "No location",
    dateCreated: post.dateCreated ? new Date(post.dateCreated).toISOString() : new Date().toISOString(),
  })).sort((a: Post, b: Post) => 
    new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  );
};

export const fetchPinnedPosts = async (ctx: DashboardContext): Promise<string[]> => {
  const response = await fetch(
    `http://localhost:5062/api/pinnedpost?userId=${ctx.userId}`
  );
  if (!response.ok) throw new Error(`Failed to fetch pinned posts: ${response.status}`);
  const data = await response.json();
  return (data.$values || []).map((pinnedPost: any) => pinnedPost.externalId);
};

export const addPost = async (ctx: DashboardContext): Promise<Post> => {
  const postData = {
    title: ctx.title,
    content: ctx.content,
    userId: parseInt(ctx.userId, 10),
    ...(ctx.eventDate && { eventDate: ctx.eventDate }),
    ...(ctx.location && { location: ctx.location }),
  };
  const response = await fetch("http://localhost:5062/api/Post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  if (!response.ok) throw new Error(await response.text() || "Failed to add post");
  return response.json();
};

export const togglePin = async (
  ctx: DashboardContext,
  event: { type: string; postId: string }
): Promise<{ pinnedPosts: Set<string>; postId: string; isPinned: boolean }> => {
  if (event.type !== "TOGGLE_PIN") throw new Error("Invalid event type");
  const post = ctx.posts.find((p) => p.externalId === event.postId);
  if (!post) throw new Error("Post not found");
  
  const isPinned = ctx.pinnedPosts.has(event.postId);
  const response = await fetch("http://localhost:5062/api/pinnedpost", {
    method: isPinned ? "DELETE" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      externalId: post.externalId,
      postId: post.postId,
      userId: parseInt(ctx.userId, 10),
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    }),
  });
  if (!response.ok) throw new Error(await response.text() || "Failed to toggle pin");
  
  const newPinned = new Set(ctx.pinnedPosts);
  isPinned ? newPinned.delete(event.postId) : newPinned.add(event.postId);
  return { pinnedPosts: newPinned, postId: event.postId, isPinned: !isPinned };
};