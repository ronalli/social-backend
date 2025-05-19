import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { OutputModelErrors } from '../../../models/error.model';

export function UpdateCommentApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 204,
      description: 'No Content',
    }),
    ApiResponse({
      status: 400,
      description: 'If the inputModel has incorrect values',
      type: OutputModelErrors,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'If try edit the comment that is not your own',
    }),
    ApiResponse({
      status: 404,
      description: 'Not found',
    }),
  );
}
