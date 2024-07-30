import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get, HttpCode, HttpException, HttpStatus,
  Inject, NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { HTTP_STATUSES } from '../../../settings/http.status';
import { UserCreateModel } from './models/input/create-user.input.model';
import { UserQueryDto } from './models/user-query.dto';
import { BasicAuthGuard } from '../../../common/guards/auth.basic.guard';
import { UserOutputModel } from './models/output/user.output.model';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(UsersQueryRepository) private readonly usersQueryRepository: UsersQueryRepository) {
  }

  @UseGuards(BasicAuthGuard)
  @Get('')
  async getAllUsers(@Query() query: UserQueryDto, @Req() req: Request, @Res({passthrough: true}) res: Response, ) {
    const result = await this.usersQueryRepository.getUsers(query);
    if (result.data) {
      res.status(HTTP_STATUSES.Success).json(result.data)
      return
    }
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() createModel: UserCreateModel) {
    const createdUserId = await this.usersService.createUser(createModel);
    const createdUser: UserOutputModel | null = await this.usersQueryRepository.doesExistById(createdUserId)
    return createdUser;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {

    const result = await this.usersService.deleteUser(id)

    if(!result) {
      throw new NotFoundException(`User with id ${id} not found`)
    }
  }
}