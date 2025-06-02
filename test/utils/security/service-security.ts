import { INestApplication } from '@nestjs/common';
import { customRequest } from '../custom-request';
import * as cookie from 'cookie';

export const serviceSecurity = {
  authorizationAndRegistrationUser: async (
    app: INestApplication,
    name: string = 'test',
  ) => {
    await customRequest(app)
      .post(`sa/users`)
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        login: `${name}-1`,
        password: '12345678',
        email: `${name}@test.com`,
      })
      .expect(201);

    const resp = await customRequest(app)
      .post(`auth/login`)
      .send({
        loginOrEmail: `${name}-1`,
        password: '12345678',
      })
      .expect(200);

    const parsed = resp.get('Set-Cookie')[0];

    const cookies = cookie.parse(parsed);

    expect(cookies).toBeDefined();

    return { refreshToken: cookies.refreshToken };
  },

  registrationUser: async (app: INestApplication, name: string) => {
     await customRequest(app)
      .post(`sa/users`)
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        login: `${name}`,
        password: '12345678',
        email: `${name}@test.com`,
      })
      .expect(201);


    return {
      login: `${name}`,
      password: '12345678',
      email: `${name}@test.com`,
    };
  },

  authorizationUser: async (
    app: INestApplication,
    loginOrEmail: string,
    password: string,
  ) => {
    const resp = await customRequest(app)
      .post(`auth/login`)
      .send({
        loginOrEmail,
        password,
      })
      .expect(200);

    const parsed = resp.get('Set-Cookie')[0];

    const cookies = cookie.parse(parsed);

    expect(cookies).toBeDefined();

    return { refreshToken: cookies.refreshToken };
  },
};
