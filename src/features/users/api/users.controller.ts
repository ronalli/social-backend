import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UserQueryDto } from './models/user-query.dto';
import { BasicAuthGuard } from '../../../common/guards/auth.basic.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecases/create-user.usecase';
import { UserCreateModel } from './models/input/create-user.input.model';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { UsersTypeOrmQueryRepository } from '../infrastructure/users.typeorm.query-repository';

@ApiTags('Users')
@Controller('sa/users')
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    // @Inject(UsersQueryRepository)
    // private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersTypeOrmQueryRepository: UsersTypeOrmQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get('')
  async getAllUsers(@Query() query: UserQueryDto) {
    return await this.usersTypeOrmQueryRepository.getAllUsers(query);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() createModel: UserCreateModel) {
    const { login, password, email } = createModel;
    const createdUserId = await this.commandBus.execute(
      new CreateUserCommand(login, password, email),
    );

    return await this.usersService.findUser(createdUserId);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const result = await this.usersService.deleteUser(id);

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return;
  }
}
