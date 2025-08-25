import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NavigationService } from './navigation.service';
import { NavigationController } from './navigation.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}), // Empty config, will use global config
  ],
  controllers: [NavigationController],
  providers: [NavigationService],
  exports: [NavigationService],
})
export class NavigationModule {}
