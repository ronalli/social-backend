import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { SortDirection } from 'mongodb';

// import {HTTP_STATUSES} from "../settings";
// import {IUserQueryType} from "./types/request-response-type";
// import {IUserInputModel} from "./types/user-types";
// import {UsersServices} from "./usersServices";
// import {UsersQueryRepositories} from "./usersQueryRepositories";

export interface IUserQueryType {
  pageNumber?: number,
  pageSize?: number,
  sortBy?: string,
  sortDirection?: SortDirection,
  searchLoginTerm?: string,
  searchEmailTerm?: string
}

export interface IUserCreateModel {
  login: string;
  password: string;
  email: string;
}


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(@inject(UsersServices) protected usersServices: UsersServices,@inject(UsersQueryRepositories) protected usersQueryRepositories: UsersQueryRepositories) {
  }

  @Get()
  async getAllUsers(@Query() query: IUserQueryType, @Req() req: Request, @Res({passthrough: true}) res: Response, ) {
    const result = await this.usersQueryRepositories.getUsers(query);
    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).json(result.data)
      return
    }
    res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
  }

  @Post()
  async createUser(@Body() createModel: IUserCreateModel,  @Req() req: Request, @Res() res: Response) {
    const result = await this.usersServices.createUser(createModel);
    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data);
      return
    }
    res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
    return
  }

  @Delete()
  async deleteUser(@Param() id: string, @Req() req: Request, @Res() res: Response) {
    const result = await this.usersServices.deleteUser(id)

    if (result.errorMessage) {
      res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
      return
    }
    res.status(HTTP_STATUSES[result.status]).send({})
    return
  }
}