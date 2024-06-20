import { Module, Provider } from '@nestjs/common';
import { UsersController } from './features/users/api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {config} from 'dotenv';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersService } from './features/users/application/users.service';
import { UsersQueryRepository } from './features/users/infrastructure/users.query-repository';
import * as process from 'node:process';

config();

const usersProviders: Provider[

  ] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository
]

@Module({

  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  controllers: [UsersController],
  providers: [
    ...usersProviders
  ],
})
export class AppModule {}
