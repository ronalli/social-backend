import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import { DataSource } from 'typeorm';
import { customRequest } from '../utils/custom-request';
import * as process from 'node:process';
import { serviceBlogs } from '../utils/blogs/service-blogs';

describe('Blogs e2e Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let blogId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    applyAppSettings(app);

    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    await dataSource.query(
      `TRUNCATE TABLE public."users", public.blogs,  public.posts, public."commentsPosts", public."commentsLikeStatus", public."postsLikeStatus", public."oldRefreshTokens", public."recoveryCodes", public."confirmationEmailUsers", public."deviceSessions" RESTART IDENTITY CASCADE;`,
    );
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

  it('should be correct delete blog by id', async () => {

    await customRequest(app).delete(`sa/blogs/${blogId}`).set('Authorization', process.env.AUTH_HEADER).expect(204)

    await customRequest(app).get(`blogs/${blogId}`).expect(404)

  })


});
