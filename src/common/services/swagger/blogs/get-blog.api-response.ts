import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BlogOutputModel } from '../../../../features/bloggers-platform/blogs/api/models/output/blog.output.model';

export function GetBlogApiResponse() {

  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
      type: BlogOutputModel
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found',
    }),

  )
}