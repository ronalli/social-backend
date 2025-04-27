import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { initAppAndClearDB } from '../utils/base.init-settings';
import { customRequest } from '../utils/custom-request';
import { randomUUID } from 'node:crypto';
import { serviceUsers } from '../utils/users/service-users';
import { serviceSecurity } from '../utils/security/service-security';

describe('Security', () => {
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

  it('should be return code 401 be out authorization header', async () => {
    await customRequest(app).get('security/devices').expect(401);
  });

  it('should be return 401 by incorrect authorization header', async () => {
    await customRequest(app)
      .get('security/devices')
      .set('Authorization', `Bearer ${randomUUID()}`)
      .expect(401);
    await customRequest(app)
      .get('security/devices')
      .set('Authorization', `Basic ${randomUUID()}`)
      .expect(401);
  });

  it('should be return code 200, because authorization header is correct', async () => {
    const { refreshToken } = await serviceSecurity.authorizationUser(app);

    const { body: session } = await customRequest(app)
      .get('security/devices')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(200);

    expect(session.length).toBe(1);
    expect(session[0]).toHaveProperty('ip');
    expect(session[0]).toHaveProperty('title');
    expect(session[0]).toHaveProperty('lastActiveDate');
    expect(session[0]).toHaveProperty('deviceId');
  });
});
