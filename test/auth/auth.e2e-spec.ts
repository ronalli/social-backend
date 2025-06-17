import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { initAppAndClearDB } from '../utils/base.init-settings';
import { customRequest } from '../utils/custom-request';
import { serviceSecurity } from '../utils/security/service-security';
import { serviceUsers } from '../utils/users/service-users';

describe('Users e2e Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const setup = await initAppAndClearDB();
    app = setup.app;
    dataSource = setup.dataSource;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('should be return 400, because incorrect input data', async () => {
    const res = await customRequest(app)
      .post('auth/registration')
      .send({
        login: 'a',
        email: 'a.gmail.com',
        password: '123',
      })
      .expect(400);
    expect(res.body).toHaveProperty('errorsMessages');
    expect(res.body.errorsMessages.length).toBe(3);
    expect(res.body.errorsMessages[0].field).toEqual(expect.any(String));
    expect(res.body.errorsMessages[0].message).toEqual(expect.any(String));
  });

  it('should be correct registration user and return code 204', async () => {
    const res = await customRequest(app)
      .post('auth/registration')
      .send({
        login: 'bob',
        email: 'bob@gmail.com',
        password: '12345678',
      })
      .expect(204);
  });

  it('should be return 400, when a request for a new password is executed', async () => {
    await customRequest(app)
      .post('auth/password-recovery')
      .send({
        email: 'admin^gmail.com',
      })
      .expect(400);
  });

  it('should be return 204, when email correct, but maybe not found', async () => {
    await customRequest(app)
      .post('auth/password-recovery')
      .send({
        email: 'admin@gmail.com',
      })
      .expect(204);
  });

  it('should be return 400, when recoveryCode is not correct or expired', async () => {
    await customRequest(app)
      .post('auth/new-password')
      .send({
        newPassword: '34566',
        recoveryCode: '1234567890',
      })
      .expect(400);
  });

  it('should be return 401, when refreshToken is not correct', async () => {
    await customRequest(app)
      .post('auth/logout')
      .set('Cookie', 'refreshToken=1234567890')
      .expect(401);
  });

  it('should be correct logout user and return code 204', async () => {
    const user = await serviceSecurity.registrationUser(app, 'mark');

    const { refreshToken } = await serviceSecurity.authorizationUser(
      app,
      user.login,
      user.password,
    );

    await customRequest(app)
      .post('auth/logout')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(204);
  });

  it('should be return 401: accessToken is not correct, when requesting a personal page ', async () => {
    await customRequest(app)
      .get('auth/me')
      .set('Authorization', 'Bearer 1234567890')
      .expect(401);
  });

  it('should correct return personal page', async () => {

    const {accessToken} = await serviceUsers.authorizationUser(app, 'nick')

    const resp = await customRequest(app)
      .get('auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(resp.body.login).toBe('nick-1');
    expect(resp.body.email).toBe('nick@test.com');
    expect(resp.body).toHaveProperty('userId');

  })
});


//functions 81.22 lines 86.39