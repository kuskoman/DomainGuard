import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BaseConfig, baseConfig } from './config/base.config';
import 'source-map-support/register';
import { setupSwagger } from './swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestTransportLogger, DefaultTransportConsole } from 'nest-logging-transport';

const bootstrap = async () => {
  const customLogger = new NestTransportLogger({
    transports: [new DefaultTransportConsole('DG')],
  });
  const app = await NestFactory.create(AppModule, {
    logger: customLogger,
    bufferLogs: true,
  });

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  };
  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe());
  const { port, swaggerEnabled } = app.get<BaseConfig>(baseConfig.KEY);

  if (swaggerEnabled) {
    setupSwagger(app);
  }

  const logger = new Logger('Bootstrap');

  await app.listen(port, () => {
    logger.log(`Server listening on http://localhost:${port}`);
    swaggerEnabled && logger.log(`Swagger available on http://localhost:${port}/api`);
  });
};

bootstrap();
