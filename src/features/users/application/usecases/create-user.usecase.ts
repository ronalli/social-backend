import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { bcryptService } from '../../../../common/services/password-hash.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersQueryRepository } from '../../infrastructure/users.query-repository';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

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
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const { password, login, email } = command;

    const response = await this.usersQueryRepository.doesExistByLoginOrEmail(
      login,
      email,
    );

    if (!response) {
      throw new BadRequestException([
        {
          message: 'The email address/login is not unique',
          field: 'login/email',
        },
      ]);
    }

    const hash = await bcryptService.generateHash(password);
    const createdAt = new Date().toISOString();
    const id = randomUUID();
    return await this.usersRepository.create(id, login, email, hash, createdAt);
  }
}
