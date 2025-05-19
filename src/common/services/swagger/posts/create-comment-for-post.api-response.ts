import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { OutputModelErrors } from '../../../models/error.model';
import { CommentOutputModel } from '../../../../features/bloggers-platform/comments/api/models/output/comment.output.model';

export function CreateCommentForPostApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Returns the newly created post',
      type: CommentOutputModel,
    }),
    ApiResponse({
      status: 400,
      description: 'If the inputModel has incorrect values',
      type: OutputModelErrors,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 404,
      description: "If post with specified postId doesn't exists",
    }),
  );
}
