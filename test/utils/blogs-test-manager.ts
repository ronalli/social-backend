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
      .post('/api/blogs')
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
      .get('/api/blogs')
      .auth(login, password, {
        type: 'basic',
      })
      .expect(statusCode);
  }

  async getBlog(
    id: string,
    statusCode: number = 200,
    login: string = 'admin',
    password: string = 'qwerty',
  ) {
    return request(this.app.getHttpServer())
      .get(`/api/blogs/${id}`)
      .auth(login, password, {
        type: 'basic',
      })
      .expect(statusCode);
  }
}
