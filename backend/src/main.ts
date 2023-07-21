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

  // Add this section to enable CORS
  const corsOptions: CorsOptions = {
    origin: '*', // Change this to specific origin(s) if required
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
