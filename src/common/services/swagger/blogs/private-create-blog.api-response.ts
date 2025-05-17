import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BlogOutputModel } from '../../../../features/bloggers-platform/blogs/api/models/output/blog.output.model';
import { OutputModelErrors } from '../../../models/error.model';

export function PrivateCreateBlogApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Returns the newly created blog',
      type: BlogOutputModel,
    }),
    ApiResponse({
      status: 400,
      description: 'If the inputModel has incorrect values',
      type: OutputModelErrors
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
