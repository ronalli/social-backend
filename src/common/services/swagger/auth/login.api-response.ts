import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LoginViewModel } from '../../../../features/auth/domain/login.view-model';

export function LoginApiResponse() {

  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Returns JWT accessToken (expired after 5 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired after 24 hours).',
      type: LoginViewModel,
    }),
    ApiResponse({ status: 400, description: 'If the inputModel has incorrect values' }),
    ApiResponse({ status: 401, description: 'If the password or login is wrong' }),
    ApiResponse({ status: 429, description: 'More than 5 attempts from one IP-address during 10 seconds' }),
  );

}