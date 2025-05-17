import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BlogViewModel } from '../../../../features/bloggers-platform/blogs/api/models/output/blog.view-model';


export function PrivateGetBlogsApiResponse() {

  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
      type: BlogViewModel,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),

  )
}