import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function NewPasswordApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 204,
      description: 'If code is valid and new password is accepted',
    }),
    ApiResponse({
      status: 400,
      description:
        'If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired',
    }),
    ApiResponse({
      status: 429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
