import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function RegistrationApiResponse() {

  return applyDecorators(
    ApiResponse({
      status: 204,
      description: 'Input data is accepted. Email with confirmation code will be send to passed email address',
    }),
    ApiResponse({
      status: 400,
      description:
        'If the inputModel has incorrect values (in particular if the user with the given email or login already exists)',
    }),
    ApiResponse({
      status: 429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),

  )
}