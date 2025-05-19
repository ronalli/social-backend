import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { OutputModelErrors } from '../../../models/error.model';
import { CommentViewModel } from '../../../../features/bloggers-platform/comments/api/models/output/comment.view-model';

export function GetCommentsForPostApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
      type: CommentViewModel
    }),
    ApiResponse({
      status: 400,
      description: 'If the inputModel has incorrect values',
      type: OutputModelErrors
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  )
}