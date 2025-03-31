import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import { DataSource } from 'typeorm';
import { customRequest } from '../utils/custom-request';

describe('Blogs e2e Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
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
    expect(res.body.description).toBe(
      'this is the best courses in the world',
    );
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
        description: 'this ',
        websiteUrl: 'https//incubator.com',
      })
      .expect(400);

    expect(res.body).toHaveProperty('errorsMessages')
    expect(res.body.errorsMessages.length).toBe(3)

  });
});
