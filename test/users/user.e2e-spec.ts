import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { customRequest } from '../utils/custom-request';
import { randomUUID } from 'node:crypto';
import { initAppAndClearDB } from '../utils/base.init-settings';

describe('Users e2e Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let firstUserId: string;

  beforeAll(async () => {
    const setup = await initAppAndClearDB();
    app = setup.app;
    dataSource = setup.dataSource;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('should connect DB', async () => {
    const res = await dataSource.query('SELECT 1 + 1 AS result');
    expect(res[0].result).toBe(2);
  });

  it('should correct add user', async () => {
    const res = await customRequest(app)
      .post('sa/users')
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        login: 'bob',
        email: 'bob@example.com',
        password: '12345678',
      })
      .expect(201);
    expect(res.body.login).toBe('bob');
    expect(res.body.email).toBe('bob@example.com');
    expect(res.body.createdAt).toBeDefined();

    firstUserId = res.body.id;

    const allUsers = await customRequest(app)
      .get('sa/users')
      .set('Authorization', process.env.AUTH_HEADER)
      .expect(200);
    expect(allUsers.body.items[0].id).toBe(firstUserId);
  });

  it('should correct delete user', async () => {
    const secondUser = await customRequest(app)
      .post('sa/users')
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        login: 'alex',
        email: 'alex@example.com',
        password: '12345678',
      })
      .expect(201);

    const res = await customRequest(app)
      .delete(`sa/users/${firstUserId}`)
      .set('Authorization', process.env.AUTH_HEADER)
      .expect(204);

    const allUsers = await customRequest(app)
      .get('sa/users')
      .set('Authorization', process.env.AUTH_HEADER)
      .expect(200);

    expect(allUsers.body.items.length).toBe(1);
    expect(allUsers.body.items[0].id).toBe(secondUser.body.id);
  });

  it('should return 401 unauthorized', async () => {
    await customRequest(app).get('sa/users').expect(401);

    await customRequest(app)
      .post('sa/users')
      .send({
        login: 'bob',
        email: 'bob@gmail.com',
        password: '12345678',
      })
      .expect(401);

    await customRequest(app).delete(`sa/users/${firstUserId}`).expect(401);
  });

  it('should return 400 by incorrect add user', async () => {
    const res = await customRequest(app)
      .post('sa/users')
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        login: 'a',
        email: 'a.gmail.com',
        password: '12345678',
      })
      .expect(400);

    expect(res.body.errorsMessages.length).toBe(2);
    expect(res.body.errorsMessages[0].field).toEqual('login');
    expect(res.body.errorsMessages[1].field).toEqual('email');
  });

  it('should be return 401 by incorrect auth header', async () => {
    await customRequest(app)
      .get('sa/users')
      .set('Authorization', process.env.AUTH_HEADER_FAIL)
      .expect(401);
  });

  it(`'should be return Not Found 404 by don't search id user`, async () => {
    const randomId = randomUUID();
    await customRequest(app)
      .delete(`sa/users/${randomId}`)
      .set('Authorization', process.env.AUTH_HEADER)
      .expect(404);
  });
});
