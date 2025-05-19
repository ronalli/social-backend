import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { PostOutputModel } from '../../../../features/bloggers-platform/posts/api/models/output/post.output.model';

export function GetPostByIdApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
      type: PostOutputModel,
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found',
    }),
  );
}
