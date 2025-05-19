import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function DeleteCommentApiResponse() {

  return applyDecorators(
    ApiResponse({
      status: 204,
      description: 'No Content',
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
  )
}