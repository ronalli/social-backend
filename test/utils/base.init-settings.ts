import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply.app.setting';

export async function initAppAndClearDB(): Promise<{
  app: INestApplication;
  dataSource: DataSource;
}> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  applyAppSettings(app);

  await app.init();

  const dataSource = moduleFixture.get<DataSource>(DataSource);

  await clearDataBase(dataSource);

  return {
    app,
    dataSource,
  };
}

export async function clearDataBase(dataSource: DataSource): Promise<void> {
  await dataSource.query(
    `TRUNCATE TABLE public."users", public.blogs,  public.posts, public."postsLikeStatus", public."confirmationEmailUsers", public."recoveryCodes", public."oldRefreshTokens", public."deviceSessions" RESTART IDENTITY CASCADE;`,
  );
}

// `TRUNCATE TABLE public."users", public.blogs,  public.posts, public."commentsPosts", public."commentsLikeStatus", public."postsLikeStatus", public."oldRefreshTokens", public."recoveryCodes", public."confirmationEmailUsers", public."deviceSessions" RESTART IDENTITY CASCADE;`,
