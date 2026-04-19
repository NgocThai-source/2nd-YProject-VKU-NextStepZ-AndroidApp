/**
 * Portfolio Share Service
 * 
 * Dịch vụ quản lý share functionality cho Portfolio
 * Gồm local storage, API calls, và tracking
 */

import { SavedPortfolio } from '@/lib/saved-portfolio-context';

/**
 * Interface cho Portfolio Share Record
 */
export interface PortfolioShareRecord {
  id: string;
  portfolioId: string;
  platform: 'facebook' | 'messenger' | 'email' | 'copy' | 'direct';
  timestamp: string;
  userId?: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Interface cho Portfolio Share Stats
 */
export interface PortfolioShareStats {
  total: number;
  byPlatform: {
    facebook: number;
    messenger: number;
    email: number;
    copy: number;
    direct: number;
  };
  recentShares: PortfolioShareRecord[];
}

/**
 * Local Storage Service for Portfolio Sharing
 */
class PortfolioShareStorageService {
  private readonly PREFIX = 'nextstepz_portfolio_share_';
  private readonly SHARED_PORTFOLIOS_KEY = 'nextstepz_shared_portfolios';

  /**
   * Lưu share record vào localStorage
   */
  saveShareRecord(record: PortfolioShareRecord): void {
    try {
      const key = `${this.PREFIX}${record.id}`;
      localStorage.setItem(key, JSON.stringify(record));
    } catch (error) {
      console.error('Failed to save portfolio share record:', error);
    }
  }

  /**
   * Lấy share records của một portfolio
   */
  getShareRecords(portfolioId: string): PortfolioShareRecord[] {
    try {
      const records: PortfolioShareRecord[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.PREFIX)) {
          const item = localStorage.getItem(key);
          if (item) {
            const record = JSON.parse(item) as PortfolioShareRecord;
            if (record.portfolioId === portfolioId) {
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
      console.error('Failed to get portfolio share records:', error);
      return [];
    }
  }

  /**
   * Lưu shared portfolio data vào localStorage
   */
  saveSharedPortfolio(portfolioId: string, portfolio: SavedPortfolio): void {
    try {
      const sharedData = {
        id: portfolioId,
        portfolio: portfolio,
        sharedAt: new Date().toISOString(),
      };
      localStorage.setItem(`${this.SHARED_PORTFOLIOS_KEY}_${portfolioId}`, JSON.stringify(sharedData));
    } catch (error) {
      console.error('Failed to save shared portfolio:', error);
    }
  }

  /**
   * Lấy shared portfolio data từ localStorage
   */
  getSharedPortfolio(portfolioId: string): SavedPortfolio | null {
    try {
      const data = localStorage.getItem(`${this.SHARED_PORTFOLIOS_KEY}_${portfolioId}`);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.portfolio || null;
      }
      return null;
    } catch (error) {
      console.error('Failed to get shared portfolio:', error);
      return null;
    }
  }

  /**
   * Xóa share records
   */
  clearShareRecords(portfolioId?: string): void {
    try {
      if (portfolioId) {
        const records = this.getShareRecords(portfolioId);
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
      console.error('Failed to clear portfolio share records:', error);
    }
  }

  /**
   * Tính toán share stats
   */
  getShareStats(portfolioId: string): PortfolioShareStats {
    const records = this.getShareRecords(portfolioId);
    const stats: PortfolioShareStats = {
      total: records.length,
      byPlatform: {
        facebook: 0,
        messenger: 0,
        email: 0,
        copy: 0,
        direct: 0,
      },
      recentShares: records.slice(0, 10),
    };

    records.forEach((record) => {
      stats.byPlatform[record.platform]++;
    });

    return stats;
  }
}

/**
 * API Service for Portfolio Sharing
 */
class PortfolioShareApiService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  /**
   * Track portfolio share
   */
  async trackShare(portfolioId: string, platform: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/portfolio/${portfolioId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform, timestamp: new Date().toISOString() }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to track portfolio share:', error);
      return false;
    }
  }

  /**
   * Get shared portfolio data
   */
  async getSharedPortfolio(portfolioId: string): Promise<SavedPortfolio | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/portfolio/${portfolioId}/shared`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.portfolio || null;
      }
      return null;
    } catch (error) {
      console.error('Failed to get shared portfolio from API:', error);
      return null;
    }
  }
}

/**
 * Main Portfolio Share Service
 */
class PortfolioShareService {
  private storageService: PortfolioShareStorageService;
  private apiService: PortfolioShareApiService;

  constructor() {
    this.storageService = new PortfolioShareStorageService();
    this.apiService = new PortfolioShareApiService();
  }

  /**
   * Record a share action
   */
  recordShare(portfolioId: string, platform: 'facebook' | 'messenger' | 'email' | 'copy' | 'direct', userId?: string): PortfolioShareRecord {
    const record: PortfolioShareRecord = {
      id: `${portfolioId}_${platform}_${Date.now()}`,
      portfolioId,
      platform,
      timestamp: new Date().toISOString(),
      userId,
    };

    this.storageService.saveShareRecord(record);
    // Track to API in background (non-blocking)
    this.apiService.trackShare(portfolioId, platform).catch(err => console.error(err));

    return record;
  }

  /**
   * Save portfolio data for sharing
   */
  saveForSharing(portfolioId: string, portfolio: SavedPortfolio): void {
    this.storageService.saveSharedPortfolio(portfolioId, portfolio);
  }

  /**
   * Get shared portfolio
   */
  async getSharedPortfolio(portfolioId: string): Promise<SavedPortfolio | null> {
    // Try localStorage first
    const localPortfolio = this.storageService.getSharedPortfolio(portfolioId);
    if (localPortfolio) {
      return localPortfolio;
    }

    // Try API if not in localStorage
    return await this.apiService.getSharedPortfolio(portfolioId);
  }

  /**
   * Get share stats
   */
  getShareStats(portfolioId: string): PortfolioShareStats {
    return this.storageService.getShareStats(portfolioId);
  }

  /**
   * Get share records
   */
  getShareRecords(portfolioId: string): PortfolioShareRecord[] {
    return this.storageService.getShareRecords(portfolioId);
  }

  /**
   * Clear share records
   */
  clearShareRecords(portfolioId?: string): void {
    this.storageService.clearShareRecords(portfolioId);
  }
}

// Export singleton instance
export const portfolioShareService = new PortfolioShareService();
