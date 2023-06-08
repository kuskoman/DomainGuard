import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DbService } from './db.service';

describe(DbService.name, () => {
  let service: DbService;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DbService],
    }).compile();

    app = moduleRef.createNestApplication();
    service = moduleRef.get<DbService>(DbService);
  });

  describe('onModuleInit', () => {
    it('should connect to the database', async () => {
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue();

      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe('enableShutdownHooks', () => {
    it('should close the app before exiting', async () => {
      const beforeExitSpy = jest.spyOn(service, '$on');
      const closeSpy = jest.spyOn(app, 'close').mockResolvedValue();

      await service.enableShutdownHooks(app);

      expect(beforeExitSpy).toHaveBeenCalled();
      await app.close();

      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
