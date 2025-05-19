import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  CommentOutputModel
} from '../../../../features/bloggers-platform/comments/api/models/output/comment.output.model';

export function GetCommentApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
      type: CommentOutputModel
    }),
    ApiResponse({
      status: 404,
      description: 'Not found',
    }),
  )
}