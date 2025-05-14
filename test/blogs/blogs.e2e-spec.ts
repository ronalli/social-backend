import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { customRequest } from '../utils/custom-request';
import * as process from 'node:process';
import { serviceBlogs } from '../utils/blogs/service-blogs';
import { randomUUID } from 'node:crypto';
import { initAppAndClearDB } from '../utils/base.init-settings';

describe('Blogs e2e Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let blogId: string;

  beforeAll(async () => {
    const setup = await initAppAndClearDB();
    app = setup.app;
    dataSource = setup.dataSource;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('should be correct add new blog', async () => {
    const res = await customRequest(app)
      .post('sa/blogs')
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        name: 'it-incubator',
        description: 'this is the best courses in the world',
        websiteUrl: 'https://incubator.com',
      })
      .expect(201);

    expect(res.body.name).toBe('it-incubator');
    expect(res.body.description).toBe('this is the best courses in the world');
    expect(res.body.websiteUrl).toBe('https://incubator.com');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('isMembership');
  });

  it('should be return 401 by incorrect authorization head', async () => {
    await customRequest(app)
      .post('sa/blogs')
      .set('Authorization', process.env.AUTH_HEADER_FAIL)
      .send({
        name: 'it-incubator',
        description: 'this is the best courses in the world',
        websiteUrl: 'https://incubator.com',
      })
      .expect(401);
  });

  it('should be return 400 by incorrect fields blog', async () => {
    const res = await customRequest(app)
      .post('sa/blogs')
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        name: 'it',
        description: 'this',
        websiteUrl: 'https//incubator.com',
      })
      .expect(400);

    expect(res.body).toHaveProperty('errorsMessages');
    expect(res.body.errorsMessages.length).toBe(3);
  });

  it('should be correct return all blogs', async () => {
    await serviceBlogs.createBlogs(app, 5);

    const resp = await customRequest(app)
      .get('sa/blogs')
      .set('Authorization', process.env.AUTH_HEADER)
      .expect(200);

    blogId = resp.body.items[0].id;
    expect(resp.body.items.length).toBe(6);
  });

  it('should correct get one blog by id', async () => {
    const resp = await customRequest(app).get(`blogs/${blogId}`).expect(200);
    expect(resp.body.name).toBe('blog 5');
    expect(resp.body.description).toBe('blog 5 description');
    expect(resp.body.websiteUrl).toBe('https://someblog5.com');
  });

  it('should correct update blog by id', async () => {
    await customRequest(app)
      .put(`sa/blogs/${blogId}`)
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        name: 'blog 5.1',
        description: 'blog 5.1 description',
        websiteUrl: 'https://someblog51.com',
      })
      .expect(204);

    const resp = await customRequest(app).get(`blogs/${blogId}`).expect(200);

    expect(resp.body.name).toBe('blog 5.1');
    expect(resp.body.description).toBe('blog 5.1 description');
    expect(resp.body.websiteUrl).toBe('https://someblog51.com');
  });

  it('should be return status code 401, authorization header is not correct', async () => {
    await customRequest(app)
      .put(`sa/blogs/${blogId}`)
      .send({
        name: 'blog 5.1.1',
        description: 'blog 5.1.1 description',
        websiteUrl: 'https://someblog511.com',
      })
      .set('Authorization', process.env.AUTH_HEADER_FAIL)
      .expect(401);

    await customRequest(app).delete(`sa/blogs/${blogId}`).expect(401);
  });

  it('should be correct delete blog by id', async () => {
    await customRequest(app)
      .delete(`sa/blogs/${blogId}`)
      .set('Authorization', process.env.AUTH_HEADER)
      .expect(204);

    await customRequest(app).get(`blogs/${blogId}`).expect(404);
  });

  it('should be return 404/400, if blogId is not found or incorrect', async () => {
    const randomId = randomUUID();

    await customRequest(app).get(`blogs/${randomId}`).expect(404);
    await customRequest(app).get(`blogs/42sd5fsd3fsd45`).expect(400);

    await customRequest(app)
      .delete(`sa/blogs/${randomId}`)
      .set('Authorization', process.env.AUTH_HEADER)
      .expect(404);
  });
});
