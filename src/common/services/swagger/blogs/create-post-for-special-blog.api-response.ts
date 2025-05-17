import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { OutputModelErrors } from '../../../models/error.model';
import { PostOutputModel } from '../../../../features/bloggers-platform/posts/api/models/output/post.output.model';

export function CreatePostForSpecialBlogApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Returns the newly created post',
      type: PostOutputModel,
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
