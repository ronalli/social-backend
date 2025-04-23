import { INestApplication } from '@nestjs/common';
import { customRequest } from '../custom-request';

export const serviceUsers = {
  authorizationUser: async (
    app: INestApplication,
    name: string = 'test',
  ): Promise<{ accessToken: string }> => {
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

    expect(resp.body).toHaveProperty('accessToken');

    return resp.body;
  },
};
