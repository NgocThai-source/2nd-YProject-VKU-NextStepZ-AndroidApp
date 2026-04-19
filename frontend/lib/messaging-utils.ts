/**
 * Messaging Service Utilities
 * 
 * This file provides utility functions for common messaging operations
 * that can be used throughout the application.
 */

import { MessageType, Message } from '@/lib/messaging-context';

/**
 * Format timestamp to human-readable format
 */
export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins}p trước`;
  if (diffHours < 24) return `${diffHours}h trước`;
  if (diffDays < 7) return `${diffDays}d trước`;

  return date.toLocaleDateString('vi-VN');
};

/**
 * Validate image before upload
 */
export const validateImage = (
  file: File,
  maxSizeMb: number = 5
): { valid: boolean; error?: string } => {
  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File phải là hình ảnh' };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Hình ảnh không được vượt quá ${maxSizeMb}MB`,
    };
  }

  return { valid: true };
};

/**
 * Get message type icon/label
 */
export const getMessageTypeLabel = (type: MessageType): string => {
  const labels: Record<MessageType, string> = {
    text: 'Tin nhắn',
    image: 'Hình ảnh',
    portfolio: 'Portfolio',
  };

  return labels[type];
};

/**
 * Get message type emoji
 */
export const getMessageTypeEmoji = (type: MessageType): string => {
  const emojis: Record<MessageType, string> = {
    text: '💬',
    image: '🖼️',
    portfolio: '🎨',
  };

  return emojis[type];
};

/**
 * Truncate long message for preview
 */
export const truncateMessage = (message: string, maxLength: number = 50): string => {
  if (message.length <= maxLength) return message;
  return `${message.substring(0, maxLength)}...`;
};

/**
 * Check if user is online based on last activity
 */
export const isUserOnline = (lastSeen: Date, timeoutMs: number = 5000): boolean => {
  const now = new Date();
  const diffMs = now.getTime() - lastSeen.getTime();
  return diffMs < timeoutMs;
};

/**
 * Group messages by date
 */
export interface GroupedMessages {
  date: string;
  messages: Message[];
}

export const groupMessagesByDate = (messages: Message[]): GroupedMessages[] => {
  const grouped: Map<string, Message[]> = new Map();

  messages.forEach((message) => {
    const dateKey = new Date(message.timestamp).toLocaleDateString('vi-VN');
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(message);
  });

  return Array.from(grouped.entries()).map(([date, msgs]) => ({
    date,
    messages: msgs,
  }));
};

/**
 * Check if message needs timestamp display
 * Shows timestamp if more than 5 minutes since last message
 */
export const shouldShowTimestamp = (
  currentMessage: Message,
  previousMessage: Message | undefined,
  timeThresholdMs: number = 5 * 60 * 1000
): boolean => {
  if (!previousMessage) return true;

  const currentTime = new Date(currentMessage.timestamp).getTime();
  const previousTime = new Date(previousMessage.timestamp).getTime();
  const diff = currentTime - previousTime;

  return diff > timeThresholdMs;
};

/**
 * Generate a unique conversation ID from two user IDs
 */
export const generateConversationId = (userId1: string, userId2: string): string => {
  const sorted = [userId1, userId2].sort();
  return `conv_${sorted[0]}_${sorted[1]}`;
};

/**
 * Extract mentions from message text
 */
export const extractMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map((m) => m.substring(1)) : [];
};

/**
 * Add mention to text at cursor position
 */
export const addMentionToText = (
  text: string,
  mention: string,
  cursorPosition: number
): string => {
  const before = text.substring(0, cursorPosition);
  const after = text.substring(cursorPosition);
  return `${before}@${mention} ${after}`;
};
