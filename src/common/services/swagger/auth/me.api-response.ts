import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { InfoCurrentUserModel } from '../../../../features/users/api/models/output/info.current.user';

export function MeApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
      type: InfoCurrentUserModel
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),

  )

}