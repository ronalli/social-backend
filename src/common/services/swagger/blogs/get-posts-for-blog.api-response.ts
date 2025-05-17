import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { OutputModelErrors } from '../../../models/error.model';
import { PostViewModel } from '../../../../features/bloggers-platform/posts/api/models/output/post.view-model';

export function GetPostsForBlogApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
      type: PostViewModel,
    }),
    ApiResponse({
      status: 400,
      description: 'If the inputModel has incorrect values',
      type: OutputModelErrors,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 404,
      description: "If specific blog doesn't exists",
    }),
  );
}
