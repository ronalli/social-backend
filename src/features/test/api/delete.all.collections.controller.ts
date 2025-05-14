import { Controller, Delete, HttpCode, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteService } from '../application/delete.service';
import { HTTP_STATUSES } from '../../../settings/http.status';

@ApiTags('Testing')
@Controller('testing')
export class DeleteAllCollectionsController {
  constructor(private readonly deleteService: DeleteService) {}

  @Delete('all-data')
  @HttpCode(HTTP_STATUSES.NotContent)
  async delete() {
    await this.deleteService.deleteAll();
    return;
  }
}
