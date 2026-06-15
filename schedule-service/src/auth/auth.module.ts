import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [HttpModule],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
