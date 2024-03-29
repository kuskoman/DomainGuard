import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BaseConfig, baseConfig } from './config/base.config';
import 'source-map-support/register';
import { setupSwagger } from './swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const bootstrap = async () => {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

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

  await app.listen(port, () => {
    logger.log(`Server listening on http://localhost:${port}`);
  });
};

bootstrap();
