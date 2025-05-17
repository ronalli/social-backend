import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function DeleteSpecifiedApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 204,
      description: 'All data is deleted',
    }),
  );
}
