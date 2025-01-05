import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { NotificationCreateData } from './notifications.interfaces';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  public async createNotification(userId: string, data: NotificationCreateData) {
    const notification = await this.notificationsRepository.createNotification(userId, data);
    try {
      await this.sendNotificationUsingGateway(notification);
    } catch (error) {
      this.logger.error(`Error sending notification: ${JSON.stringify(error)}`);
    }

    return notification;
  }

  public async markAsRead(userId: string, notificationId: string) {
    return this.notificationsRepository.markAsRead(userId, notificationId);
  }

  public async findUnreadNotifications(userId: string) {
    return this.notificationsRepository.findUnreadNotifications(userId);
  }

  public async findAll(userId: string) {
    return this.notificationsRepository.findAll(userId);
  }

  public async markAllAsRead(userId: string) {
    return this.notificationsRepository.markAllAsRead(userId);
  }

  public async get(userId: string, notificationId: string) {
    const notification = await this.notificationsRepository.get(userId, notificationId);
    if (!notification) {
      throw new NotFoundException(`Notification with id ${notificationId} not found`);
    }
    return notification;
  }

  private sendNotificationUsingGateway(notification: Notification) {
    return this.notificationsGateway.sendNotification(notification);
  }
}
