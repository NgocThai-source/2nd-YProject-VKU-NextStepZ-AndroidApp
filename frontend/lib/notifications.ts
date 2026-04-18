export interface NotificationActor {
  id: string;
  name: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  type: 'follow' | 'post_like' | 'post_comment' | 'question_like' | 'question_comment' | 'comment_like' | 'employer_verified' | 'employer_unverified' | 'account_banned';
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actor: NotificationActor;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Get notifications for the current user
 */
export async function fetchNotifications(
  token: string,
  page: number = 1,
  limit: number = 20
): Promise<NotificationResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/notifications?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  return response.json();
}

/**
 * Get unread notification count
 */
export async function fetchUnreadCount(token: string): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return 0;
  }

  const data = await response.json();
  return data.unreadCount || 0;
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  token: string,
  notificationId: string
): Promise<void> {
  await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(token: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Clear all notifications (delete)
 */
export async function clearAllNotifications(token: string): Promise<{ count: number }> {
  const response = await fetch(`${API_BASE_URL}/api/notifications/clear-all`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to clear notifications');
  }

  return response.json();
}

/**
 * Get time ago string in Vietnamese
 */
export function getTimeAgo(date: string | Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'vừa xong';
  if (minutes < 60) return `${minutes}m trước`;
  if (hours < 24) return `${hours}h trước`;
  if (days < 7) return `${days}d trước`;
  return new Date(date).toLocaleDateString('vi-VN');
}

/**
 * Get notification icon based on type
 */
export function getNotificationIcon(type: Notification['type']): string {
  const icons: Record<Notification['type'], string> = {
    follow: '👥',
    post_like: '❤️',
    post_comment: '💬',
    question_like: '❤️',
    question_comment: '💬',
    comment_like: '👍',
    employer_verified: '✅',
    employer_unverified: '⚠️',
    account_banned: '🚫',
  };
  return icons[type] || '🔔';
}
