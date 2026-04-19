'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './auth-context';
import * as messagingApi from './services/messaging-api';
import * as socketManager from './services/socket-manager';
import type { SavedPortfolio } from './saved-portfolio-context';

export type MessageType = 'text' | 'image' | 'portfolio';
export type MessageStatus = 'sending' | 'sent' | 'read';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  timestamp: Date;
  imageUrl?: string;
  portfolioId?: string;
  portfolioTitle?: string;
  portfolioData?: SavedPortfolio;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole?: string;
  isOnline: boolean;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  messages: Message[];
}

interface MessagingContextType {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isLoading: boolean;
  isInitialized: boolean;
  isConnected: boolean;
  selectConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string, type: MessageType, imageUrl?: string, portfolioId?: string, portfolioData?: SavedPortfolio) => Promise<void>;
  markAsRead: (conversationId: string) => void;
  markAllAsRead: () => void;
  searchConversations: (query: string) => Conversation[];
  createOrGetConversation: (participantId: string, participantName: string, participantAvatar: string) => void;
  refreshConversations: () => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

// Transform API message to local Message format
function transformMessage(msg: messagingApi.MessageData): Message {
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    senderId: msg.senderId,
    senderName: msg.senderName,
    senderAvatar: msg.senderAvatar,
    content: msg.content,
    type: msg.type,
    status: msg.isRead ? 'read' : 'sent',
    timestamp: new Date(msg.timestamp),
    imageUrl: msg.imageUrl,
    portfolioId: msg.portfolioId,
    portfolioData: msg.portfolioData,
  };
}

// Transform API conversation preview to local Conversation format
function transformConversationPreview(conv: messagingApi.ConversationPreview): Conversation {
  return {
    id: conv.id,
    participantId: conv.participantId,
    participantName: conv.participantName,
    participantAvatar: conv.participantAvatar,
    participantRole: conv.participantRole,
    isOnline: false, // TODO: Implement online status
    unreadCount: conv.unreadCount,
    createdAt: new Date(conv.createdAt),
    messages: [],
    lastMessage: conv.lastMessage ? {
      id: conv.lastMessage.id,
      conversationId: conv.id,
      senderId: '',
      senderName: '',
      senderAvatar: '',
      content: conv.lastMessage.content,
      type: conv.lastMessage.type,
      status: conv.lastMessage.isRead ? 'read' : 'sent',
      timestamp: new Date(conv.lastMessage.createdAt),
    } : undefined,
  };
}

