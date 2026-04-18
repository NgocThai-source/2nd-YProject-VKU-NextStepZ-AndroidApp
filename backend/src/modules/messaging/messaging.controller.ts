import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingGateway } from './messaging.gateway';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateConversationDto, SendMessageDto } from './dto';

@Controller('messaging')
export class MessagingController {
    constructor(
        private readonly messagingService: MessagingService,
        private readonly messagingGateway: MessagingGateway,
    ) { }

    /**
     * Get all conversations for the current user
     * GET /messaging/conversations
     */
    @Get('conversations')
    @UseGuards(JwtAuthGuard)
    async getConversations(@Request() req: any) {
        const userId = req.user.userId;
        return this.messagingService.getConversations(userId);
    }

    /**
     * Get a single conversation with all messages
     * GET /messaging/conversations/:conversationId
     */
    @Get('conversations/:conversationId')
    @UseGuards(JwtAuthGuard)
    async getConversation(
        @Param('conversationId') conversationId: string,
        @Request() req: any,
    ) {
        const userId = req.user.userId;
        return this.messagingService.getConversation(userId, conversationId);
    }

    /**
     * Create a new conversation or get existing one
     * POST /messaging/conversations
     */
    @Post('conversations')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createConversation(
        @Body() dto: CreateConversationDto,
        @Request() req: any,
    ) {
        const userId = req.user.userId;
        return this.messagingService.createOrGetConversation(userId, dto);
    }

    /**
     * Send a message
     * POST /messaging/messages
     */
    @Post('messages')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async sendMessage(
        @Body() dto: SendMessageDto,
        @Request() req: any,
    ) {
        const userId = req.user.userId;
        const userRole = req.user.role;

        // Send message via service
        const message = await this.messagingService.sendMessage(userId, userRole, dto);

        // Get the other participant ID for broadcasting
        const conversation = await this.messagingService.getConversationParticipants(dto.conversationId);
        if (conversation) {
            const receiverId = conversation.participant1Id === userId
                ? conversation.participant2Id
                : conversation.participant1Id;

            // Broadcast to WebSocket clients
            this.messagingGateway.broadcastMessage(dto.conversationId, message, userId, receiverId);
        }

        return message;
    }

    /**
     * Mark all messages in a conversation as read
     * PATCH /messaging/conversations/:conversationId/read
     */
    @Patch('conversations/:conversationId/read')
    @UseGuards(JwtAuthGuard)
    async markConversationAsRead(
        @Param('conversationId') conversationId: string,
        @Request() req: any,
    ) {
        const userId = req.user.userId;
        return this.messagingService.markConversationAsRead(userId, conversationId);
    }

    /**
     * Mark a single message as read
     * PATCH /messaging/messages/:messageId/read
     */
    @Patch('messages/:messageId/read')
    @UseGuards(JwtAuthGuard)
    async markMessageAsRead(
        @Param('messageId') messageId: string,
        @Request() req: any,
    ) {
        const userId = req.user.userId;
        return this.messagingService.markMessageAsRead(userId, messageId);
    }

    /**
     * Get portfolio data for a message (public endpoint for viewing shared portfolios)
     * GET /messaging/portfolios/:portfolioId
     */
    @Get('portfolios/:portfolioId')
    @UseGuards(JwtAuthGuard)
    async getPortfolio(@Param('portfolioId') portfolioId: string) {
        return this.messagingService.getPortfolioForMessage(portfolioId);
    }
}
