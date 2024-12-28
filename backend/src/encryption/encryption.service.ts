import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  constructor() {}

  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public generateRandomString(length: number): string {
    if (length < 1) {
      throw new Error('Length must be greater than 0');
    }

    if (!Number.isInteger(length)) {
      throw new Error('Length must be an integer');
    }

    return randomBytes(length).toString('hex').slice(0, length);
  }
}
