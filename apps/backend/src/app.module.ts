import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from 'src/prisma/prisma.module';
import { validate } from 'src/common/config/configuration';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { NavigationModule } from './navigation/navigation.module';
import { QuicklinkModule } from './quicklink/quicklink.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 10 }],
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    CategoryModule,
    NavigationModule,
    QuicklinkModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
