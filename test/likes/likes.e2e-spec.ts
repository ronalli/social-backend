import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { initAppAndClearDB } from '../utils/base.init-settings';
import { servicePost } from '../utils/posts/service-post';
import { serviceUsers } from '../utils/users/service-users';
import { customRequest } from '../utils/custom-request';
import { randomUUID } from 'node:crypto';

describe('Likes e2e Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const setup = await initAppAndClearDB();
    app = setup.app;
    dataSource = setup.dataSource;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it(`shouldn't add like status by current post because be out authorization header`, async () => {
    const { postId, blogId } = await servicePost.createPost(app);

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .send({
        likeStatus: 'Like',
      })
      .expect(401);
  });

  it(`shouldn't add like status by not found current post`, async () => {
    const postId = randomUUID();
    const { accessToken } = await serviceUsers.authorizationUser(app);

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'Dislike',
      })
      .expect(404);
  });

  it(`shouldn't add like status incorrect input data`, async () => {
    const { postId, blogId } = await servicePost.createPost(app);
    const { accessToken } = await serviceUsers.authorizationUser(app);

    const { body } = await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'Super',
      })
      .expect(400);

    expect(body).toHaveProperty('errorsMessages')
    expect(body.errorsMessages).toHaveLength(1);
    expect(body.errorsMessages[0].message).toEqual(expect.any(String))
    expect(body.errorsMessages[0].field).toEqual('likeStatus')

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        LikeStatus: 'Like',
      })
      .expect(400);

  });

  it('should correct add likeStatus by post and update this status', async () => {
    const { postId, blogId } = await servicePost.createPost(app);
    const { accessToken } = await serviceUsers.authorizationUser(app, 'bob');

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);

    const { body: resp1 } = await customRequest(app)
      .get(`posts/${postId}`)
      .expect(200);

    expect(resp1.blogId).toBe(blogId);
    expect(resp1.id).toBe(postId);
    expect(resp1).toHaveProperty('extendedLikesInfo');
    expect(resp1.extendedLikesInfo.likesCount).toBe(1);
    expect(resp1.extendedLikesInfo.myStatus).toBe('None');
    expect(resp1.extendedLikesInfo).toHaveProperty('newestLikes');
    expect(resp1.extendedLikesInfo.newestLikes).toHaveLength(1);
    expect(resp1.extendedLikesInfo.newestLikes[0].login).toEqual('bob-1');

    const { body: resp2 } = await customRequest(app)
      .get(`posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(resp2.extendedLikesInfo.myStatus).toBe('Like');

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'Dislike',
      })
      .expect(204);

    const { body: resp3 } = await customRequest(app)
      .get(`posts/${postId}`)
      .expect(200)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(resp3.extendedLikesInfo.dislikesCount).toBe(1);
    expect(resp3.extendedLikesInfo.myStatus).toBe('Dislike');
  });
});
