import { INestApplication } from '@nestjs/common';
import { BlogsTestManager } from './utils/blogs-test-manager';
import { BlogsService } from '../src/features/bloggers-platform/blogs/application/blogs.service';
import { BlogsServiceMock } from './mock/blogs.service.mock';
import { initBaseSettings } from './utils/base.init-settings';
import { BlogsRepository } from '../src/features/bloggers-platform/blogs/infrastructure/blogs.repository';

describe('Blogs Test', () => {
  let app: INestApplication;
  let blogTestManager: BlogsTestManager;

  beforeAll(async () => {

   const result = await initBaseSettings([{
      provider: BlogsService, useValue: BlogsServiceMock
    }], (moduleBuilder) =>
     moduleBuilder.overrideProvider(BlogsService).useFactory({
       factory: (repo: BlogsRepository) => {
         return new BlogsServiceMock(repo);
       },
       inject: [BlogsRepository],
     }))

    app = result.app;
    blogTestManager = new BlogsTestManager(app);

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

  it('should created blog, and return correct data', async () => {
    const blogDto = {
      name: 'New blog 3',
      description: 'super mega new blog 3',
      websiteUrl: 'https://mega3-blog.com',
    }
    const response = await blogTestManager.createBlog(blogDto);

    const result = await blogTestManager.getBlog(response.body.id)

    expect(response.body).toEqual({
      createdAt: expect.any(String),
      name: result.body.name,
      description: result.body.description,
      websiteUrl: result.body.websiteUrl,
      id: result.body.id,
      isMembership: expect.any(Boolean)
    })

  })

});
