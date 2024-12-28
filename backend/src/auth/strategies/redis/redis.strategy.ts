import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SessionsService } from '@src/sessions/sessions.service';
import { Strategy } from 'passport-local';
import { REDIS_AUTH_STRATEGY } from './redis.const';

@Injectable()
export class RedisSessionStrategy extends PassportStrategy(Strategy, REDIS_AUTH_STRATEGY) {
  constructor(private readonly sessionsService: SessionsService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return null;
    }

    const sessionData = await this.sessionsService.retrieveSession(token);
    return sessionData || null;
  }
}
