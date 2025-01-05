import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UserId } from '@src/auth/decorators/userId.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetNotificationDto } from './dto/getNotificationDto';
import { LoggedGuard } from '@src/auth/guards/logged.guard';

@Controller('notifications')
@ApiTags('notifications')
@UseGuards(LoggedGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('unread')
  @ApiOkResponse({ type: [GetNotificationDto] })
  public async findUnreadNotifications(@UserId() userId: string): Promise<GetNotificationDto[]> {
    const notifications = await this.notificationsService.findUnreadNotifications(userId);
    return notifications.map((notification) => new GetNotificationDto(notification));
  }

  @Get()
  @ApiOkResponse({ type: [GetNotificationDto] })
  public async findAll(@UserId() userId: string): Promise<GetNotificationDto[]> {
    const notifications = await this.notificationsService.findAll(userId);
    return notifications.map((notification) => new GetNotificationDto(notification));
  }

  @Get(':id')
  @ApiOkResponse({ type: GetNotificationDto })
  public async getNotification(@UserId() userId: string, @Param('id') id: string): Promise<GetNotificationDto> {
    const notification = await this.notificationsService.get(userId, id);
    return new GetNotificationDto(notification);
  }

  @Patch(':id/read')
  @ApiOkResponse({ type: GetNotificationDto })
  public async markAsRead(@UserId() userId: string, @Param('id') id: string): Promise<GetNotificationDto> {
    const notification = await this.notificationsService.markAsRead(userId, id);
    return new GetNotificationDto(notification);
  }

  @Patch('read-all')
  @ApiOkResponse({ type: [GetNotificationDto] })
  public async markAllAsRead(@UserId() userId: string): Promise<GetNotificationDto[]> {
    await this.notificationsService.markAllAsRead(userId);
    return await this.findAll(userId);
  }
}
