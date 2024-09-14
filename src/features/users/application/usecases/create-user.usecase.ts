import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infrastructure/users.query-repository';
import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { bcryptService } from '../../../../common/services/password-hash.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { User, UserModelType } from '../../domain/user.entity';

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
  constructor(private readonly usersQueryRepository: UsersQueryRepository,
              private readonly usersRepository: UsersRepository,
              @InjectModel(User.name) private readonly UserModel: UserModelType) {
  }

  async execute(command: CreateUserCommand): Promise<string> {

    const {password, login, email} = command;

    const response = await this.usersQueryRepository.doesExistByLoginOrEmail(login, email)

    if (!response) {
      throw new BadRequestException([{message: 'The email address/login is not unique', field: 'login/email'}]);
    }

    const hash = await bcryptService.generateHash(password);

    const user = new this.UserModel({
      _id: new Types.ObjectId(),
      email: email,
      login: login,
      hash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: true
      }
    });
    return await this.usersRepository.createUser(user);
  }
}
