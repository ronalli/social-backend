import { INestApplication } from '@nestjs/common';
import { customRequest } from '../custom-request';
import * as process from 'node:process';

export const serviceBlogs = {

  createBlog: async (app: INestApplication) => {

    await customRequest(app).post('sa/blogs').set('Authorization', process.env.AUTH_HEADER).send({
      name: 'blog 1',
      description: 'blog 1 description',
      websiteUrl: 'https://someblog1.com',
    }).expect(201);

  },

  createBlogs: async (app: INestApplication, items: number) => {

    for(let i = 1; i <=items; i++) {
      await customRequest(app).post('sa/blogs').set('Authorization', process.env.AUTH_HEADER).send({
        name: `blog ${i}`,
        description: `blog ${i} description`,
        websiteUrl: `https://someblog${i}.com`,
      }).expect(201);
    }


  }


}