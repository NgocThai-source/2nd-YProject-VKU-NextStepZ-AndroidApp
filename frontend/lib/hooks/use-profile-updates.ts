import { useEffect, useRef, useCallback } from 'react';

interface ProfileUpdateListener {
  onUpdate: (data: unknown) => void;
  onError?: (error: Error) => void;
}

// Singleton để quản lý listeners
class ProfileUpdateManager {
  private listeners: Map<string, ProfileUpdateListener[]> = new Map();
  private pollIntervals: Map<string, NodeJS.Timeout> = new Map();
  private lastUpdateTime: Map<string, number> = new Map();

  subscribe(token: string, listener: ProfileUpdateListener) {
    if (!this.listeners.has(token)) {
      this.listeners.set(token, []);
    }
    this.listeners.get(token)?.push(listener);

    // Start polling cho token này nếu chưa có
    if (!this.pollIntervals.has(token)) {
      this.startPolling(token);
    }

    // Return unsubscribe function
    return () => {
      const tokenListeners = this.listeners.get(token);
      if (tokenListeners) {
        const index = tokenListeners.indexOf(listener);
        if (index > -1) {
          tokenListeners.splice(index, 1);
        }
        // Stop polling nếu không còn listener nào
        if (tokenListeners.length === 0) {
          this.stopPolling(token);
        }
      }
    };
  }

  private startPolling(token: string) {
    // Poll mỗi 5 giây để check profile updates
    const interval = setInterval(() => {
      void this.fetchProfileUpdate(token);
    }, 5000);

    this.pollIntervals.set(token, interval);
  }

  private async fetchProfileUpdate(token: string): Promise<void> {
    try {
      const apiUrl = typeof window !== 'undefined'
        ? ((window as unknown as Record<string, unknown>).NEXT_PUBLIC_API_URL as string | undefined) || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
        : 'http://localhost:3001/api';

      // Use skipView=true to prevent viewCount from incrementing during polling
      const response = await fetch(
        `${apiUrl}/profiles/public/share/${token}?skipView=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.warn(`Fetch profile failed with status ${response.status}`);
        return;
      }

      const data = await response.json();
      const currentTime = Date.now();
      const lastTime = this.lastUpdateTime.get(token) || 0;

      // Chỉ notify nếu có sự thay đổi từ lần cuối
      if (currentTime - lastTime > 1000) {
        // Throttle: minimum 1 giây giữa các updates
        this.lastUpdateTime.set(token, currentTime);
        const listeners = this.listeners.get(token) || [];
        listeners.forEach(listener => {
          try {
            listener.onUpdate(data);
          } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            listener.onError?.(err);
          }
        });
      }
    } catch (error) {
      console.warn('Profile polling error:', error);
      // Silently fail - don't notify error to user on polling failures
    }
  }

  private stopPolling(token: string) {
    const interval = this.pollIntervals.get(token);
    if (interval) {
      clearInterval(interval);
      this.pollIntervals.delete(token);
    }
  }

  destroy(token: string) {
    this.stopPolling(token);
    this.listeners.delete(token);
    this.lastUpdateTime.delete(token);
  }
}

// Singleton instance
const manager = new ProfileUpdateManager();

/**
 * Hook để listening real-time updates từ public profile
 * @param token Share token của public profile
 * @param onUpdate Callback khi có update
 * @param onError Callback khi có error
 */
export function useProfileUpdates(
  token: string | undefined,
  onUpdate: (data: unknown) => void,
  onError?: (error: Error) => void
) {
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const onUpdateRef = useRef(onUpdate);
  const onErrorRef = useRef(onError);

  // Update refs without causing effect re-runs
  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onErrorRef.current = onError;
  }, [onUpdate, onError]);

  useEffect(() => {
    if (!token) return;

    const listener: ProfileUpdateListener = {
      onUpdate: (data) => onUpdateRef.current(data),
      onError: (error) => onErrorRef.current?.(error),
    };

    unsubscribeRef.current = manager.subscribe(token, listener);

    return () => {
      unsubscribeRef.current?.();
    };
  }, [token]);
}

/**
 * Hook để trigger manual refresh của profile
 */
export function useProfileRefresh(token: string | undefined) {
  const refreshProfile = useCallback(async (): Promise<unknown> => {
    if (!token) return null;

    try {
      const apiUrl = typeof window !== 'undefined'
        ? ((window as unknown as Record<string, unknown>).NEXT_PUBLIC_API_URL as string | undefined) || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
        : 'http://localhost:3001/api';

      // skipView=true to prevent double counting when user refreshes
      const response = await fetch(
        `${apiUrl}/profiles/public/share/${token}?skipView=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  }, [token]);

  return refreshProfile;
}
