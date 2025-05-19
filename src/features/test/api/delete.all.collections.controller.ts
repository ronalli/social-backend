import { Controller, Delete, HttpCode, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteService } from '../application/delete.service';
import { HTTP_STATUSES } from '../../../settings/http.status';

@ApiTags('Testing')
@Controller('testing')
export class DeleteAllCollectionsController {
  constructor(private readonly deleteService: DeleteService) {}

  @HttpCode(HTTP_STATUSES.NotContent)
  @Delete('all-data')
 @ApiResponse({
   status: 204,
   description: 'All data deleted',
 })
  async delete() {
    await this.deleteService.deleteAll();
    return;
  }
}
