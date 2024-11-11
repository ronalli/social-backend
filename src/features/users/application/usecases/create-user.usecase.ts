import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { UsersQueryRepository } from '../../infrastructure/users.query-repository';
import { bcryptService } from '../../../../common/services/password-hash.service';
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
              // private readonly usersQueryRepository: UsersQueryRepository,
              private readonly usersRepository: UsersRepository,
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
  }
}
