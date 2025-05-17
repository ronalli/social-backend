import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger'

export function DeleteAllApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 204,
      description: 'No Content',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
