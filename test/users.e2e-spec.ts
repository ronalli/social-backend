import { INestApplication } from '@nestjs/common';
import { UsersTestManager } from './utils/users-test-manager';
import { UsersService } from '../src/features/users/application/users.service';
import { UsersRepository } from '../src/features/users/infrastructure/users.repository';
import { UserServiceMock } from './mock/user.service.mock';
import { initBaseSettings } from './utils/base.init-settings';

describe('Users Tests', () => {
  let app: INestApplication;
  let userTestManager: UsersTestManager;

  beforeAll(async () => {
    const result =  await initBaseSettings([{
      provider: UsersService, useValue: UserServiceMock
    }], (moduleBuilder) =>
        moduleBuilder.overrideProvider(UsersService).useFactory({
          factory: (repo: UsersRepository) => {
            return new UserServiceMock(repo);
          },
          inject: [UsersRepository],
        }))

    app = result.app;
    userTestManager = new UsersTestManager(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create user', async () => {
    const body = {
      login: 'name1',
      password: 'qwerty',
      email: 'email@email.em',
    };

    const response = await userTestManager.createUser(body);

    expect(response.body).toEqual({
      login: body.login,
      email: body.email,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('should get all users', async () => {
    const body = {
      login: 'name2',
      password: 'qwerty',
      email: 'email2@email.em',
    };

    await userTestManager.createUser(body);

    const getUsersResponse = await userTestManager.getAllUsers();

    expect(getUsersResponse.body.totalCount).toEqual(2);
  });

  it("don't should correct create user", async () => {
    const body = {
      login: 'na',
      password: 'qwerty',
      email: 'bob@gmail.com',
    };

    const response = await userTestManager.createUser(body, 400);

    expect(response.statusCode).toEqual(400);
    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages[0].field).toBe('login');
  });

  it('should correct delete user', async () => {
    const getUsersResponse = await userTestManager.getAllUsers();

    const userId = getUsersResponse.body.items[0].id;

    const response = await userTestManager.deleteUser(userId);

    expect(response.statusCode).toEqual(204);

    const getUsersResponse1 = await userTestManager.getAllUsers();

    expect(getUsersResponse1.body.totalCount).toEqual(1);
    expect(getUsersResponse.body.totalCount).not.toBe(
      getUsersResponse1.body.totalCount,
    );
  });

  it("don't should correct delete not found user", async () => {
    const response = await userTestManager.deleteUser(
      '507f191e810c19729de860ea', 404
    );

    expect(response.statusCode).toEqual(404);
  });

  it("should return error unauthorized", async () => {

    const body = {login: 'bob', email: 'bob@gmail.com', password: 'qwerty'};

    const response = await userTestManager.createUser(body, 401, 'bob', 'qwerty');

    expect(response.statusCode).toEqual(401)

  });

});
