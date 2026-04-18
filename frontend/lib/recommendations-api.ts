/**
 * Recommendations API - Frontend integration layer
 * Connects to backend /recommendations endpoints
 */

import { API_URL } from './api';
import { RecommendedJob, RecommendedPost } from './recommendations-mock-data';

interface RecommendationsResponse<T> {
    success: boolean;
    data: T[];
    total: number;
}

/**
 * Fetch recommended jobs from backend API
 */
export async function fetchRecommendedJobs(
    portfolioId?: string,
    token?: string
): Promise<RecommendedJob[]> {
    try {
        const url = portfolioId
            ? `${API_URL}/recommendations/jobs?portfolioId=${portfolioId}`
            : `${API_URL}/recommendations/jobs`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
            console.error('Failed to fetch recommended jobs:', response.status);
            return [];
        }

        const result: RecommendationsResponse<RecommendedJob> = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error('Error fetching recommended jobs:', error);
        return [];
    }
}

/**
 * Fetch recommended posts from backend API  
 */
export async function fetchRecommendedPosts(
    portfolioId?: string,
    token?: string
): Promise<RecommendedPost[]> {
    try {
        const url = portfolioId
            ? `${API_URL}/recommendations/posts?portfolioId=${portfolioId}`
            : `${API_URL}/recommendations/posts`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
            console.error('Failed to fetch recommended posts:', response.status);
            return [];
        }

        const result: RecommendationsResponse<RecommendedPost> = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error('Error fetching recommended posts:', error);
        return [];
    }
}
