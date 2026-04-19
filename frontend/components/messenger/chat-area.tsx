'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useMessaging, ImagePreviewModal } from '@/components/messenger';
import { useAuth } from '@/lib/auth-context';
import PortfolioCard from './portfolio-card';
import { portfolioShareService } from '@/lib/services/portfolio-share-service';

export default function ChatArea(): React.ReactNode {
  const { selectedConversation } = useMessaging();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [isLoadingIndicatorVisible, setIsLoadingIndicatorVisible] = React.useState(false);

  const conversation = selectedConversation;
  const currentUserId = user?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (!conversation?.messages) return;

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage?.senderId !== currentUserId && lastMessage?.status === 'sent') {
      const timer = setTimeout(() => {
        setIsLoadingIndicatorVisible(true);
      }, 100);
      const clearTimer = setTimeout(() => {
        setIsLoadingIndicatorVisible(false);
      }, 2100);
      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [conversation?.messages, currentUserId]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <p
            className="text-gray-400 text-lg"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
          >
            Chọn một cuộc trò chuyện
          </p>
          <p
            className="text-gray-500 text-sm mt-2"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            Chọn bạn để bắt đầu nhắn tin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 p-3 md:p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur-xl z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-slate-700 shrink-0">
              <Image
                src={conversation.participantAvatar}
                alt={conversation.participantName}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="font-semibold text-white text-sm md:text-base truncate"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                {conversation.participantName}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-scroll flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-4 space-y-3 md:space-y-4">
        {conversation.messages.length > 0 ? (
          <>
            {conversation.messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const showAvatar =
                index === 0 ||
                conversation.messages[index - 1]?.senderId !== message.senderId;

              return (
                <div
                  key={`${message.id}-${index}`}
                  className={`flex gap-2 md:gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar - Only show for other party's messages */}
                  {!isCurrentUser && (
                    <div className="shrink-0">
                      {showAvatar ? (
                        <div className="avatar-small relative rounded-full overflow-hidden border border-slate-700">
                          <Image
                            src={message.senderAvatar}
                            alt={message.senderName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="avatar-small" />
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`flex flex-col gap-1 max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'
                      }`}
                  >
                    {/* Sender name for other party (only show when avatar is shown) */}
                    {!isCurrentUser && showAvatar && (
                      <span
                        className="text-xs text-gray-500 px-2"
                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                      >
                        {message.senderName}
                      </span>
                    )}

                    <div
                      className={`px-3 md:px-4 py-2 wrap-break-word text-sm md:text-base shadow-lg ${isCurrentUser
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-2xl rounded-bl-2xl rounded-br-md'
                        : 'bg-slate-800/80 border border-slate-700/50 text-gray-100 rounded-t-2xl rounded-br-2xl rounded-bl-md'
                        }`}
                    >
                      {message.type === 'text' && (
                        <p
                          className="text-sm md:text-base"
                          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                        >
                          {message.content}
                        </p>
                      )}

                      {message.type === 'image' && message.imageUrl && (
                        <button
                          onClick={() => setPreviewImage(message.imageUrl || null)}
                          className="relative w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <Image
                            src={message.imageUrl}
                            alt="Shared image"
                            fill
                            className="object-cover"
                          />
                        </button>
                      )}

                      {message.type === 'portfolio' && (
                        <div
                          className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-all min-w-[200px]"
                          onClick={() => {
                            const portfolioId = message.portfolioData?.id || message.portfolioId;
                            if (portfolioId) {
                              if (message.portfolioData) {
                                portfolioShareService.saveForSharing(portfolioId, message.portfolioData);
                              }
                              const portfolioUrl = `${window.location.origin}/shared-portfolio/${portfolioId}`;
                              window.open(portfolioUrl, '_blank');
                            }
                          }}
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center border border-cyan-400/20">
                            <span className="text-lg">📄</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-semibold text-white truncate"
                              style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                            >
                              {message.portfolioData?.name || message.content || 'Hồ sơ sáng tạo'}
                            </p>
                            <p
                              className="text-xs text-gray-400"
                              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                            >
                              Nhấn để xem hồ sơ
                            </p>
                          </div>
                          <div className="text-cyan-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div
                      className={`flex items-center text-xs text-gray-500 px-2 ${isCurrentUser ? 'justify-end' : 'justify-start'
                        }`}
                      style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                    >
                      <span>
                        {message.timestamp.toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoadingIndicatorVisible && (
              <div className="flex gap-3 items-start">
                <div className="shrink-0">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-700">
                    <Image
                      src={conversation.participantAvatar}
                      alt={conversation.participantName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-slate-800">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
              <span className="text-3xl">👋</span>
            </div>
            <p
              className="text-gray-400 text-lg"
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              Bắt đầu cuộc trò chuyện
            </p>
            <p
              className="text-gray-500 text-sm mt-2"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            >
              Hãy gửi tin nhắn đầu tiên
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}
