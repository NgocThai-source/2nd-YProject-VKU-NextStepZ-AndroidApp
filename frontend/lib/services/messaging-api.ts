/**
 * Messaging API Service
 * Connects frontend to the messaging backend endpoints
 */

import { API_URL } from '@/lib/api';

export interface ConversationPreview {
    id: string;
    participantId: string;
    participantName: string;
    participantAvatar: string;
    participantRole: string;
    lastMessage: {
        id: string;
        content: string;
        type: 'text' | 'image' | 'portfolio';
        isRead: boolean;
        createdAt: string;
    } | null;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface MessageData {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    type: 'text' | 'image' | 'portfolio';
    imageUrl?: string;
    portfolioId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    portfolioData?: any;
    isRead: boolean;
    timestamp: string;
    status: 'sending' | 'sent' | 'read';
}

export interface ConversationFull {
    id: string;
    participantId: string;
    participantName: string;
    participantAvatar: string;
    participantRole: string;
    isOnline: boolean;
    messages: MessageData[];
    unreadCount: number;
    currentUser: {
        id: string;
        name: string;
        avatar: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface SendMessageDto {
    conversationId: string;
    content: string;
    type: 'text' | 'image' | 'portfolio';
    imageUrl?: string;
    portfolioId?: string;
}

/**
 * Get all conversations for the current user
 */
export async function getConversations(token: string): Promise<ConversationPreview[]> {
    try {
        const response = await fetch(`${API_URL}/messaging/conversations`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            // Return empty array for unauthenticated or error cases
            return [];
        }

        return response.json();
    } catch {
        // Return empty array on network errors
        return [];
    }
}

/**
 * Get a single conversation with all messages
 */
export async function getConversation(conversationId: string, token: string): Promise<ConversationFull> {
    const response = await fetch(`${API_URL}/messaging/conversations/${conversationId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Không thể tải cuộc trò chuyện');
    }

    return response.json();
}

/**
 * Create a new conversation or get existing one
 */
export async function createConversation(participantId: string, token: string): Promise<ConversationFull> {
    const response = await fetch(`${API_URL}/messaging/conversations`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantId }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Không thể tạo cuộc trò chuyện');
    }

    return response.json();
}

/**
 * Send a message
 */
export async function sendMessage(dto: SendMessageDto, token: string): Promise<MessageData> {
    const response = await fetch(`${API_URL}/messaging/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Không thể gửi tin nhắn');
    }

    return response.json();
}

/**
 * Mark all messages in a conversation as read
 */
export async function markConversationAsRead(conversationId: string, token: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/messaging/conversations/${conversationId}/read`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Không thể đánh dấu đã đọc');
    }

    return response.json();
}

/**
 * Get portfolio data for a shared portfolio message
 */
export async function getPortfolioForMessage(portfolioId: string, token: string): Promise<{
    id: string;
    name: string;
    title: string;
    headline?: string;
    photoUrl?: string;
    selectedTemplate: number;
} | null> {
    const response = await fetch(`${API_URL}/messaging/portfolios/${portfolioId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
}
