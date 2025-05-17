import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { OutputModelErrors } from '../../../models/error.model';

export function PrivateUpdateBlogApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 204,
      description: 'No Content',
    }),
    ApiResponse({
      status: 400,
      description: 'If the inputModel has incorrect values',
      type: OutputModelErrors
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
