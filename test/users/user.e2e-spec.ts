import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';

describe('Users e2e Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    applyAppSettings(app);

    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    await dataSource.query(`TRUNCATE TABLE public."users", public.blogs,  public.posts, public."commentsPosts", public."commentsLikeStatus", public."postsLikeStatus", public."oldRefreshTokens", public."recoveryCodes", public."confirmationEmailUsers", public."deviceSessions" RESTART IDENTITY CASCADE;`)


  });
  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });


  it('should connect DB', async () => {
    const res = await dataSource.query('SELECT 1 + 1 AS result');
    expect(res[0].result).toBe(2);
  })

  it('should correct add user', async () => {


    // console.log(a);

    const res = await request(app.getHttpServer()).post('/api/sa/users').set('Authorization', process.env.AUTH_HEADER).send({
      "login": "bob",
      "email": "bob@example.com",
      "password": "12345678",

    })

    // console.log(res);

  })

});
