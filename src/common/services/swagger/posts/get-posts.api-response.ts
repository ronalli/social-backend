import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PostViewModel } from '../../../../features/bloggers-platform/posts/api/models/output/post.view-model';

export function GetPostsApiResponse() {

  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
      type: PostViewModel,
    }),
  )
}