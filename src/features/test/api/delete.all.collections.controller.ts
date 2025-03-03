import { Controller, Delete, HttpCode, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteService } from '../application/delete.service';

@ApiTags('Testing')
@Controller('testing')
export class DeleteAllCollectionsController {
  constructor(private readonly deleteService: DeleteService) {}

  @Delete('all-data')
  @HttpCode(204)
  async delete() {
    await this.deleteService.deleteAll();
    return;
  }
}
