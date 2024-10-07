import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { BlogsTestManager } from './utils/blogs-test-manager';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { deleteAllData } from './utils/delete-all-data';
import { initSettingsBlogs } from './utils/init-settings-blogs';
import { BlogsService } from '../src/features/bloggers-platform/blogs/application/blogs.service';
import { BlogsRepository } from '../src/features/bloggers-platform/blogs/infrastructure/blogs.repository';
import { BlogsServiceMock } from './mock/blogs.service.mock';

describe('Blogs Test', () => {
  let app: INestApplication;
  let blogTestManager: BlogsTestManager;

  beforeAll(async () => {
    const result = await initSettingsBlogs((moduleBuilder) =>
      moduleBuilder.overrideProvider(BlogsService).useFactory({
        factory: (repo: BlogsRepository) => {
          return new BlogsServiceMock(repo);
        },
        inject: [BlogsRepository],
      }),
    );

    app = result.app;
    blogTestManager = result.blogsTestManger;

    // const module = await Test.createTestingModule({
    //   imports: [AppModule],
    // }).compile();
    //
    // app = module.createNestApplication();
    // blogTestManager = new BlogsTestManager(app);
    // connection = app.get(getConnectionToken());
    //
    // await deleteAllData(connection);
    //
    // await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('correct create blog', async () => {
    const blogDto = {
      name: 'New blog',
      description: 'super mega new blog',
      websiteUrl: 'https://mega-blog.com',
    };

    const response = await blogTestManager.createBlog(blogDto);

    expect(response.body).toEqual({
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      id: expect.any(String),
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });

  it('correct return all blogs', async () => {
    const blogDto = {
      name: 'New blog 1',
      description: 'super mega new blog 1',
      websiteUrl: 'https://mega1-blog.com',
    };

    await blogTestManager.createBlog(blogDto);

    const response = await blogTestManager.getAllBlogs();

    expect(response.body.totalCount).toEqual(2);
  });

  it("shouldn't created blog, because not correct authorization header", async () => {
    const blogDto = {
      name: 'New blog 2',
      description: 'super mega new blog 2',
      websiteUrl: 'https://mega2-blog.com',
    };

    const response = await blogTestManager.createBlog(
      blogDto,
      401,
      'bob',
      'marly',
    );

    expect(response.statusCode).toBe(401);
  });

  it("shouldn't created blog, because not correct data", async () => {
    const blogDto = {
      name: 'n',
      description: 's',
      websiteUrl: 'htt:',
    };

    const response = await blogTestManager.createBlog(blogDto, 400);

    expect(response.statusCode).toBe(400);
    expect(response.body.errorsMessages.length).toEqual(3)
  });
});
