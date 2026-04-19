/**
 * Share Service
 * 
 * Dịch vụ quản lý share functionality
 * Gồm local storage, API calls, và tracking
 */

import { Post } from '@/lib/community-mock-data';

/**
 * Interface cho Share Record
 */
export interface ShareRecord {
  id: string;
  postId: string;
  platform: 'facebook' | 'messenger' | 'email' | 'copy' | 'direct';
  timestamp: string;
  userId?: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Interface cho Share Stats
 */
export interface ShareStats {
  total: number;
  byPlatform: {
    facebook: number;
    messenger: number;
    email: number;
    copy: number;
    direct: number;
  };
  recentShares: ShareRecord[];
}

/**
 * Local Storage Service
 */
class ShareStorageService {
  private readonly PREFIX = 'nextstepz_share_';

  /**
   * Lưu share record vào localStorage
   */
  saveShareRecord(record: ShareRecord): void {
    try {
      const key = `${this.PREFIX}${record.id}`;
      localStorage.setItem(key, JSON.stringify(record));
    } catch (error) {
      console.error('Failed to save share record:', error);
    }
  }

  /**
   * Lấy share records của một bài post
   */
  getShareRecords(postId: string): ShareRecord[] {
    try {
      const records: ShareRecord[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.PREFIX)) {
          const item = localStorage.getItem(key);
          if (item) {
            const record = JSON.parse(item) as ShareRecord;
            if (record.postId === postId) {
              records.push(record);
            }
          }
        }
      }
      return records.sort(
        (a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Failed to get share records:', error);
      return [];
    }
  }

  /**
   * Xóa share records
   */
  clearShareRecords(postId?: string): void {
    try {
      if (postId) {
        const records = this.getShareRecords(postId);
        records.forEach((record) => {
          localStorage.removeItem(`${this.PREFIX}${record.id}`);
        });
      } else {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key?.startsWith(this.PREFIX)) {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Failed to clear share records:', error);
    }
  }
}

/**
 * Share API Service
 */
class ShareAPIService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';

  /**
   * Ghi lại share event lên server
   */
  async logShareEvent(
    postId: string,
    platform: ShareRecord['platform'],
    metadata?: Record<string, string | number | boolean>
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}/shares`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          timestamp: new Date().toISOString(),
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to log share event: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to log share event:', error);
    }
  }

  /**
   * Lấy share stats của một bài post
   */
  async getShareStats(postId: string): Promise<ShareStats | null> {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}/share-stats`);

      if (!response.ok) {
        throw new Error(`Failed to fetch share stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch share stats:', error);
      return null;
    }
  }

  /**
   * Lấy trending posts (dựa trên share count)
   */
  async getTrendingPosts(): Promise<Post[]> {
    try {
      const response = await fetch(`${this.baseURL}/posts/trending`);

      if (!response.ok) {
        throw new Error(`Failed to fetch trending posts: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch trending posts:', error);
      return [];
    }
  }
}

/**
 * Share Tracking Service
 */
class ShareTrackingService {
  /**
   * Track share event
   */
  trackShare(postId: string, platform: string): void {
    // Google Analytics
    if (typeof window !== 'undefined') {
      const windowWithGtag = window as unknown as { gtag?: (event: string, name: string, params: Record<string, string>) => void };
      if (windowWithGtag.gtag) {
        windowWithGtag.gtag('event', 'share', {
          method: platform,
          post_id: postId,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Custom event
    window.dispatchEvent(
      new CustomEvent('post_shared', {
        detail: { postId, platform, timestamp: new Date() },
      })
    );
  }

  /**
   * Track share to specific platform
   */
  trackPlatformShare(
    postId: string,
    platform: 'facebook' | 'messenger' | 'email' | 'twitter' | 'linkedin'
  ): void {
    if (typeof window !== 'undefined') {
      const windowWithGtag = window as unknown as { gtag?: (event: string, name: string, params: Record<string, string>) => void };
      if (windowWithGtag.gtag) {
        windowWithGtag.gtag('event', `share_${platform}`, {
          post_id: postId,
        });
      }
    }
  }
}

/**
 * Main Share Service
 */
export class ShareService {
  private storage = new ShareStorageService();
  private api = new ShareAPIService();
  private tracking = new ShareTrackingService();

  /**
   * Xử lý chia sẻ bài post
   */
  async handleShare(
    postId: string,
    platform: ShareRecord['platform'],
    metadata?: Record<string, string | number | boolean>
  ): Promise<void> {
    // Create share record
    const record: ShareRecord = {
      id: `${postId}-${platform}-${Date.now()}`,
      postId,
      platform,
      timestamp: new Date().toISOString(),
      metadata,
    };

    // Save locally
    this.storage.saveShareRecord(record);

    // Log to server
    await this.api.logShareEvent(postId, platform, metadata);

    // Track event
    this.tracking.trackShare(postId, platform);
  }

  /**
   * Lấy share stats
   */
  async getShareStats(postId: string): Promise<ShareStats | null> {
    return this.api.getShareStats(postId);
  }

  /**
   * Lấy local share records
   */
  getLocalShareRecords(postId: string): ShareRecord[] {
    return this.storage.getShareRecords(postId);
  }

  /**
   * Lấy tất cả trending posts
   */
  async getTrendingPosts(): Promise<Post[]> {
    return this.api.getTrendingPosts();
  }

  /**
   * Clear cache
   */
  clearCache(postId?: string): void {
    this.storage.clearShareRecords(postId);
  }
}

// Export singleton instance
export const shareService = new ShareService();

/**
 * Usage Examples:
 * 
 * // Log share event
 * await shareService.handleShare(postId, 'facebook');
 * 
 * // Get share stats
 * const stats = await shareService.getShareStats(postId);
 * 
 * // Get local records
 * const records = shareService.getLocalShareRecords(postId);
 * 
 * // Get trending posts
 * const trending = await shareService.getTrendingPosts();
 * 
 * // Clear cache
 * shareService.clearCache(postId);
 */
