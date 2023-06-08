import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithAuth } from '../auth.interfaces';

export const UserId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<RequestWithAuth>();
  if (!request.userId) {
    throw new Error('User id not found in request');
  }

  return request.userId;
});
