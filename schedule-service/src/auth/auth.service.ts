import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

type ValidateTokenResponse = {
  data?: {
    validateToken?: {
      id: string;
      email: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  errors?: Array<{
    message: string;
  }>;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async validateToken(token: string) {
    const authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') ??
      'http://localhost:3001/graphql';

    const query = `
      query ValidateToken($token: String!) {
        validateToken(token: $token) {
          id
          email
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const response = await firstValueFrom(
        this.httpService.post<ValidateTokenResponse>(authServiceUrl, {
          query,
          variables: {
            token,
          },
        }),
      );

      const user = response.data.data?.validateToken;

      if (!user || response.data.errors?.length) {
        throw new UnauthorizedException('Invalid token');
      }

      return user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
