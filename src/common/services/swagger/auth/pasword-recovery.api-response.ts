import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LoginViewModel } from '../../../../features/auth/domain/login.view-model';

export function PasswordRecoveryApiResponse() {

  return applyDecorators(
    ApiResponse({
      status: 204,
      description: 'Even if current email is not registered (for prevent user\'s email detection)',
    }),
    ApiResponse({ status: 400, description: 'If the inputModel has invalid email (for example 222^gmail.com)' }),
    ApiResponse({ status: 429, description: 'More than 5 attempts from one IP-address during 10 seconds' }),
  );
}