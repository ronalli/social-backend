import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { bcryptService } from '../../../../common/services/password-hash.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersQueryRepository } from '../../infrastructure/users.query-repository';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ConfirmationInfoEmail } from '../../../../common/utils/createConfirmationInfoForEmail';
import { UsersTypeOrmRepository } from '../../infrastructure/users.typeorm.repository';
import { UsersTypeOrmQueryRepository } from '../../infrastructure/users.typeorm.query-repository';

export class CreateUserCommand {
  constructor(
    public login: string,
    public password: string,
    public email: string,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
    private readonly usersTypeOrmRepository: UsersTypeOrmRepository,
    private readonly usersTypeOrmQueryRepository: UsersTypeOrmQueryRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const { password, login, email } = command;

    const [isLogin, isEmail] = await this.usersTypeOrmQueryRepository.doesExistByLoginOrEmail(
      login,
      email,
    );


    if (isLogin || isEmail) {
      throw new BadRequestException([
        {
          message: 'The email/login is not unique',
          field: 'login/email',
        },
      ]);
    }

    const hash = await bcryptService.generateHash(password);
    const createdAt = new Date();
    const id = randomUUID();
    const confirmation = new ConfirmationInfoEmail(id, false);

    return await this.usersTypeOrmRepository.create(
      id,
      login,
      email,
      hash,
      createdAt,
      confirmation,
    );
  }
}
