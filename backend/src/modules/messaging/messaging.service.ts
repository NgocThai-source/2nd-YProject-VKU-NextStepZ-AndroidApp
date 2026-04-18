import {
    Injectable,
    BadRequestException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConversationDto, SendMessageDto } from './dto';

@Injectable()
export class MessagingService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all conversations for a user
     * Returns conversations with last message and unread count
     */
    async getConversations(userId: string) {
        // Get all conversations where user is participant1 or participant2
        const conversations = await this.prisma.conversation.findMany({
            where: {
                OR: [
                    { participant1Id: userId },
                    { participant2Id: userId },
                ],
            },
            include: {
                participant1: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                        companyName: true,
                    },
                },
                participant2: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                        companyName: true,
                    },
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        // Transform to include participant info and unread count
        const transformedConversations = await Promise.all(
            conversations.map(async (conv) => {
                // Determine the other participant
                const otherParticipant =
                    conv.participant1Id === userId ? conv.participant2 : conv.participant1;

                // Get unread count for this conversation
                const unreadCount = await this.prisma.message.count({
                    where: {
                        conversationId: conv.id,
                        senderId: { not: userId },
                        isRead: false,
                    },
                });

                // Get participant display name
                const participantName = otherParticipant.role === 'employer'
                    ? otherParticipant.companyName || otherParticipant.username
                    : otherParticipant.firstName && otherParticipant.lastName
                        ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
                        : otherParticipant.username;

                return {
                    id: conv.id,
                    participantId: otherParticipant.id,
                    participantName,
                    participantAvatar: otherParticipant.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant.id}`,
                    participantRole: otherParticipant.role,
                    lastMessage: conv.messages[0] || null,
                    unreadCount,
                    createdAt: conv.createdAt,
                    updatedAt: conv.updatedAt,
                };
            })
        );

        return transformedConversations;
    }

    /**
     * Get a single conversation with all messages
     */
    async getConversation(userId: string, conversationId: string) {
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [
                    { participant1Id: userId },
                    { participant2Id: userId },
                ],
            },
            include: {
                participant1: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                        companyName: true,
                    },
                },
                participant2: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                        companyName: true,
                    },
                },
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                                role: true,
                                companyName: true,
                            },
                        },
                    },
                },
            },
        });

        if (!conversation) {
            throw new NotFoundException('Cuộc trò chuyện không tồn tại');
        }

        // Determine the other participant
        const otherParticipant =
            conversation.participant1Id === userId
                ? conversation.participant2
                : conversation.participant1;

        const currentUser =
            conversation.participant1Id === userId
                ? conversation.participant1
                : conversation.participant2;

        // Get participant display name
        const participantName = otherParticipant.role === 'employer'
            ? otherParticipant.companyName || otherParticipant.username
            : otherParticipant.firstName && otherParticipant.lastName
                ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
                : otherParticipant.username;

        // Transform messages with sender info and fetch portfolio data
        const transformedMessages = await Promise.all(conversation.messages.map(async (msg) => {
            const senderName = msg.sender.role === 'employer'
                ? msg.sender.companyName || msg.sender.username
                : msg.sender.firstName && msg.sender.lastName
                    ? `${msg.sender.firstName} ${msg.sender.lastName}`
                    : msg.sender.username;

            // Fetch portfolio data if message type is portfolio
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let portfolioData: any = null;
            if (msg.type === 'portfolio' && msg.portfolioId) {
                try {
                    portfolioData = await this.prisma.savedPortfolio.findUnique({
                        where: { id: msg.portfolioId },
                    });
                } catch {
                    // Portfolio might have been deleted, return null
                    portfolioData = null;
                }
            }

            return {
                id: msg.id,
                conversationId: msg.conversationId,
                senderId: msg.senderId,
                senderName,
                senderAvatar: msg.sender.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`,
                content: msg.content,
                type: msg.type,
                imageUrl: msg.imageUrl,
                portfolioId: msg.portfolioId,
                portfolioData,
                isRead: msg.isRead,
                timestamp: msg.createdAt,
                status: msg.isRead ? 'read' : 'sent',
            };
        }));

        // Get unread count
        const unreadCount = await this.prisma.message.count({
            where: {
                conversationId: conversation.id,
                senderId: { not: userId },
                isRead: false,
            },
        });

        return {
            id: conversation.id,
            participantId: otherParticipant.id,
            participantName,
            participantAvatar: otherParticipant.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant.id}`,
            participantRole: otherParticipant.role,
            isOnline: false, // TODO: Implement online status
            messages: transformedMessages,
            unreadCount,
            currentUser: {
                id: currentUser.id,
                name: currentUser.role === 'employer'
                    ? currentUser.companyName || currentUser.username
                    : currentUser.firstName && currentUser.lastName
                        ? `${currentUser.firstName} ${currentUser.lastName}`
                        : currentUser.username,
                avatar: currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`,
            },
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
        };
    }

    /**
     * Create a new conversation or get existing one
     */
    async createOrGetConversation(userId: string, dto: CreateConversationDto) {
        const { participantId } = dto;

        // Prevent self-conversation
        if (userId === participantId) {
            throw new BadRequestException('Không thể tạo cuộc trò chuyện với chính mình');
        }

        // Check if participant exists
        const participant = await this.prisma.user.findUnique({
            where: { id: participantId },
        });

        if (!participant) {
            throw new NotFoundException('Người dùng không tồn tại');
        }

        // Check for existing conversation (in either direction)
        let conversation = await this.prisma.conversation.findFirst({
            where: {
                OR: [
                    { participant1Id: userId, participant2Id: participantId },
                    { participant1Id: participantId, participant2Id: userId },
                ],
            },
        });

        // Create new conversation if not exists
        if (!conversation) {
            conversation = await this.prisma.conversation.create({
                data: {
                    participant1Id: userId,
                    participant2Id: participantId,
                },
            });
        }

        // Return full conversation data
        return this.getConversation(userId, conversation.id);
    }

    /**
     * Send a message in a conversation
     */
    async sendMessage(userId: string, userRole: string, dto: SendMessageDto) {
        const { conversationId, content, type, imageUrl, portfolioId } = dto;

        // Check if conversation exists and user is a participant
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [
                    { participant1Id: userId },
                    { participant2Id: userId },
                ],
            },
        });

        if (!conversation) {
            throw new NotFoundException('Cuộc trò chuyện không tồn tại');
        }

        // Role-based restriction: Employers cannot send portfolios
        if (type === 'portfolio' && userRole === 'employer') {
            throw new ForbiddenException('Nhà tuyển dụng không thể chia sẻ hồ sơ');
        }

        // Create the message
        const message = await this.prisma.message.create({
            data: {
                conversationId,
                senderId: userId,
                content,
                type,
                imageUrl: type === 'image' ? imageUrl : null,
                portfolioId: type === 'portfolio' ? portfolioId : null,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                        companyName: true,
                    },
                },
            },
        });

        // Update conversation's updatedAt
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        // Transform message response
        const senderName = message.sender.role === 'employer'
            ? message.sender.companyName || message.sender.username
            : message.sender.firstName && message.sender.lastName
                ? `${message.sender.firstName} ${message.sender.lastName}`
                : message.sender.username;

        return {
            id: message.id,
            conversationId: message.conversationId,
            senderId: message.senderId,
            senderName,
            senderAvatar: message.sender.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderId}`,
            content: message.content,
            type: message.type,
            imageUrl: message.imageUrl,
            portfolioId: message.portfolioId,
            isRead: message.isRead,
            timestamp: message.createdAt,
            status: 'sent',
        };
    }

    /**
     * Mark all messages in a conversation as read
     */
    async markConversationAsRead(userId: string, conversationId: string) {
        // Verify user is a participant
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [
                    { participant1Id: userId },
                    { participant2Id: userId },
                ],
            },
        });

        if (!conversation) {
            throw new NotFoundException('Cuộc trò chuyện không tồn tại');
        }

        // Mark all messages from the other participant as read
        await this.prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: userId },
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        return { success: true };
    }

    /**
     * Mark a single message as read
     */
    async markMessageAsRead(userId: string, messageId: string) {
        const message = await this.prisma.message.findFirst({
            where: {
                id: messageId,
                senderId: { not: userId },
            },
            include: {
                conversation: true,
            },
        });

        if (!message) {
            throw new NotFoundException('Tin nhắn không tồn tại');
        }

        // Verify user is the recipient
        const isParticipant =
            message.conversation.participant1Id === userId ||
            message.conversation.participant2Id === userId;

        if (!isParticipant) {
            throw new ForbiddenException('Không có quyền truy cập tin nhắn này');
        }

        await this.prisma.message.update({
            where: { id: messageId },
            data: { isRead: true },
        });

        return { success: true };
    }

    /**
     * Get portfolio data for a message
     */
    async getPortfolioForMessage(portfolioId: string) {
        const portfolio = await this.prisma.savedPortfolio.findUnique({
            where: { id: portfolioId },
        });

        if (!portfolio) {
            return null;
        }

        return {
            id: portfolio.id,
            name: portfolio.name,
            title: portfolio.title,
            headline: portfolio.headline,
            photoUrl: portfolio.photoUrl,
            selectedTemplate: portfolio.selectedTemplate,
        };
    }

    /**
     * Get conversation participants (helper for WebSocket broadcasting)
     */
    async getConversationParticipants(conversationId: string) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            select: {
                participant1Id: true,
                participant2Id: true,
            },
        });

        return conversation;
    }
}
