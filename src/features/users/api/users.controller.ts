import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Inject, Param, Post, Query, Req, Res } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { HTTP_STATUSES } from '../../../settings/http.status';
import { IUserQueryType } from './models/all.types';
import { UserCreateModel } from './models/input/create-user.input.model';

@ApiTags('Users')
@Controller('/api/users')
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(UsersQueryRepository) private readonly usersQueryRepository: UsersQueryRepository) {
  }

  @Get('')
  async getAllUsers(@Query() query: IUserQueryType, @Req() req: Request, @Res({passthrough: true}) res: Response, ) {
    const result = await this.usersQueryRepository.getUsers(query);
    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).json(result.data)
      return
    }
    res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
  }

  @Post()
  async createUser(@Body() createModel: UserCreateModel,  @Req() req: Request, @Res() res: Response) {
    const result = await this.usersService.createUser(createModel);
    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data);
      return
    }
    res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
    return
  }

  @Delete(':id')
  async deleteUser(@Param() id: string, @Req() req: Request, @Res() res: Response) {

    const result = await this.usersService.deleteUser(id)

    if (result.errorMessage) {
      res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
      return
    }
    res.status(HTTP_STATUSES[result.status]).send({})
    return
  }
}