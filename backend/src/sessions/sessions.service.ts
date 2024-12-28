import { Inject, Injectable, Logger } from '@nestjs/common';
import { BaseConfig, baseConfig } from '@src/config/base.config';
import { EncryptionService } from '@src/encryption/encryption.service';
import { RedisService } from '@src/lib/redis/redis.service';
import { RetrieveSessionPayload, SessionData } from './sessions.interfaces';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  private readonly sessionTime: number;

  constructor(
    @Inject(baseConfig.KEY) { sessionTime }: BaseConfig,
    private readonly encryptionService: EncryptionService,
    private readonly redisService: RedisService,
  ) {
    this.sessionTime = sessionTime;
  }

  /**
   * Create a new session for the user
   * @param userId The user ID
   * @returns The session token, that can be used to authenticate the session
   *
   * This method creates a new session for the user with the given ID. It generates a unique session ID, creates a session secret, and stores the session hash in Redis.
   * Some technical terms used in this method:
   * - Session ID: A unique identifier for the session. It is generated using the generateUniqueSessionId method. Can be safely shared, as it is not sensitive information.
   * - Session secret: A secret value that is used to authenticate the session. It is generated using the encryptionService.generateRandomString method. It is a sensitive value and should not be shared. Not saved on server, only returned to the client.
   * - Session hash: A hash of the session secret. It is generated using the encryptionService.hash method. It is stored in Redis and used for session verification.
   * - Redis key: The key used to store the session hash in Redis. It is generated using the getSessionKey method.
   * - Session token: A combination of the user ID, session ID, and session secret. It is returned to the client and used for authentication. Encoded in base64 format for transport.
   */
  public async createSession(userId: string) {
    const sessionId = await this.generateUniqueSessionId(userId);
    const sessionSecret = this.encryptionService.generateRandomString(32);
    const sessionHash = await this.encryptionService.hash(sessionSecret);
    const sessionKey = this.getSessionKey(userId, sessionId);

    await this.setSession(sessionKey, sessionHash);
    this.logger.log(`Session created for user ${userId}`);

    const sessionToken = `${userId}:${sessionId}:${sessionSecret}`;
    const sessionTokenB64 = Buffer.from(sessionToken).toString('base64');
    return sessionTokenB64;
  }

  /**
   * Retrieve the session data from the session token
   * @param base64SessionToken The session token encoded in base64 format, received from the client.
   * @returns The session data, if the session is valid. Null otherwise.
   */
  public async retrieveSession(base64SessionToken: string): Promise<RetrieveSessionPayload | null> {
    const sessionToken = Buffer.from(base64SessionToken, 'base64').toString();
    const [userId, sessionId, sessionSecret] = sessionToken.split(':');
    const sessionKey = this.getSessionKey(userId, sessionId);
    const sessionData = await this.getSession(sessionKey);
    if (!sessionData) {
      return null;
    }

    const isValid = await this.encryptionService.compare(sessionSecret, sessionData.sessionHash);
    if (!isValid) {
      return null;
    }

    return { userId, sessionId };
  }

  /**
   * Deletes a session for a user.
   *
   * @overload
   * Deletes a session using the user ID and session ID.
   * @param userId The user ID.
   * @param sessionId The session ID.
   * @returns A promise that resolves when the session is successfully deleted.
   *
   * @overload
   * Deletes a session using a base64-encoded session token.
   * @param base64SessionToken The base64-encoded session token (userId:sessionId:sessionSecret).
   * @returns A promise that resolves when the session is successfully deleted.
   *
   * This method deletes a session for the user, either by specifying the user ID and session ID
   * or by providing a base64-encoded session token. It removes the session hash from Redis.
   */
  public async deleteSession(userId: string, sessionId: string): Promise<void>;
  public async deleteSession(base64SessionToken: string): Promise<void>;
  public async deleteSession(userIdOrToken: string, sessionId?: string): Promise<void> {
    let userId: string;
    if (sessionId) {
      userId = userIdOrToken;
    } else {
      const sessionToken = Buffer.from(userIdOrToken, 'base64').toString();
      [userId, sessionId] = sessionToken.split(':');
    }

    const sessionKey = this.getSessionKey(userId, sessionId);
    await this.redisService.del(sessionKey);
    this.logger.log(`Session deleted for user ${userId}`);
  }

  public async getSessionsForUser(userId: string) {
    const sessionKeys = await this.getAllSessionKeys(userId);
    const sessions = await Promise.all(sessionKeys.map((key) => this.getSession(key)));
    return sessions.filter((session) => session !== null);
  }

  public async deleteAllSessionsForUser(userId: string) {
    const sessionKeys = await this.getAllSessionKeys(userId);
    await Promise.all(sessionKeys.map((key) => this.redisService.del(key)));
    this.logger.log(`All sessions deleted for user ${userId}`);
  }

  private async getAllSessionKeys(userId: string) {
    return await this.redisService.listKeys(`session:${userId}:*`);
  }

  private async generateUniqueSessionId(userId: string): Promise<string> {
    const id = this.encryptionService.generateRandomString(10);
    const key = this.getSessionKey(userId, id);
    const exists = await this.redisService.exists(key);
    if (exists) {
      return await this.generateUniqueSessionId(userId);
    }

    return id;
  }

  private getSessionKey(userId: string, sessionId: string) {
    return `session:${userId}:${sessionId}`;
  }

  private async setSession(sessionId: string, sessionHash: string) {
    const sessionData = { sessionHash, createdAt: new Date().toISOString() };
    const stringifiedSessionData = JSON.stringify(sessionData);
    return this.redisService.set(sessionId, stringifiedSessionData, this.sessionTime);
  }

  private async getSession(sessionKey: string): Promise<SessionData | null> {
    const sessionData = await this.redisService.get(sessionKey);
    if (!sessionData) {
      return null;
    }

    const parsedSessionData = JSON.parse(sessionData);
    return {
      ...parsedSessionData,
      createdAt: new Date(parsedSessionData.createdAt),
    };
  }
}
