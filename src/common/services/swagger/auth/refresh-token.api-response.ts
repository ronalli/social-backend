import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LoginViewModel } from '../../../../features/auth/domain/login.view-model';

export function RefreshTokenApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description:
        'Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds).',
      type: LoginViewModel,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
