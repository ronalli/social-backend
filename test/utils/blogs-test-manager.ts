import { INestApplication } from '@nestjs/common';
import { BlogCreateModel } from '../../src/features/bloggers-platform/blogs/api/models/input/create-blog.input.model';
import request from 'supertest';

export class BlogsTestManager {
  constructor(protected readonly app: INestApplication) {}

  async createBlog(
    createModel: BlogCreateModel,
    statusCode: number = 201,
    login: string = 'admin',
    password: string = 'qwerty',
  ) {
    return request(this.app.getHttpServer())
      .post('/blogs')
      .auth(login, password, {
        type: 'basic',
      })
      .send(createModel)
      .expect(statusCode);
  }

  async getAllBlogs(
    statusCode: number = 200,
    login: string = 'admin',
    password: string = 'qwerty',
  ) {
    return request(this.app.getHttpServer())
      .get('/blogs')
      .auth(login, password, {
        type: 'basic',
      }).expect(statusCode)
  }
}
