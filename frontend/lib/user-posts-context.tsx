'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface UserPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  postDate: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface UserPostsContextType {
  userPosts: UserPost[];
  totalPosts: number;
  isLoading: boolean;
  fetchUserPosts: (userId?: string, userName?: string) => Promise<void>;
}

const UserPostsContext = createContext<UserPostsContextType | undefined>(undefined);

// Default mock posts
const DEFAULT_POSTS: UserPost[] = [
  {
    id: '1',
    title: 'Kinh nghiệm phỏng vấn tại các công ty tech lớn',
    excerpt: 'Tôi vừa hoàn thành các vòng phỏng vấn tại Google, Meta và Amazon. Muốn chia sẻ...',
    category: 'Chia sẻ kinh nghiệm',
    postDate: '5 ngày trước',
    engagement: {
      likes: 89,
      comments: 34,
      shares: 12,
    },
  },
  {
    id: '2',
    title: 'Mẹo học React hooks hiệu quả',
    excerpt: 'Sau 2 năm làm việc với React, tôi tìm ra cách học hooks một cách...',
    category: 'Chia sẻ kinh nghiệm',
    postDate: '2 tuần trước',
    engagement: {
      likes: 156,
      comments: 42,
      shares: 23,
    },
  },
  {
    id: '3',
    title: 'Nên chọn startup hay công ty lớn?',
    excerpt: 'Tôi đang bối rối giữa việc nhận offer từ startup và công ty Fortune 500...',
    category: 'Thảo luận',
    postDate: '3 tuần trước',
    engagement: {
      likes: 234,
      comments: 67,
      shares: 18,
    },
  },
];

export function UserPostsProvider({ children }: { children: React.ReactNode }) {
  const [userPosts, setUserPosts] = useState<UserPost[]>(DEFAULT_POSTS);
  const [totalPosts, setTotalPosts] = useState(DEFAULT_POSTS.length);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserPosts = useCallback(async (userId?: string, userName?: string) => {
    setIsLoading(true);
    try {
      // In production, replace with actual API call
      // const response = await fetch(`/api/users/${userId}/posts`);
      // const data = await response.json();
      // setUserPosts(data.posts);
      // setTotalPosts(data.total);

      // For now, using mock data
      setUserPosts(DEFAULT_POSTS);
      setTotalPosts(DEFAULT_POSTS.length);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
      setTotalPosts(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserPostsContext.Provider
      value={{
        userPosts,
        totalPosts,
        isLoading,
        fetchUserPosts,
      }}
    >
      {children}
    </UserPostsContext.Provider>
  );
}

export function useUserPosts() {
  const context = useContext(UserPostsContext);
  if (context === undefined) {
    throw new Error('useUserPosts must be used within a UserPostsProvider');
  }
  return context;
}
