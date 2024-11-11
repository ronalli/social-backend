import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { UsersQueryRepository } from '../../infrastructure/users.query-repository';
import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { bcryptService } from '../../../../common/services/password-hash.service';
// import { User } from '../../domain/user.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import {Pool} from 'pg';
import { UsersRepository } from '../../infrastructure/users.repository';

export class CreateUserCommand {
  constructor(
    public login: string,
    public password: string,
    public email: string,
  ) {
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    // private pool: Pool,
              // private readonly usersQueryRepository: UsersQueryRepository,
              private readonly usersRepository: UsersRepository,
              // @InjectModel(User.name) private readonly UserModel: UserModelType
  ) {
  }

  async execute(command: CreateUserCommand): Promise<number> {

    const {password, login, email} = command;

    // const response = await this.usersQueryRepository.doesExistByLoginOrEmail(login, email)

    // if (!response) {
    //   throw new BadRequestException([{message: 'The email address/login is not unique', field: 'login/email'}]);
    // }

    const hash = await bcryptService.generateHash(password);
    const createdAt = new Date().toISOString()
    return await this.usersRepository.create(login, email, hash, createdAt)

    // user.login = login;
    // user.email = email;
    // user.hash = hash;
    // user.createdAt = new Date().toISOString()

    // const user = new this.UserModel({
    //   _id: new Types.ObjectId(),
    //   email: email,
    //   login: login,
    //   hash,
    //   createdAt: new Date().toISOString(),
    //   emailConfirmation: {
    //     confirmationCode: null,
    //     expirationDate: null,
    //     isConfirmed: true
    //   }
    // });

    // const response = await this.userRepository.save(user)
    // return user;
  }
}
