import { Controller, Delete, Get, Param, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { LoggedGuard } from '@src/auth/guards/logged.guard';
import { SessionsService } from './sessions.service';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from '@src/auth/decorators/userId.decorator';
import { SessionId } from '@src/auth/decorators/sessionId.decorator';

@ApiTags('sessions')
@Controller('sessions')
@UseGuards(LoggedGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('all')
  async getMySession(@UserId() userId: string) {
    return await this.sessionsService.getSessionsForUser(userId);
  }

  @Delete('all')
  async deleteAllSessions(@UserId() userId: string) {
    return await this.sessionsService.deleteAllSessionsForUser(userId);
  }

  @Delete('current')
  async deleteCurrentSession(@UserId() userId: string, @SessionId() sessionId?: string) {
    if (!sessionId) {
      throw new UnprocessableEntityException('Could not determine session to delete');
    }
    return await this.sessionsService.deleteSession(userId, sessionId);
  }

  @Delete(':id')
  async deleteSession(@UserId() userId: string, @Param('sessionId') sessionId: string) {
    return await this.sessionsService.deleteSession(userId, sessionId);
  }
}
