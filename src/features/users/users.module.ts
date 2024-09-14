import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './application/usecases/create-user.usecase';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), CqrsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository, CreateUserHandler],
  exports: [UsersService, UsersRepository, UsersQueryRepository]
})

export class UsersModule {}
