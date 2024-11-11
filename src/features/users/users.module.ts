import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { User } from './domain/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './application/usecases/create-user.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './infrastructure/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, CreateUserHandler],
  exports: [UsersService, UsersRepository]
})

export class UsersModule {}
