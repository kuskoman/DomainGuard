import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SessionsService } from '@src/sessions/sessions.service';
import { Notification } from '@prisma/client';
import { GetNotificationDto } from './dto/getNotificationDto';

@WebSocketGateway({ namespace: 'api/notifications', cors: true })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server | undefined;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly sessionsService: SessionsService) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;

    if (!token) {
      this.logger.error(`Missing token for client: ${client.id}`);
      client.disconnect();
      return;
    }

    try {
      const session = await this.sessionsService.retrieveSession(token);
      if (!session) {
        throw new UnauthorizedException('Invalid session token');
      }

      client.join(session.userId); // Add the client to a room identified by their userId
      this.logger.log(`User connected: ${session.userId} (Socket: ${client.id})`);
    } catch (error: unknown) {
      this.logger.error(`Unauthorized connection attempt: ${JSON.stringify(error)}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userRooms = Array.from(client.rooms).filter((room) => room !== client.id);
    userRooms.forEach((room) => client.leave(room));
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async sendNotification(notification: Notification) {
    this.logger.verbose(`Sending notification ${notification.id} to user: ${notification.userId}`);
    const { userId } = notification;
    const notificationDto = new GetNotificationDto(notification);
    const server = this.getServer();
    this.logger.verbose(`Sending notification to user: ${userId}`);
    server.to(userId).emit('notification', notificationDto);
  }

  private getServer() {
    if (!this.server) {
      throw new Error('Socket server is not initialized');
    }

    return this.server;
  }
}
