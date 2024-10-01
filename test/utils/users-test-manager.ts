import { INestApplication } from '@nestjs/common';
import { UserCreateModel } from '../../src/features/users/api/models/input/create-user.input.model';
import request from 'supertest';
import dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();

export class UsersTestManager {
  constructor(
    protected readonly app: INestApplication,
    private readonly admin: string,
    private readonly password: string,
  ) {
  }

  expectCorrectModel(createModel: any, responseModel: any) {
    expect(createModel.login).toBe(responseModel.login);
    expect(createModel.email).toBe(responseModel.email);
    expect(createModel.password).toBe(responseModel.password);
  }

  async createUser(
    createModel: UserCreateModel,
    statusCode: number = 201,
  ) {
    return request(this.app.getHttpServer())
      .post('/api/users')
      .auth(this.admin, this.password, {
        type: 'basic',
      })
      .send(createModel)
      .expect(statusCode);
  }

  async updateUser(
    userId: string,
    updateModel: any,
    statusCode: number = 204,
  ) {
    return request(this.app.getHttpServer())
      .put(`/api/users/${userId}`)
      .auth(this.admin, this.password, {
        type: 'basic',
      })
      .send(updateModel)
      .expect(statusCode);
  }

  async deleteUser(
    userId: string,
    statusCode: number = 204,
  ) {
    return request(this.app.getHttpServer())
      .delete(`/api/users/${userId}`)
      .auth(this.admin, this.password, {
        type: 'basic',
      })
      .expect(statusCode);
  }
}
