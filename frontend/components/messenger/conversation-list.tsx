'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Users, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useMessaging } from '@/lib/messaging-context';
import { useAuth } from '@/lib/auth-context';
import { getFollowingUsers, FollowedUser } from '@/lib/services/follow-api';

interface ConversationListProps {
  onSelectConversation?: () => void;
}

export default function ConversationList({ onSelectConversation }: ConversationListProps) {
  const {
    conversations,
    selectedConversation,
    selectConversation,
    searchConversations,
    markAsRead,
    createOrGetConversation,
  } = useMessaging();
  const { getToken, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
  const [isLoadingFollowed, setIsLoadingFollowed] = useState(false);

  // Load followed users
  const loadFollowedUsers = useCallback(async () => {
    const token = getToken?.();
    if (!token) return;

    setIsLoadingFollowed(true);
    try {
      const users = await getFollowingUsers(token);
      setFollowedUsers(users);
    } catch (error) {
      console.error('Error loading followed users:', error);
    } finally {
      setIsLoadingFollowed(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadFollowedUsers();
  }, [loadFollowedUsers, user]);

  // Filter followed users based on search and exclude those already in conversations
  const conversationParticipantIds = new Set(conversations.map(c => c.participantId));

  const filteredFollowedUsers = followedUsers.filter(u => {
    // Filter by search query
    if (searchQuery) {
      return u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Separate followed users with conversations vs without
  const followedWithConversation = filteredFollowedUsers.filter(u => conversationParticipantIds.has(u.id));
  const followedWithoutConversation = filteredFollowedUsers.filter(u => !conversationParticipantIds.has(u.id));

  const displayedConversations = searchQuery ? searchConversations(searchQuery) : conversations;

  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId);
    markAsRead(conversationId);
    onSelectConversation?.();
  };

  const handleStartConversation = (followedUser: FollowedUser) => {
    createOrGetConversation(followedUser.id, followedUser.name, followedUser.avatar);
    onSelectConversation?.();
  };

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-slate-900 to-slate-800 border-r border-slate-700">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-slate-700">
        <h2
          className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4"
          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
        >
          Tin nhắn
        </h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Active Conversations Section */}
        {displayedConversations.length > 0 && (
          <div className="p-2">
            <div className="flex items-center gap-2 px-2 py-1 mb-2">
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                Cuộc trò chuyện
              </span>
            </div>
            <div className="space-y-1">
              {displayedConversations.map((conversation) => (
                <motion.button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`w-full p-2 md:p-3 rounded-lg transition-all text-left group ${selectedConversation?.id === conversation.id
                      ? 'bg-linear-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50'
                      : 'hover:bg-slate-800/50 border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-cyan-400/50 transition-colors">
                        <Image
                          src={conversation.participantAvatar}
                          alt={conversation.participantName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {/* Online indicator */}
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3
                          className="font-semibold text-white truncate text-sm md:text-base"
                          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        >
                          {conversation.participantName}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="shrink-0 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full font-semibold">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs md:text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-300 font-medium' : 'text-gray-400'
                          }`}
                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                      >
                        {conversation.lastMessage ? (
                          <>
                            {conversation.lastMessage.type === 'image' && '📷 Hình ảnh'}
                            {conversation.lastMessage.type === 'portfolio' && '🎨 Portfolio'}
                            {conversation.lastMessage.type === 'text' && conversation.lastMessage.content}
                          </>
                        ) : (
                          'Chưa có tin nhắn'
                        )}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Followed Users Section - Show users not yet in conversation */}
        {followedWithoutConversation.length > 0 && (
          <div className="p-2 border-t border-slate-700/50">
            <div className="flex items-center gap-2 px-2 py-1 mb-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                Đang theo dõi
              </span>
            </div>
            <div className="space-y-1">
              {followedWithoutConversation.map((followedUser) => (
                <motion.button
                  key={followedUser.id}
                  onClick={() => handleStartConversation(followedUser)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full p-2 md:p-3 rounded-lg transition-all text-left group hover:bg-slate-800/50 border border-transparent"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-green-400/50 transition-colors">
                        <Image
                          src={followedUser.avatar}
                          alt={followedUser.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-white truncate text-sm md:text-base"
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                      >
                        {followedUser.name}
                      </h3>
                      <p
                        className="text-xs text-gray-500"
                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                      >
                        {followedUser.role === 'employer' ? '🤝 Nhà tuyển dụng' : '📚 Sinh viên'}
                      </p>
                    </div>

                    {/* Start conversation hint */}
                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MessageCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingFollowed && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoadingFollowed && displayedConversations.length === 0 && followedUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Users className="w-10 h-10 md:w-12 md:h-12 text-gray-500 mb-2 md:mb-3" />
            <p className="text-gray-400 text-xs md:text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              {searchQuery
                ? 'Không tìm thấy người dùng'
                : 'Hãy theo dõi ai đó để bắt đầu nhắn tin'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
