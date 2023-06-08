import { Request } from 'express';

export interface AuthJwtPayload {
  email: string;
  sub: string;
}

export interface RequestWithAuth extends Request {
  userId?: string;
  authorization?: string;
}
