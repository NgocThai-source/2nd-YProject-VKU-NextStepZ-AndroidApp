'use client';

/**
 * MESSENGER COMPONENT EXAMPLES
 * 
 * This file contains example implementations showing how to use the messenger
 * system throughout your NextStepZ application.
 */

import React, { useState, useEffect } from 'react';
import { useMessaging } from '@/lib/messaging-context';
import { useToast } from '@/components/ui/toast';
import {
  formatMessageTime,
  getMessageTypeEmoji,
  truncateMessage,
  groupMessagesByDate,
  validateImage,
} from '@/lib/messaging-utils';

// ============================================================================
// EXAMPLE 1: Opening messenger from a user profile card
// ============================================================================

export function UserProfileCard() {
  const { createOrGetConversation } = useMessaging();
  const { addToast } = useToast();

  const handleMessageClick = () => {
    try {
      createOrGetConversation(
        'user-id-123',
        'John Doe',
        'https://example.com/avatar.jpg'
      );
      addToast('Navigating to messenger...', 'info');
      window.location.href = '/messages';
    } catch {
      addToast('Failed to open messenger', 'error');
    }
  };

  return (
    <div className="p-4 rounded-lg bg-slate-800">
      <h3>John Doe</h3>
      <button
        onClick={handleMessageClick}
        className="mt-2 px-4 py-2 bg-cyan-500 rounded-lg text-white hover:bg-cyan-600"
      >
        Message
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Searching conversations
// ============================================================================

export function ConversationSearch() {
  const { searchConversations } = useMessaging();
  const [query, setQuery] = useState('');
  const results = searchConversations(query);

  return (
    <div>
      <input
        type="text"
        placeholder="Search conversations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white"
      />
      <div className="mt-4 space-y-2">
        {results.map((conv) => (
          <div key={conv.id} className="p-2 bg-slate-700 rounded-lg">
            <p className="text-white">{conv.participantName}</p>
            <p className="text-gray-400 text-sm">{conv.lastMessage?.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Custom message sending with validation
// ============================================================================

export function CustomMessageSender() {
  const { selectedConversation, sendMessage, isLoading } = useMessaging();
  const { addToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSendWithValidation = async () => {
    if (!selectedConversation) return;

    try {
      if (file) {
        const { valid, error } = validateImage(file);
        if (!valid) {
          addToast(error || 'Invalid image', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
          await sendMessage(
            selectedConversation.id,
            message || 'Photo',
            'image',
            reader.result as string
          );
          addToast('Image sent successfully!', 'success');
          setMessage('');
          setFile(null);
        };
        reader.readAsDataURL(file);
      } else if (message.trim()) {
        await sendMessage(selectedConversation.id, message, 'text');
        addToast('Message sent!', 'success');
        setMessage('');
      }
    } catch {
      addToast('Failed to send message', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="w-full p-2 rounded-lg bg-slate-800 text-white"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-white"
      />
      <button
        onClick={handleSendWithValidation}
        disabled={isLoading}
        className="px-4 py-2 bg-cyan-500 rounded-lg text-white hover:bg-cyan-600 disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Display unread message badges
// ============================================================================

export function UnreadBadge() {
  const { conversations } = useMessaging();

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  );

  if (totalUnread === 0) return null;

  return (
    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
      {totalUnread > 99 ? '99+' : totalUnread}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Real-time message display with formatting
// ============================================================================

export function FormattedMessageDisplay() {
  const { selectedConversation } = useMessaging();

  if (!selectedConversation) return null;

  return (
    <div className="space-y-4">
      {selectedConversation.messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.senderId === 'currentUser'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-gray-100'
            }`}
          >
            <span>{getMessageTypeEmoji(msg.type)}</span>
            <p>{truncateMessage(msg.content, 100)}</p>
            <p className="text-xs mt-1 opacity-70">
              {formatMessageTime(msg.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Online status indicator
// ============================================================================

export function OnlineStatusIndicator() {
  const { selectedConversation } = useMessaging();

  if (!selectedConversation) return null;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          selectedConversation.isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
      <span className="text-sm text-gray-400">
        {selectedConversation.isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Portfolio sharing
// ============================================================================

export function SharePortfolio() {
  const { selectedConversation, sendMessage } = useMessaging();
  const { addToast } = useToast();

  const handleSharePortfolio = async (portfolioId: string) => {
    if (!selectedConversation) {
      addToast('Please select a conversation first', 'error');
      return;
    }

    try {
      await sendMessage(
        selectedConversation.id,
        'Check out my portfolio!',
        'portfolio',
        undefined,
        portfolioId
      );
      addToast('Portfolio shared!', 'success');
    } catch {
      addToast('Failed to share portfolio', 'error');
    }
  };

  return (
    <button
      onClick={() => handleSharePortfolio('portfolio-1')}
      className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
    >
      Share Portfolio
    </button>
  );
}

// ============================================================================
// EXAMPLE 8: Mark conversation as read
// ============================================================================

export function AutoMarkRead() {
  const { selectedConversation, markAsRead } = useMessaging();

  useEffect(() => {
    if (selectedConversation) {
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation, markAsRead]);

  return null;
}

// ============================================================================
// EXAMPLE 9: Integration in public profile page
// ============================================================================

export function PublicProfileWithMessenger() {
  const { addToast } = useToast();
  const { createOrGetConversation } = useMessaging();

  const handleMessage = (userId: string, userName: string, avatar: string) => {
    try {
      createOrGetConversation(userId, userName, avatar);
      addToast('Opening messenger...', 'success');
    } catch {
      addToast('Failed to open messenger', 'error');
    }
  };

  return (
    <button
      onClick={() => handleMessage('user-id', 'User Name', 'avatar-url')}
      className="px-4 py-2 bg-blue-500 rounded-lg text-white"
    >
      Nhắn tin
    </button>
  );
}

// ============================================================================
// EXAMPLE 10: Group messages by date for UI display
// ============================================================================

export function GroupedMessagesDisplay() {
  const { selectedConversation } = useMessaging();

  if (!selectedConversation) return null;

  const grouped = groupMessagesByDate(selectedConversation.messages);

  return (
    <div className="space-y-4">
      {grouped.map(({ date, messages }) => (
        <div key={date}>
          <div className="text-center mb-4">
            <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-gray-400">
              {date}
            </span>
          </div>
          <div className="space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === 'currentUser'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div className="max-w-xs px-4 py-2 rounded-lg bg-slate-800 text-gray-100">
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MessengerExamplesPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Messenger Examples</h1>

      <section>
        <h2 className="text-2xl font-bold mb-4">Example 1: Profile Integration</h2>
        <UserProfileCard />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Example 2: Search</h2>
        <ConversationSearch />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Example 3: Validation</h2>
        <CustomMessageSender />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Example 4: Unread Badge</h2>
        <UnreadBadge />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Example 5: Formatted Messages</h2>
        <FormattedMessageDisplay />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Example 6: Online Status</h2>
        <OnlineStatusIndicator />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Example 7: Share Portfolio</h2>
        <SharePortfolio />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Example 8: Auto Mark Read</h2>
        <AutoMarkRead />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Example 10: Grouped Messages</h2>
        <GroupedMessagesDisplay />
      </section>
    </div>
  );
}
