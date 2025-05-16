import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function RegistrationConfirmationApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 204,
      description: 'Email was verified. Account was activated',
    }),
    ApiResponse({
      status: 400,
      description:
        'If the confirmation code is incorrect, expired or already been applied',
    }),
    ApiResponse({
      status: 429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
