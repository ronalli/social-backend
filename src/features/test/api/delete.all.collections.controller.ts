import { Controller, Delete, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { DeleteService } from '../application/delete.service';
import { HTTP_STATUSES } from '../../../settings/http.status';

@ApiTags('Testing')
@Controller('testing')
export class DeleteAllCollectionsController {
  constructor(private readonly deleteService: DeleteService) {
  }

  @Delete('all-data')
  async delete(@Req() req: Request, @Res() res: Response) {
    const result = await this.deleteService.deleteAll();

    res.status(HTTP_STATUSES.NotContent).send({})
  }
}