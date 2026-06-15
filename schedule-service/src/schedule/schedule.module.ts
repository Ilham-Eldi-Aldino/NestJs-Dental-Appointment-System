import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { ScheduleService } from './schedule.service';
import { ScheduleResolver } from './schedule.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,

    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [ScheduleResolver, ScheduleService, PrismaService],
})
export class ScheduleModule {}
