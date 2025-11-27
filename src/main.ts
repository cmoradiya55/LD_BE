import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import { Logger, ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './common/utils/validation.utils';
import { getLogLevels } from './common/utils/logger.utils';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(),
  });

  const prefix = 'api/v1';
  const config = app.get(ConfigService);
  const port = config.get('app.port') || 3000;

  app.use(helmet()); // Secure your app by setting various HTTP headers
  app.use(compression()); // Enable gzip compression

  // Enable CORS
  app.enableCors({
    origin: config.getOrThrow<string>('app.corsOrigin'),
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    })
  );

  app.setGlobalPrefix(prefix);
  app.enableShutdownHooks();

  app.useGlobalFilters(new AllExceptionsFilter(logger));



  // -------------------------
  // Dummy route for testing
  // -------------------------
  app.getHttpAdapter()?.get('/', (req, res) => {
    res.json({
      message: 'OK from Link Car',
    });
  });

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${prefix}`);
}
bootstrap();
