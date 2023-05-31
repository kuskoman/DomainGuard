import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  constructor(private readonly jwtService: JwtService) {}

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public sign(payload: Record<string, unknown>): string {
    return this.jwtService.sign(payload);
  }

  public verify(token: string): Record<string, unknown> {
    return this.jwtService.verify(token);
  }
}
