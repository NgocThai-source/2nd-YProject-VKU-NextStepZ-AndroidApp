'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessagingProvider, useMessaging } from '@/lib/messaging-context';
import { useAuth } from '@/lib/auth-context';
import * as messagingApi from '@/lib/services/messaging-api';
import ConversationList from '@/components/messenger/conversation-list';
import ChatArea from '@/components/messenger/chat-area';
import MessageInput from '@/components/messenger/message-input';
import { ChevronLeft, Menu } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import '@/components/messenger/messenger.css';

function MessengerContent() {
  const { selectedConversation, createOrGetConversation, sendMessage, refreshConversations, selectConversation, isInitialized } = useMessaging();
  const { getToken } = useAuth();
  const { addToast } = useToast();
  const [showConversationList, setShowConversationList] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const hasProcessedAutoSend = useRef(false);

  // Handle auto-send from job posting page
  useEffect(() => {
    if (hasProcessedAutoSend.current || !isInitialized) return;

    const autoSendDataStr = sessionStorage.getItem('nextstepz_auto_send_profile');
    if (!autoSendDataStr) return;

    hasProcessedAutoSend.current = true;

    const processAutoSend = async () => {
      try {
        const autoSendData = JSON.parse(autoSendDataStr);
        const { employerId, employerName, employerAvatar, portfolio } = autoSendData;

        if (!employerId || !portfolio) {
          sessionStorage.removeItem('nextstepz_auto_send_profile');
          return;
        }

        const token = getToken?.();
        if (!token) {
          sessionStorage.removeItem('nextstepz_auto_send_profile');
          addToast('Phiên đăng nhập đã hết hạn', 'error');
          return;
        }

        // Create or get conversation with employer
        const conversation = await messagingApi.createConversation(employerId, token);

        // Send portfolio message
        await messagingApi.sendMessage({
          conversationId: conversation.id,
          content: `Đã chia sẻ hồ sơ: ${portfolio.name || 'Portfolio'}`,
          type: 'portfolio',
          portfolioId: portfolio.id,
        }, token);

        // Refresh and select the conversation
        await refreshConversations();
        selectConversation(conversation.id);

        addToast('Đã gửi hồ sơ thành công!', 'success');
      } catch (error) {
        console.error('Error auto-sending portfolio:', error);
        addToast('Không thể gửi hồ sơ. Vui lòng thử lại.', 'error');
      } finally {
        // Always clear sessionStorage
        sessionStorage.removeItem('nextstepz_auto_send_profile');
      }
    };

    processAutoSend();
  }, [isInitialized, getToken, addToast, refreshConversations, selectConversation]);

  // Detect mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // On mobile, auto-hide conversation list when a conversation is selected
      if (mobile && selectedConversation) {
        setShowConversationList(false);
      } else if (!mobile) {
        setShowConversationList(true);
      }
    };

    checkMobile();

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedConversation]);

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-slate-950 overflow-hidden flex relative">
      {/* Desktop Conversation List */}
      {!isMobile && (
        <div className="flex flex-col w-80 h-full border-r border-slate-700 shrink-0">
          <ConversationList />
        </div>
      )}

      {/* Mobile Conversation List - Full Screen Modal */}
      {isMobile && showConversationList && (
        <div
          className="fixed inset-0 lg:static w-full h-full z-30 bg-slate-950 top-20 animate-in fade-in duration-300"
          onClick={(e) => {
            // Don't close if clicking on the list itself
            if (e.target === e.currentTarget) {
              setShowConversationList(false);
            }
          }}
        >
          <ConversationList
            onSelectConversation={() => setShowConversationList(false)}
          />
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Back Button - Only show when viewing chat */}
        {isMobile && selectedConversation && !showConversationList && (
          <button
            className="lg:hidden fixed top-[100px] left-3 z-20 p-2 rounded-lg bg-linear-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-400 transition-all active:scale-95"
            onClick={() => setShowConversationList(true)}
            title="Quay lại danh sách (←)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <ChatArea />
        {selectedConversation && (
          <div className="shrink-0 input-wrapper">
            <MessageInput />
          </div>
        )}
      </div>

      {/* Mobile overlay when list is showing */}
      {isMobile && showConversationList && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm top-20"
          onClick={() => setShowConversationList(false)}
        />
      )}
    </div>
  );
}

export default function MessengerPage() {
  useEffect(() => {
    document.title = 'Tin nhắn - NextStepZ';

    // Hide footer only
    const footer = document.querySelector('footer');

    if (footer) footer.style.display = 'none';

    return () => {
      // Show footer again when leaving the page
      if (footer) footer.style.display = '';
    };
  }, []);

  return (
    <MessagingProvider>
      <MessengerContent />
    </MessagingProvider>
  );
}

