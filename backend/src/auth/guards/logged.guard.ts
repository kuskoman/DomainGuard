import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { EncryptionService } from '@src/encryption/encryption.service';
import { AuthJwtPayload } from '../auth.interfaces';

@Injectable()
export class LoggedGuard implements CanActivate {
  private readonly logger = new Logger(LoggedGuard.name);
  constructor(private readonly encryptionService: EncryptionService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.encryptionService.verify<AuthJwtPayload>(token);
      request.userId = payload.sub;
    } catch (e) {
      this.logger.error('Error while verifying token');
      this.logger.error(e);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromRequest(request: Request): string {
    const authHeader = request?.headers?.authorization;
    if (!authHeader) {
      return '';
    }

    const [type, token] = authHeader.split(' ') || [];
    return type === 'Bearer' ? token : '';
  }
}
