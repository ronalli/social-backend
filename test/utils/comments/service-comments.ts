import { INestApplication } from '@nestjs/common';
import { serviceUsers } from '../users/service-users';
import { customRequest } from '../custom-request';
import { servicePost } from '../posts/service-post';
import { CommentOutputModel } from '../../../src/features/bloggers-platform/comments/api/models/output/comment.output.model';

export const serviceComments = {
  createComment: async (app: INestApplication, name: string) => {
    const { postId, blogId } = await servicePost.createPost(app);
    const { accessToken } = await serviceUsers.authorizationUser(app, name);

    const resp = await customRequest(app)
      .post(`posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'test one comment the best of the best',
      })
      .expect(201);


    return { comment: resp.body, accessToken };
  },

  createComments: async (app: INestApplication, count: number = 5, name: string) => {
    const { postId, blogId } = await servicePost.createPost(app);
    const { accessToken } = await serviceUsers.authorizationUser(app, name);

    for (let i = 1; i <= count; i++) {
      await customRequest(app)
        .post(`posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: `test ${i} comment the best of the best`,
        })
        .expect(201);
    }

    return { postId };
  },
};
