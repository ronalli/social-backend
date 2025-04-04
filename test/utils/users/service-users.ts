import { INestApplication } from '@nestjs/common';
import { customRequest } from '../custom-request';

export const serviceUsers = {

  authorizationUser: async (app: INestApplication) => {

   await customRequest(app).post(`sa/users`).set('Authorization', process.env.AUTH_HEADER).send({
        login: 'test-1',
        password: '12345678',
        email: 'test1@test.com',
    }).expect(201);


    const resp = await customRequest(app).post(`auth/login`).send({
      loginOrEmail: 'test-1',
      password: '12345678',
    }).expect(200)

    expect(resp.body).toHaveProperty('accessToken')

    return resp.body;
  }

}