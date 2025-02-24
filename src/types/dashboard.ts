export interface Post {
    externalId: string;
    fullName: string;
    postId: number;
    title: string;
    content: string;
    eventDate?: string;
    location: string;
    dateCreated: string;
  }
  
  export interface DashboardContext {
    posts: Post[];
    loading: boolean;
    error: string | null;
    showModal: boolean;
    title: string;
    content: string;
    eventDate: string | null;
    location: string;
    pinnedPosts: Set<string>;
    selectedPost: Post | null;
    searchTerm: string;
    fullName: string;
    userId: string;
  }
  
  export type DashboardEvent =
    | { type: "FETCH_POSTS" }
    | { type: "FETCH_PINNED" }
    | { type: "OPEN_MODAL" }
    | { type: "CLOSE_MODAL" }
    | { type: "SET_TITLE"; value: string }
    | { type: "SET_CONTENT"; value: string }
    | { type: "SET_EVENT_DATE"; value: string | null }
    | { type: "SET_LOCATION"; value: string }
    | { type: "SET_SEARCH_TERM"; value: string }
    | { type: "SET_FULL_NAME"; value: string }
    | { type: "SET_USER_ID"; value: string }
    | { type: "ADD_POST" }
    | { type: "TOGGLE_PIN"; postId: string }
    | { type: "SELECT_POST"; post: Post }
    | { type: "CLEAR_SELECTED_POST" };