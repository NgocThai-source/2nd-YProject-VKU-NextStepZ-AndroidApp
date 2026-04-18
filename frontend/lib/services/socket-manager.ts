/**
 * Socket Manager for Real-time Messaging
 * Handles WebSocket connection to the messaging gateway
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export interface SocketCallbacks {
    onNewMessage?: (message: any) => void;
    onMessageReceived?: (data: { conversationId: string; message: any }) => void;
    onMessagesRead?: (data: { conversationId: string; readerId: string }) => void;
    onUserOnline?: (data: { userId: string }) => void;
    onUserOffline?: (data: { userId: string }) => void;
    onNewNotification?: (notification: any) => void;
    onSavedItemUpdate?: (data: any) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
}

/**
 * Connect to the messaging WebSocket gateway
 */
export function connectSocket(token: string, callbacks: SocketCallbacks = {}): Socket {
    // Disconnect existing socket if any
    if (socket?.connected) {
        socket.disconnect();
    }

    socket = io(`${SOCKET_URL}/messaging`, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    // Connection events
    socket.on('connect', () => {
        console.log('Connected to messaging WebSocket');
        callbacks.onConnect?.();
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from messaging WebSocket');
        callbacks.onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error.message);
    });

    // Message events
    socket.on('newMessage', (message) => {
        console.log('Received new message via WebSocket:', message);
        callbacks.onNewMessage?.(message);
    });

    socket.on('messageReceived', (data) => {
        console.log('Message received notification:', data);
        callbacks.onMessageReceived?.(data);
    });

    socket.on('messagesRead', (data) => {
        console.log('Messages read:', data);
        callbacks.onMessagesRead?.(data);
    });

    // Online status events
    socket.on('userOnline', (data) => {
        console.log('User came online:', data);
        callbacks.onUserOnline?.(data);
    });

    socket.on('userOffline', (data) => {
        console.log('User went offline:', data);
        callbacks.onUserOffline?.(data);
    });

    // Notification events
    socket.on('newNotification', (notification) => {
        console.log('Received new notification:', notification);
        callbacks.onNewNotification?.(notification);
    });

    // Saved items events
    socket.on('savedItemUpdate', (data) => {
        console.log('Received saved item update:', data);
        callbacks.onSavedItemUpdate?.(data);
    });

    return socket;
}

/**
 * Disconnect from the WebSocket
 */
export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

/**
 * Join a conversation room to receive real-time messages
 */
export function joinConversation(conversationId: string): void {
    if (socket?.connected) {
        socket.emit('joinConversation', { conversationId });
    }
}

/**
 * Leave a conversation room
 */
export function leaveConversation(conversationId: string): void {
    if (socket?.connected) {
        socket.emit('leaveConversation', { conversationId });
    }
}

/**
 * Check if socket is connected
 */
export function isSocketConnected(): boolean {
    return socket?.connected ?? false;
}

/**
 * Get the socket instance
 */
export function getSocket(): Socket | null {
    return socket;
}
