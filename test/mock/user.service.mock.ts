import { UsersService } from '../../src/features/users/application/users.service';
import { UsersRepository } from '../../src/features/users/infrastructure/users.repository';

export const UserServiceMockObject = {

  create() {
    return Promise.resolve('123')
  }

}


export class UserServiceMock extends UsersService {

  constructor(usersRepository: UsersRepository) {
    super(usersRepository);
  }


}