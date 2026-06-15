import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { SignOptions } from 'jsonwebtoken';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret =
          configService.get<string>('JWT_SECRET') ?? 'fallback-secret';

        const jwtExpiresIn =
          configService.get<string>('JWT_EXPIRES_IN') ?? '1d';

        const signOptions: SignOptions = {
          expiresIn: jwtExpiresIn as SignOptions['expiresIn'],
        };

        return {
          secret: jwtSecret,
          signOptions,
        };
      },
    }),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
