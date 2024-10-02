import { INestApplication } from '@nestjs/common';
import { UserCreateModel } from '../../src/features/users/api/models/input/create-user.input.model';
import request from 'supertest';

export class UsersTestManager {
  constructor(protected readonly app: INestApplication) {}

  expectCorrectModel(createModel: any, responseModel: any) {
    expect(createModel.login).toBe(responseModel.login);
    expect(createModel.email).toBe(responseModel.email);
    expect(createModel.password).toBe(responseModel.password);
  }

  async createUser(
    createModel: UserCreateModel,
    statusCode: number = 201,
    login: string = 'admin',
    password: string = 'qwerty',
  ) {
    return request(this.app.getHttpServer())
      .post('/api/users')
      .auth(login, password, {
        type: 'basic',
      })
      .send(createModel)
      .expect(statusCode);
  }

  async getAllUsers(
    statusCode: number = 200,
    login: string = 'admin',
    password: string = 'qwerty',
  ) {
    return request(this.app.getHttpServer())
      .get('/api/users/')
      .auth(login, password, {
        type: 'basic',
      })
      .expect(statusCode);
  }

  async deleteUser(
    userId: string,
    statusCode: number = 204,
    login: string = 'admin',
    password: string = 'qwerty',
  ) {
    return request(this.app.getHttpServer())
      .delete(`/api/users/${userId}`)
      .auth(login, password, {
        type: 'basic',
      })
      .expect(statusCode);
  }
}
