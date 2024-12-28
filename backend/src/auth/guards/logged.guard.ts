import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SessionsService } from '@src/sessions/sessions.service';

@Injectable()
export class LoggedGuard implements CanActivate {
  private readonly logger = new Logger(LoggedGuard.name);

  constructor(private readonly sessionsService: SessionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { userId?: string; sessionId?: string }>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.error('Missing or invalid authorization header');
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const sessionData = await this.sessionsService.retrieveSession(token);

    if (!sessionData) {
      this.logger.error('Invalid session token');
      throw new UnauthorizedException('Invalid session token');
    }

    request.userId = sessionData.userId;
    request.sessionId = sessionData.sessionId;

    this.logger.verbose(`Authenticated request for userId: ${request.userId}, sessionId: ${request.sessionId}`);
    return true;
  }
}
