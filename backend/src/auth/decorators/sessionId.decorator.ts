import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithAuth } from '../auth.interfaces';

export const SessionId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string | undefined => {
  const request = ctx.switchToHttp().getRequest<RequestWithAuth>();
  if (!request.userId) {
    throw new Error('Session id not found in request');
  }

  return request.sessionId;
});
