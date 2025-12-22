import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './common/utils/validation.utils';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const prefix = config.getOrThrow<string>('app.apiPrefix');
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const port = config.get('app.port') || 3000;

  app.use(helmet()); // Secure your app by setting various HTTP headers
  app.use(compression()); // Enable gzip compression

  // Enable CORS
  app.enableCors({
    origin: config.getOrThrow<Array<string>>('app.corsOrigin'),
    credentials: true
  });
  // enable cookie parser
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    })
  );

  app.setGlobalPrefix(prefix);
  app.enableShutdownHooks();

  app.useLogger(logger);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, logger));

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
bootstrap().catch((err) => {
  console.error('Error during app bootstrap:', err);
  process.exit(1);
});
