import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './encryption.interfaces';

@Injectable()
export class EncryptionService {
  constructor(private readonly jwtService: JwtService) {}

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public sign<T extends object = JwtPayload>(payload: T, expiresIn = 3600): string {
    return this.jwtService.sign(payload, { expiresIn });
  }

  public verify<T extends object = JwtPayload>(token: string): T {
    return this.jwtService.verify(token);
  }
}
