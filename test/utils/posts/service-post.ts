import { INestApplication } from '@nestjs/common';
import { customRequest } from '../custom-request';
import { serviceBlogs } from '../blogs/service-blogs';

export const servicePost = {
  createPost: async (app: INestApplication) => {
    const blogId = await serviceBlogs.createBlog(app);

    const resp = await customRequest(app)
      .post(`sa/blogs/${blogId}/posts`)
      .set('Authorization', process.env.AUTH_HEADER)
      .send({
        title: 'post 1',
        shortDescription: 'description post 1',
        content: 'content post 1',
      })
      .expect(201);

    return { postId: resp.body.id, blogId };
  },

  createPosts: async (app: INestApplication, items: number = 5) => {
    const blogId = await serviceBlogs.createBlog(app);

    for (let i = 1; i <= items; i++) {
      await customRequest(app)
        .post(`sa/blogs/${blogId}/posts`)
        .set('Authorization', process.env.AUTH_HEADER)
        .send({
          title: `post ${i}`,
          shortDescription: `description post ${i}`,
          content: `content post ${i}`,
        })
        .expect(201);
    }
  },
};
