import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import { randomUUID } from 'node:crypto';
import { customRequest } from '../utils/custom-request';
import * as process from 'node:process';
import { serviceBlogs } from '../utils/blogs/service-blogs';
import { servicePost } from '../utils/posts/service-post';

describe('Posts e2e Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let postId: string;

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

  it('should be return 404, if not found special blog', async () => {
    const randomId = randomUUID();

    await customRequest(app)
      .post(`sa/blogs/${randomId}/posts`)
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        title: 'post 1',
        shortDescription: 'description post 1',
        content: 'content post 1',
      })
      .expect(404);
  });

  it('should be return 401, because set incorrect auth header', async () => {
    const randomId = randomUUID();
    await customRequest(app)
      .post(`sa/blogs/${randomId}/posts`)
      .set('Authorization', process.env.AUTH_HEADER_FAIL)
      .send({
        title: 'post 1',
        shortDescription: 'description post 1',
        content: 'content post 1',
      })
      .expect(401);
  });

  it('should be return 400, because set incorrect fields new post', async () => {
    const randomId = randomUUID();

    const resp = await customRequest(app)
      .post(`sa/blogs/${randomId}/posts`)
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        title: 'p',
        shortDescription: 'de',
        content: 'co',
      })
      .expect(400);

    expect(resp.body.errorsMessages.length).toBe(3);
  });

  it('should correct create new post', async () => {
    const blogId = await serviceBlogs.createBlog(app);

    const resp = await customRequest(app)
      .post(`sa/blogs/${blogId}/posts`)
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        title: 'post 1',
        shortDescription: 'description post 1',
        content: 'content post 1',
      })
      .expect(201);

    postId = resp.body.id;

    expect(resp.body.blogId).toBe(blogId);
    expect(resp.body.content).toBe('content post 1');
    expect(resp.body.title).toBe('post 1');
    expect(resp.body.content).toBe('content post 1');

    expect(resp.body.createdAt).toBeDefined();
    expect(resp.body.blogName).toBeDefined();
    expect(resp.body.extendedLikesInfo).toBeDefined();
    expect(resp.body.extendedLikesInfo.newestLikes).toBeDefined();

    const respPost = await customRequest(app)
      .get(`posts/${resp.body.id}`)
      .expect(200);

    expect(respPost.body).toEqual(resp.body);
  });

  it('should correct update post',  async () => {

    const {postId, blogId} = await servicePost.createPost(app)

    const post = await customRequest(app).get(`posts/${postId}`).expect(200);

    const resp = await customRequest(app).put(`sa/blogs/${blogId}/posts/${postId}`).set('Authorization', process.env.AUTH_HEADER).send({
      title: 'new post 1',
      shortDescription: 'new description post 1',
      content: 'new content post 1'
    }).expect(204)

    expect(post.body).not.toEqual(resp.body)


  });


});
