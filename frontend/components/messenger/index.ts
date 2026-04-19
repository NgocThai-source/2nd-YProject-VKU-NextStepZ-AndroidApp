export { default as ConversationList } from './conversation-list';
export { default as ChatArea } from './chat-area';
export { default as MessageInput } from './message-input';
export { default as ImagePreviewModal } from './image-preview-modal';
export { default as PortfolioSelectorModal } from './portfolio-selector-modal';
export { default as PortfolioCard } from './portfolio-card';

// Re-export types and hooks
export type { Message, Conversation, MessageType, MessageStatus } from '@/lib/messaging-context';
export { MessagingProvider, useMessaging } from '@/lib/messaging-context';
export { useMobileViewport } from './mobile-optimizations';
