import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { UnprocessableEntityException } from '@nestjs/common';

describe(SessionsController.name, () => {
  let controller: SessionsController;

  const mockSessionsService = {
    getSessionsForUser: jest.fn(),
    deleteAllSessionsForUser: jest.fn(),
    deleteSession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [{ provide: SessionsService, useValue: mockSessionsService }],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  afterEach(jest.clearAllMocks);

  describe('getMySession', () => {
    it('should return all sessions for the user', async () => {
      const userId = 'testUserId';
      const mockSessions = [{ sessionId: 'session1' }, { sessionId: 'session2' }];
      mockSessionsService.getSessionsForUser.mockResolvedValue(mockSessions);

      const result = await controller.getMySessions(userId);

      expect(result).toEqual(mockSessions);
      expect(mockSessionsService.getSessionsForUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteAllSessions', () => {
    it('should delete all sessions for the user', async () => {
      const userId = 'testUserId';
      mockSessionsService.deleteAllSessionsForUser.mockResolvedValue(undefined);

      const result = await controller.deleteAllSessions(userId);

      expect(result).toBeUndefined();
      expect(mockSessionsService.deleteAllSessionsForUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteCurrentSession', () => {
    it('should delete the current session when sessionId is provided', async () => {
      const userId = 'testUserId';
      const sessionId = 'currentSessionId';
      mockSessionsService.deleteSession.mockResolvedValue(undefined);

      const result = await controller.deleteCurrentSession(userId, sessionId);

      expect(result).toBeUndefined();
      expect(mockSessionsService.deleteSession).toHaveBeenCalledWith(userId, sessionId);
    });

    it('should throw an exception if sessionId is not provided', async () => {
      const userId = 'testUserId';

      await expect(controller.deleteCurrentSession(userId)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('deleteSession', () => {
    it('should delete a session by ID', async () => {
      const userId = 'testUserId';
      const sessionId = 'specificSessionId';
      mockSessionsService.deleteSession.mockResolvedValue(undefined);

      const result = await controller.deleteSession(userId, sessionId);

      expect(result).toBeUndefined();
      expect(mockSessionsService.deleteSession).toHaveBeenCalledWith(userId, sessionId);
    });
  });
});
