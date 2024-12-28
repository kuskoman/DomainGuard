import { Request } from 'express';

export interface RequestWithAuth extends Request {
  userId?: string;
  sessionId?: string;
  authorization?: string;
}
