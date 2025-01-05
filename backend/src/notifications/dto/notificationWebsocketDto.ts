import { Notification } from '@prisma/client';

export class NotificationWebsocketDto {
  id: string;
  message: string;
  topic: string;
  status: string;
  createdAt: Date;

  constructor(notification: Notification) {
    this.id = notification.id;
    this.message = notification.message;
    this.topic = notification.topic;
    this.status = notification.status;
    this.createdAt = notification.createdAt;
  }
}
