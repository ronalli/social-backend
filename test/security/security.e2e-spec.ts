import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { initAppAndClearDB } from '../utils/base.init-settings';
import { customRequest } from '../utils/custom-request';
import { randomUUID } from 'node:crypto';
import { serviceSecurity } from '../utils/security/service-security';
import { jwtService } from '../../src/common/services/jwt.service';

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
    const { refreshToken } =
      await serviceSecurity.authorizationAndRegistrationUser(app);

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

  it('should be return correct length of sessions by current user', async () => {
    const user = await serviceSecurity.registrationUser(app, 'user1');

    const value = [];

    await Promise.all([
      value.push(
        await serviceSecurity.authorizationUser(app, user.login, user.password),
      ),
      value.push(
        await serviceSecurity.authorizationUser(app, user.email, user.password),
      ),
      value.push(
        await serviceSecurity.authorizationUser(app, user.login, user.password),
      ),
      value.push(
        await serviceSecurity.authorizationUser(app, user.email, user.password),
      ),
    ]);

    const resp = await customRequest(app)
      .get('security/devices')
      .set('Cookie', `refreshToken=${value[0]['refreshToken']}`)
      .expect(200);

    expect(resp.body.length).toBe(4);
  });

  it('should be correct delete all sessions only not current', async () => {
    const user = await serviceSecurity.registrationUser(app, 'test-5');

    const value = [];

    await Promise.all([
      value.push(
        await serviceSecurity.authorizationUser(app, user.login, user.password),
      ),
      value.push(
        await serviceSecurity.authorizationUser(app, user.email, user.password),
      ),
      value.push(
        await serviceSecurity.authorizationUser(app, user.login, user.password),
      ),
      value.push(
        await serviceSecurity.authorizationUser(app, user.email, user.password),
      ),
    ]);

    await customRequest(app)
      .delete('security/devices')
      .set('Cookie', `refreshToken=${value[3]['refreshToken']}`)
      .expect(204);

    const resp = await customRequest(app)
      .get('security/devices')
      .set('Cookie', `refreshToken=${value[3]['refreshToken']}`)
      .expect(200);

    expect(resp.body.length).toBe(1);
  });

  it('should correct delete one session by id', async () => {
    const user = await serviceSecurity.registrationUser(app, 'bob');

    const { refreshToken } = await serviceSecurity.authorizationUser(
      app,
      user.email,
      user.password,
    );

    const decode = (await jwtService.decodeToken(refreshToken)) as {
      deviceId: string;
    };

    await customRequest(app)
      .delete(`security/devices/${decode.deviceId}`)
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(204);

    const resp = await customRequest(app)
      .get('security/devices')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(200);

    expect(resp.body.length).toBe(0);
  });

  it('should be delete only one session by id and all session return', async () => {
    const user = await serviceSecurity.registrationUser(app, 'greg');

    const value = [];

    await Promise.all([
      value.push(
        await serviceSecurity.authorizationUser(app, user.login, user.password),
      ),
      value.push(
        await serviceSecurity.authorizationUser(app, user.email, user.password),
      ),
      value.push(
        await serviceSecurity.authorizationUser(app, user.login, user.password),
      ),
      value.push(
        await serviceSecurity.authorizationUser(app, user.email, user.password),
      ),
    ]);

    const decode = (await jwtService.decodeToken(value[0].refreshToken)) as {
      deviceId: string;
    };

    await customRequest(app)
      .delete(`security/devices/${decode.deviceId}`)
      .set('Cookie', `refreshToken=${value[1].refreshToken}`)
      .expect(204);

    const resp = await customRequest(app)
      .get('security/devices')
      .set('Cookie', `refreshToken=${value[1].refreshToken}`)
      .expect(200);

    expect(resp.body.length).toBe(3);
  });

  it('should be return 403, when other user try to delete session by id ', async () => {
    const user = await serviceSecurity.registrationUser(app, 'john');
    const user1 = await serviceSecurity.registrationUser(app, 'alina');

    const { refreshToken } = await serviceSecurity.authorizationUser(
      app,
      user.login,
      user.password,
    );
    const { refreshToken: rf2 } = await serviceSecurity.authorizationUser(
      app,
      user1.login,
      user1.password,
    );

    const decode1 = (await jwtService.decodeToken(refreshToken)) as {
      deviceId: string;
    };

    const decode2 = (await jwtService.decodeToken(rf2)) as {
      deviceId: string;
    };

    await customRequest(app)
      .delete(`security/devices/${decode1.deviceId}`)
      .set('Cookie', `refreshToken=${rf2}`)
      .expect(403);

    await customRequest(app)
      .delete(`security/devices/${decode2.deviceId}`)
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(403);
  });

  it('should be return 404, when user try to delete session by id, but this session not found', async () => {
    const user = await serviceSecurity.registrationUser(app, 'dark');

    const { refreshToken } = await serviceSecurity.authorizationUser(
      app,
      user.login,
      user.password,
    );

    await customRequest(app)
      .delete(`security/devices/${randomUUID()}`)
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(404);
  });

  it('should correctly handle concurrent session deletions', async () => {
    const user1 = await serviceSecurity.registrationUser(app, 'user-t-1');
    const user2 = await serviceSecurity.registrationUser(app, 'user-t-2');

    const sessions1 = [];
    const sessions2 = [];

    for (let i = 0; i < 3; i++) {
      sessions1.push(
        await serviceSecurity.authorizationUser(
          app,
          user1.login,
          user1.password,
        ),
      );
      sessions2.push(
        await serviceSecurity.authorizationUser(
          app,
          user2.login,
          user2.password,
        ),
      );
    }
    await Promise.all([
      customRequest(app)
        .delete('security/devices')
        .set('Cookie', `refreshToken=${sessions1[0].refreshToken}`)
        .expect(204),
      customRequest(app)
        .delete('security/devices')
        .set('Cookie', `refreshToken=${sessions2[0].refreshToken}`)
        .expect(204),
    ]);

    const resp1 = await customRequest(app)
      .get('security/devices')
      .set('Cookie', `refreshToken=${sessions1[0].refreshToken}`)
      .expect(200);

    const resp2 = await customRequest(app)
      .get('security/devices')
      .set('Cookie', `refreshToken=${sessions2[0].refreshToken}`)
      .expect(200);

    expect(resp1.body.length).toBe(1);
    expect(resp2.body.length).toBe(1);
  });
});
