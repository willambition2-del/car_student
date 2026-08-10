import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression = require('compression');
import cookieParser = require('cookie-parser');

import { ValidationPipe } from './common/pipes/validation.pipe';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api/v1');
  const corsOrigins = configService.get<string[]>('cors.origins', []);
  const swaggerEnabled = configService.get<boolean>('swagger.enabled', true);

  // Security & Optimization
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix(apiPrefix);

  // Global Pipes, Filters, Interceptors
  app.useGlobalPipes(ValidationPipe);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());

  // Swagger setup
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('School Transport API')
      .setDescription('The SaaS School Transport Management Platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  }

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
  if (swaggerEnabled) {
    logger.log(`Swagger UI is running on: http://localhost:${port}/${apiPrefix}/docs`);
  }
}
bootstrap();
