import { INestApplication } from '@nestjs/common';
import { UsersTestManager } from './utils/users-test-manager';
import { initSettings } from './utils/init-settings';
import { UsersService } from '../src/features/users/application/users.service';
import { UsersRepository } from '../src/features/users/infrastructure/users.repository';
import { UserServiceMock } from './mock/user.service.mock';

describe('Users Tests', () => {
  let app: INestApplication;
  let userTestManager: UsersTestManager;

  beforeAll(async () => {
    const result = await initSettings((moduleBuilder) =>
      moduleBuilder.overrideProvider(UsersService).useFactory({
        factory: (repo: UsersRepository) => {
          return new UserServiceMock(repo);
        },
        inject: [UsersRepository]
      }),
    );

    app = result.app;
    userTestManager = result.userTestManger;
  });

  afterAll(async () => {
    await app.close();
  })

  it('should create user', async () => {
    const body = { login: 'name1', password: 'qwerty', email: 'email@email.em' };

    const response = await userTestManager.createUser(body);

    expect(response.body).toEqual({ login: body.login, email: body.email, id: expect.any(String), createdAt: expect.any(String) });
  });

});