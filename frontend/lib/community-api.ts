// Community API Service
// All API endpoints for community features

const API_URL = "http://localhost:3001/api";

// Helper to get auth token
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
}

// Helper for authenticated requests
async function fetchWithAuth(endpoint: string, options?: RequestInit) {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options?.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'API Error' }));
        throw new Error(error.message || `API Error: ${res.status}`);
    }

    return res.json();
}

// ==================== POSTS ====================

export interface CreatePostData {
    content: string;
    category?: string;
    topics?: string[];
    hashtags?: string[];
    images?: string[];
}

export interface Post {
    id: string;
    content: string;
    category: string;
    topics: string[];
    hashtags: string[];
    images: string[];
    shareCount: number;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        username: string;
        firstName: string | null;
        lastName: string | null;
        avatar: string | null;
        role: string;
        companyName: string | null;
    };
}

export interface PostsResponse {
    posts: Post[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export async function getPosts(page = 1, limit = 10): Promise<PostsResponse> {
    return fetchWithAuth(`/community/posts?page=${page}&limit=${limit}`);
}

export async function getMyPosts(page = 1, limit = 10): Promise<PostsResponse> {
    return fetchWithAuth(`/community/posts/my?page=${page}&limit=${limit}`);
}

export async function getPost(postId: string): Promise<Post> {
    return fetchWithAuth(`/community/posts/${postId}`);
}

export async function createPost(data: CreatePostData): Promise<Post> {
    return fetchWithAuth('/community/posts', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updatePost(postId: string, data: Partial<CreatePostData>): Promise<Post> {
    return fetchWithAuth(`/community/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deletePost(postId: string): Promise<{ message: string }> {
    return fetchWithAuth(`/community/posts/${postId}`, {
        method: 'DELETE',
    });
}

// ==================== LIKES ====================

export async function toggleLike(postId: string): Promise<{ isLiked: boolean; message: string }> {
    return fetchWithAuth(`/community/posts/${postId}/like`, {
        method: 'POST',
    });
}

export async function checkLikeStatus(postId: string): Promise<{ isLiked: boolean }> {
    return fetchWithAuth(`/community/posts/${postId}/like`);
}

// ==================== COMMENTS ====================

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        id: string;
        name: string;
        avatar: string | null;
        role: string;
    };
    likesCount: number;
    repliesCount: number;
    isLiked: boolean;
    replies: Comment[];
}

export async function getComments(postId: string): Promise<Comment[]> {
    return fetchWithAuth(`/community/posts/${postId}/comments`);
}

export async function addComment(postId: string, content: string, parentId?: string): Promise<Comment> {
    return fetchWithAuth(`/community/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content, parentId }),
    });
}

export async function toggleCommentLike(commentId: string): Promise<{ isLiked: boolean; message: string }> {
    return fetchWithAuth(`/community/comments/${commentId}/like`, {
        method: 'POST',
    });
}

export async function deleteComment(commentId: string): Promise<{ message: string }> {
    return fetchWithAuth(`/community/comments/${commentId}`, {
        method: 'DELETE',
    });
}

// ==================== SHARE ====================

export async function incrementShareCount(postId: string): Promise<{ shareCount: number }> {
    return fetch(`${API_URL}/community/posts/${postId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
}

export async function getSharedPost(postId: string): Promise<Post | null> {
    const token = getAuthToken();
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/community/shared/${postId}`, {
        headers,
    });

    if (!res.ok) {
        // Return null instead of throwing - let page handle gracefully
        return null;
    }

    return res.json();
}

// ==================== SUGGESTIONS & LEADERBOARD ====================

export interface UserSuggestion {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    title?: string;
    followers: number;
    following: number;
}

export async function getUserSuggestions(): Promise<UserSuggestion[]> {
    return fetchWithAuth('/community/suggestions');
}

export interface LeaderboardEntry {
    rank: number;
    user: {
        id: string;
        name: string;
        avatar: string | null;
        role: string;
        title?: string;
        verified: boolean;
        followers: number;
    };
    score: number;
    posts: number;
    likes: number;
    followers: number;
    streak: number;
}

export async function getLeaderboard(limit = 30): Promise<LeaderboardEntry[]> {
    return fetch(`${API_URL}/community/leaderboard?limit=${limit}`, {
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
}

// ==================== USER PROFILE MODAL ====================

export interface UserProfileModalData {
    user: {
        id: string;
        name: string;
        avatar: string | null;
        role: string;
        title?: string;
        verified: boolean;
        isBanned?: boolean;
    };
    stats: {
        followers: number;
        following: number; // This is posts count as per requirement
        postsCount: number;
        commentsCount: number;
        likesReceived: number;
        score: number;
    };
    shareToken: string | null;
    isFollowing: boolean;
    isSelf: boolean;
}

export async function getUserProfileModal(userId: string): Promise<UserProfileModalData> {
    return fetchWithAuth(`/community/users/${userId}/profile-modal`);
}

// ==================== QUESTIONS ====================

export interface QuestionUser {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    role: string;
    companyName: string | null;
}

export interface QuestionData {
    id: string;
    title: string | null;
    content: string;
    tags: string[];
    viewCount: number;
    isAnswered: boolean;
    acceptedCommentId?: string | null;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    createdAt: string;
    user: QuestionUser;
}

export interface TopExpert {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    title?: string;
    questionCount: number;
}

export async function createQuestion(dto: { title: string; content: string; tags: string[] }): Promise<QuestionData> {
    return fetchWithAuth('/community/questions', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
}

export async function getQuestions(page: number = 1, limit: number = 20): Promise<QuestionData[]> {
    const token = getAuthToken();
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_URL}/community/questions?page=${page}&limit=${limit}`, {
        headers,
    }).then(res => res.json());
}

export async function getQuestion(questionId: string): Promise<QuestionData> {
    const token = getAuthToken();
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_URL}/community/questions/${questionId}`, {
        headers,
    }).then(res => res.json());
}

export async function toggleQuestionLike(questionId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    return fetchWithAuth(`/community/questions/${questionId}/like`, {
        method: 'POST',
    });
}

export async function recordQuestionView(questionId: string): Promise<{ viewCount: number }> {
    return fetchWithAuth(`/community/questions/${questionId}/view`, {
        method: 'POST',
    });
}

export async function getFeaturedQuestions(limit: number = 3): Promise<QuestionData[]> {
    return fetch(`${API_URL}/community/questions/featured?limit=${limit}`, {
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
}

export async function getTopExperts(limit: number = 3): Promise<TopExpert[]> {
    return fetch(`${API_URL}/community/questions/top-experts?limit=${limit}`, {
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
}

export interface QAStats {
    totalQuestions: number;
    unansweredCount: number;
    resolvedRate: number;
    answersThisWeek: number;
}

export async function getQAStats(): Promise<QAStats> {
    return fetch(`${API_URL}/community/questions/stats`, {
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
}

// ==================== AUTH CHECK ====================

export function isAuthenticated(): boolean {
    return !!getAuthToken();
}
