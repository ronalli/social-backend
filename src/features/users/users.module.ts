import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UserEntity } from './domain/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './application/usecases/create-user.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query-repository';
import { UsersTypeOrmRepository } from './infrastructure/users.typeorm.repository';
import { ConfirmationEmailEntity } from './domain/confirmation.email.entity';
import { UsersTypeOrmQueryRepository } from './infrastructure/users.typeorm.query-repository';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ConfirmationEmailEntity]), CqrsModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    CreateUserHandler,
    UsersTypeOrmRepository,
    UsersTypeOrmQueryRepository
  ],
  exports: [UsersService, UsersRepository, UsersQueryRepository, UsersTypeOrmRepository, UsersTypeOrmQueryRepository],
})
export class UsersModule {}
