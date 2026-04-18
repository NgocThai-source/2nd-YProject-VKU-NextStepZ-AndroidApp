import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedSocket extends Socket {
    userId?: string;
    userRole?: string;
}

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
    },
    namespace: '/messaging',
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // Map to track connected users: userId -> socketId[]
    private connectedUsers: Map<string, string[]> = new Map();

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async handleConnection(client: AuthenticatedSocket) {
        try {
            // Get token from handshake auth or query
            const token = client.handshake.auth?.token || client.handshake.query?.token;



            if (!token || typeof token !== 'string') {

                client.disconnect();
                return;
            }

            // Verify JWT token
            const secret = this.configService.get<string>('JWT_SECRET');


            const payload = this.jwtService.verify(token, { secret });


            client.userId = payload.userId || payload.sub;
            client.userRole = payload.role;

            if (!client.userId) {

                client.disconnect();
                return;
            }

            // Add user to connected users map
            const existingSockets = this.connectedUsers.get(client.userId) || [];
            const wasOffline = existingSockets.length === 0;
            existingSockets.push(client.id);
            this.connectedUsers.set(client.userId, existingSockets);

            // Join user to their personal room for receiving messages
            client.join(`user:${client.userId}`);

            // Broadcast online status if user just came online
            if (wasOffline) {
                this.server.emit('userOnline', { userId: client.userId });
            }


        } catch (error) {

            client.disconnect();
        }
    }

    handleDisconnect(client: AuthenticatedSocket) {
        if (client.userId) {
            // Remove socket from connected users
            const existingSockets = this.connectedUsers.get(client.userId) || [];
            const updatedSockets = existingSockets.filter(id => id !== client.id);

            if (updatedSockets.length > 0) {
                this.connectedUsers.set(client.userId, updatedSockets);
            } else {
                this.connectedUsers.delete(client.userId);
                // Broadcast offline status if user has no more connections
                this.server.emit('userOffline', { userId: client.userId });
            }


        }
    }

    /**
     * Handle joining a conversation room
     */
    @SubscribeMessage('joinConversation')
    handleJoinConversation(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() data: { conversationId: string },
    ) {
        if (!client.userId) return;

        client.join(`conversation:${data.conversationId}`);


        return { success: true };
    }

    /**
     * Handle leaving a conversation room
     */
    @SubscribeMessage('leaveConversation')
    handleLeaveConversation(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() data: { conversationId: string },
    ) {
        if (!client.userId) return;

        client.leave(`conversation:${data.conversationId}`);


        return { success: true };
    }

    /**
     * Broadcast a new message to conversation participants
     * Called from MessagingService when a message is sent
     */
    broadcastMessage(conversationId: string, message: any, senderId: string, receiverId: string) {
        // Emit to conversation room (all participants viewing this conversation)
        this.server.to(`conversation:${conversationId}`).emit('newMessage', message);

        // Also emit to receiver's personal room (for notifications/unread count updates)
        this.server.to(`user:${receiverId}`).emit('messageReceived', {
            conversationId,
            message,
        });


    }

    /**
     * Notify when messages are marked as read
     */
    broadcastMessagesRead(conversationId: string, readerId: string) {
        this.server.to(`conversation:${conversationId}`).emit('messagesRead', {
            conversationId,
            readerId,
        });
    }

    /**
     * Check if a user is online
     */
    isUserOnline(userId: string): boolean {
        return this.connectedUsers.has(userId);
    }

    /**
     * Get all online user IDs
     */
    getOnlineUsers(): string[] {
        return Array.from(this.connectedUsers.keys());
    }

    /**
     * Broadcast a new notification to a specific user
     * Called from NotificationService when a notification is created
     */
    broadcastNotification(userId: string, notification: any) {
        // Emit to user's personal room
        this.server.to(`user:${userId}`).emit('newNotification', notification);
    }

    /**
     * Broadcast saved item update to a specific user
     * Called from SavedItemsService when an item is saved/unsaved
     */
    broadcastSavedItemUpdate(userId: string, data: any) {
        // Emit to user's personal room
        this.server.to(`user:${userId}`).emit('savedItemUpdate', data);
    }

    /**
     * Broadcast a new report to all connected admin users
     * Called from ReportService when a new report is created
     */
    broadcastNewReport(report: any) {
        // Emit to all connected clients - admins will filter on frontend
        // We broadcast to all users but only the admin page listens for this event
        this.server.emit('newReport', report);
    }

    /**
     * Broadcast report status update (resolved/dismissed)
     * Called from AdminReportsController when a report is processed
     */
    broadcastReportUpdate(reportId: string, status: string, actionTaken?: string) {
        this.server.emit('reportUpdate', { reportId, status, actionTaken });
    }
}
