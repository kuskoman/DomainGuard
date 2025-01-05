import { Injectable } from '@nestjs/common';
import { NotificationStatus } from '@prisma/client';
import { DbService } from '@src/lib/db/db.service';
import { NotificationCreateData } from './notifications.interfaces';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly dbService: DbService) {}

  public async createNotification(userId: string, data: NotificationCreateData) {
    return await this.dbService.notification.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  public async get(userId: string, notificationId: string) {
    return await this.dbService.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  public async markAsRead(userId: string, notificationId: string) {
    return await this.dbService.notification.update({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        status: NotificationStatus.READ,
      },
    });
  }

  public async findUnreadNotifications(userId: string) {
    return await this.dbService.notification.findMany({
      where: {
        userId,
        status: NotificationStatus.UNREAD,
      },
    });
  }

  public async markAllAsRead(userId: string) {
    return await this.dbService.notification.updateMany({
      where: {
        userId,
        status: NotificationStatus.UNREAD,
      },
      data: {
        status: NotificationStatus.READ,
      },
    });
  }
}
