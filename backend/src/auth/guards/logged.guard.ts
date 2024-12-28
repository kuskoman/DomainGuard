import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggedGuard implements CanActivate {
  private readonly logger = new Logger(LoggedGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!this.isRequestWithUser(request)) {
      this.logger.error('User not authenticated');
      throw new UnauthorizedException('User not authenticated');
    }

    this.logger.verbose(`Authenticated request for userId: ${request.userId}, sessionId: ${request.sessionId}`);
    return true;
  }

  private isRequestWithUser(request: Request): request is Request & { userId: string; sessionId: string } {
    const requestAsAny = request as any;
    return typeof requestAsAny.userId === 'string' && typeof requestAsAny.sessionId === 'string';
  }
}
