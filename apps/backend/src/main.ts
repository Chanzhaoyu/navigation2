import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 启用安全头部中间件
  app.use(helmet());

  // 启用压缩中间件
  app.use(compression());

  // 设置全局前缀
  app.setGlobalPrefix('api');

  // 启用跨域资源共享
  app.enableCors();

  await app.listen(configService.get<number>('PORT') ?? 3000, '0.0.0.0');

  logger.log(`Server is running on: ${await app.getUrl()}`);
}

void bootstrap();
