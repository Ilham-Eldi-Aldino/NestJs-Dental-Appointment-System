import { Module } from '@nestjs/common';

import { DoctorService } from './doctor.service';
import { DoctorResolver } from './doctor.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [DoctorResolver, DoctorService, PrismaService],
})
export class DoctorModule {}