export const MessagingProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const previousConversationIdRef = useRef<string | null>(null);

  // Compute selectedConversation from conversations to ensure it's always in sync
  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId) || null
    : null;

  // Connect to WebSocket when authenticated
  useEffect(() => {
    const token = getToken?.();
    console.log('WebSocket useEffect: token exists:', !!token, 'user exists:', !!user);

    if (!token || !user) {
      socketManager.disconnectSocket();
      setIsConnected(false);
      return;
    }

    console.log('Connecting to WebSocket with token...');

    socketManager.connectSocket(token, {
      onConnect: () => {
        console.log('WebSocket connected!');
        setIsConnected(true);
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected!');
        setIsConnected(false);
      },
      onNewMessage: (message) => {
        console.log('newMessage event received:', message);
        // Transform and add message
        const transformedMsg: Message = {
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          senderName: message.senderName,
          senderAvatar: message.senderAvatar,
          content: message.content,
          type: message.type,
          status: message.isRead ? 'read' : 'sent',
          timestamp: new Date(message.timestamp),
          imageUrl: message.imageUrl,
          portfolioId: message.portfolioId,
        };

        // Check if this is the currently viewed conversation
        const currentConvId = previousConversationIdRef.current;
        const isViewingThisConversation = currentConvId === message.conversationId;

        // If viewing this conversation and not sender, auto-mark as read
        if (isViewingThisConversation && message.senderId !== user?.id) {
          const authToken = getToken?.();
          if (authToken) {
            messagingApi.markConversationAsRead(message.conversationId, authToken)
              .catch(err => console.error('Failed to mark as read:', err));
          }
        }

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === message.conversationId) {
              // Check if message already exists (avoid duplicates)
              const exists = conv.messages.some((m) => m.id === message.id);
              if (exists) return conv;

              return {
                ...conv,
                lastMessage: transformedMsg,
                messages: [...conv.messages, transformedMsg],
                // Don't increment unread count if viewing this conversation
                unreadCount: isViewingThisConversation ? 0 : conv.unreadCount,
              };
            }
            return conv;
          })
        );
      },
      onMessageReceived: (data) => {
        console.log('messageReceived event:', data);
        // Same handling as onNewMessage for incoming messages
        const message = data.message;
        const transformedMsg: Message = {
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          senderName: message.senderName,
          senderAvatar: message.senderAvatar,
          content: message.content,
          type: message.type,
          status: message.isRead ? 'read' : 'sent',
          timestamp: new Date(message.timestamp),
          imageUrl: message.imageUrl,
          portfolioId: message.portfolioId,
        };

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === data.conversationId) {
              const exists = conv.messages.some((m) => m.id === message.id);
              if (exists) return conv;

              return {
                ...conv,
                lastMessage: transformedMsg,
                messages: [...conv.messages, transformedMsg],
                unreadCount: conv.unreadCount + 1,
              };
            }
            return conv;
          })
        );
      },
      onMessagesRead: (data) => {
        console.log('messagesRead event:', data);
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === data.conversationId) {
              return {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.senderId !== data.readerId ? { ...msg, status: 'read' as MessageStatus } : msg
                ),
              };
            }
            return conv;
          })
        );
      },
      onUserOnline: (data) => {
        console.log('User online:', data.userId);
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.participantId === data.userId) {
              return { ...conv, isOnline: true };
            }
            return conv;
          })
        );
      },
      onUserOffline: (data) => {
        console.log('User offline:', data.userId);
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.participantId === data.userId) {
              return { ...conv, isOnline: false };
            }
            return conv;
          })
        );
      },
    });

    return () => {
      socketManager.disconnectSocket();
    };
  }, [getToken, user]); // Only reconnect when auth changes, not on conversation changes

  // Join/leave conversation rooms when selection changes
  useEffect(() => {
    if (previousConversationIdRef.current) {
      socketManager.leaveConversation(previousConversationIdRef.current);
    }

    if (selectedConversationId) {
      socketManager.joinConversation(selectedConversationId);
    }

    previousConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // Load conversations on mount
  const loadConversations = useCallback(async () => {
    const token = getToken?.();
    if (!token) {
      setConversations([]);
      setIsInitialized(true);
      return;
    }

    try {
      setIsLoading(true);
      const data = await messagingApi.getConversations(token);
      setConversations(data.map(transformConversationPreview));
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [getToken]);

  // Load conversations on auth change
  useEffect(() => {
    loadConversations();
  }, [loadConversations, user]);

  // Refresh conversations
  const refreshConversations = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  // Select a conversation and load its full messages
  const selectConversation = useCallback(async (conversationId: string) => {
    setSelectedConversationId(conversationId);

    const token = getToken?.();
    if (!token) return;

    try {
      setIsLoading(true);
      const fullConv = await messagingApi.getConversation(conversationId, token);

      // Mark conversation as read on the backend
      await messagingApi.markConversationAsRead(conversationId, token);

      // Update the conversation with full messages
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: fullConv.messages.map(transformMessage),
              unreadCount: 0, // Mark as read when selected
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  const sendMessage = useCallback(
    async (
      conversationId: string,
      content: string,
      type: MessageType,
      imageUrl?: string,
      portfolioId?: string,
      portfolioData?: SavedPortfolio
    ) => {
      const token = getToken?.();
      if (!token) return;

      setIsLoading(true);
      try {
        // Send message to backend
        const sentMessage = await messagingApi.sendMessage({
          conversationId,
          content,
          type,
          imageUrl,
          portfolioId,
        }, token);

        // Transform and add to local state
        const newMessage: Message = {
          ...transformMessage(sentMessage),
          portfolioData,
          portfolioTitle: portfolioData?.name,
        };

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                lastMessage: newMessage,
                messages: [...conv.messages, newMessage],
              };
            }
            return conv;
          })
        );
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [getToken]
  );

  const markAsRead = useCallback(async (conversationId: string) => {
    const token = getToken?.();
    if (!token) return;

    try {
      await messagingApi.markConversationAsRead(conversationId, token);

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map((msg) =>
                msg.senderId !== user?.id ? { ...msg, status: 'read' as MessageStatus } : msg
              ),
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, [getToken, user?.id]);

  const markAllAsRead = useCallback(() => {
    setConversations((prev) =>
      prev.map((conv) => ({
        ...conv,
        unreadCount: 0,
        messages: conv.messages.map((msg) =>
          msg.senderId !== user?.id ? { ...msg, status: 'read' as MessageStatus } : msg
        ),
      }))
    );
  }, [user?.id]);

  const searchConversations = useCallback(
    (query: string) => {
      if (!query.trim()) return conversations;
      return conversations.filter((conv) =>
        conv.participantName.toLowerCase().includes(query.toLowerCase()) ||
        conv.lastMessage?.content.toLowerCase().includes(query.toLowerCase())
      );
    },
    [conversations]
  );

  const createOrGetConversation = useCallback(
    async (participantId: string, participantName: string, participantAvatar: string) => {
      const token = getToken?.();
      if (!token) return;

      // Check if conversation already exists
      const existing = conversations.find((c) => c.participantId === participantId);
      if (existing) {
        selectConversation(existing.id);
        return;
      }

      try {
        setIsLoading(true);
        const newConv = await messagingApi.createConversation(participantId, token);

        // Add new conversation to list
        const conversation: Conversation = {
          id: newConv.id,
          participantId: newConv.participantId,
          participantName: newConv.participantName,
          participantAvatar: newConv.participantAvatar,
          participantRole: newConv.participantRole,
          isOnline: false,
          unreadCount: 0,
          createdAt: new Date(newConv.createdAt),
          messages: newConv.messages.map(transformMessage),
        };

        setConversations((prev) => [conversation, ...prev]);
        setSelectedConversationId(conversation.id);
      } catch (error) {
        console.error('Error creating conversation:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [conversations, selectConversation, getToken]
  );

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        selectedConversation,
        isLoading,
        isInitialized,
        isConnected,
        selectConversation,
        sendMessage,
        markAsRead,
        markAllAsRead,
        searchConversations,
        createOrGetConversation,
        refreshConversations,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within MessagingProvider');
  }
  return context;
};
