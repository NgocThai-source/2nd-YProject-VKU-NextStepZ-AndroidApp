import { API_URL } from '../api';

export interface FollowResponse {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: string;
}

export interface FollowStatusResponse {
    isFollowing: boolean;
}

export interface FollowerCountResponse {
    count: number;
}

/**
 * Follow a user
 * @param userId - The user ID to follow
 * @param token - JWT auth token
 */
export async function followUser(userId: string, token: string): Promise<FollowResponse> {
    const response = await fetch(`${API_URL}/follow/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Lỗi khi theo dõi người dùng' }));
        throw new Error(error.message || 'Lỗi khi theo dõi người dùng');
    }

    return response.json();
}

/**
 * Unfollow a user
 * @param userId - The user ID to unfollow
 * @param token - JWT auth token
 */
export async function unfollowUser(userId: string, token: string): Promise<FollowResponse> {
    const response = await fetch(`${API_URL}/follow/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Lỗi khi hủy theo dõi người dùng' }));
        throw new Error(error.message || 'Lỗi khi hủy theo dõi người dùng');
    }

    return response.json();
}

/**
 * Check if current user is following a target user
 * @param userId - The target user ID to check
 * @param token - JWT auth token
 */
export async function checkFollowStatus(userId: string, token: string): Promise<FollowStatusResponse> {
    const response = await fetch(`${API_URL}/follow/${userId}/status`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        // If not authenticated or error, assume not following
        return { isFollowing: false };
    }

    return response.json();
}

/**
 * Get follower count for a user (public endpoint)
 * @param userId - The user ID to get follower count for
 */
export async function getFollowerCount(userId: string): Promise<FollowerCountResponse> {
    const response = await fetch(`${API_URL}/follow/${userId}/count`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        return { count: 0 };
    }

    return response.json();
}

export interface FollowedUser {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role: string;
    followedAt: string;
}

/**
 * Get list of users that current user is following
 * @param token - JWT auth token
 */
export async function getFollowingUsers(token: string): Promise<FollowedUser[]> {
    const response = await fetch(`${API_URL}/follow/following/list`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        return [];
    }

    return response.json();
}
