import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger'
import { DevicesViewModel } from '../../../../features/security/api/models/output/devices.view.model';

export function GetDevicesApiResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
      type: DevicesViewModel,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
