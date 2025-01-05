import { Controller, Get, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UserId } from '@src/auth/decorators/userId.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('unread')
  public async findUnreadNotifications(@UserId() userId: string) {
    return this.notificationsService.findUnreadNotifications(userId);
  }

  @Get(':id')
  public async getNotification(@UserId() userId: string, id: string) {
    return this.notificationsService.get(userId, id);
  }

  @Patch(':id/read')
  public async markAsRead(@UserId() userId: string, id: string) {
    return this.notificationsService.markAsRead(userId, id);
  }

  @Patch('read-all')
  public async markAllAsRead(@UserId() userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }
}
