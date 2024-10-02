import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { BlogsTestManager } from './utils/blogs-test-manager';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { deleteAllData } from './utils/delete-all-data';

describe('Blogs Test', () => {

  let app: INestApplication;
  let connection: Connection;
  let blogTestManager: BlogsTestManager;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    blogTestManager = new BlogsTestManager(app);
    connection = app.get(getConnectionToken());

    await deleteAllData(connection);

    await app.init();
  })

  afterAll(async () => {
    await app.close()
  })


  it('correct create blog', async () => {

    const blogDto = {
      name: 'New blog',
      description: 'super mega new blog',
      websiteUrl: 'https://mega-blog.com'
    }

    const response = await blogTestManager.createBlog(blogDto)

    expect(response.body).toEqual({
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      id: expect.any(String),
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean)
    });

  })

  it('correct return all blogs', async () => {
    const blogDto = {
      name: 'New blog 1',
      description: 'super mega new blog 1',
      websiteUrl: 'https://mega1-blog.com'
    }

    await blogTestManager.createBlog(blogDto)

    const response = await blogTestManager.getAllBlogs();

    expect(response.body.totalCount).toEqual(2)

  })


})