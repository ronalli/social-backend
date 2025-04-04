import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import { customRequest } from '../utils/custom-request';
import { randomUUID } from 'node:crypto';
import { serviceUsers } from '../utils/users/service-users';
import { servicePost } from '../utils/posts/service-post';

describe('Comments e2e Tests', () => {
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

  it(`shouldn't return comment, because not found this comment`, async () => {
    await customRequest(app).get(`comments/${randomUUID()}`).expect(404);
  });

  it('should be correct create comment', async () => {

    const {postId, blogId} = await servicePost.createPost(app);

    const { accessToken } = await serviceUsers.authorizationUser(app);

    const resp = await customRequest(app).post(`posts/${postId}/comments`).set('Authorization', `Bearer ${accessToken}`).send({
      content: 'test one comment the best of the best'
    }).expect(201)

    expect(resp.body).toHaveProperty('commentatorInfo')
    expect(resp.body).toHaveProperty('likesInfo')
    expect(resp.body).toHaveProperty('createdAt')



  });
});
