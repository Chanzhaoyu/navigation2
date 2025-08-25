import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { QuicklinkService } from './quicklink.service';
import { QuicklinkController } from './quicklink.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}), // Empty config, will use global config
  ],
  controllers: [QuicklinkController],
  providers: [QuicklinkService],
  exports: [QuicklinkService],
})
export class QuicklinkModule {}
