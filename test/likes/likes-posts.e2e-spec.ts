import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { initAppAndClearDB } from '../utils/base.init-settings';
import { servicePost } from '../utils/posts/service-post';
import { serviceUsers } from '../utils/users/service-users';
import { customRequest } from '../utils/custom-request';
import { randomUUID } from 'node:crypto';

describe('Likes e2e Test by Posts', () => {
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

    expect(body).toHaveProperty('errorsMessages');
    expect(body.errorsMessages).toHaveLength(1);
    expect(body.errorsMessages[0].message).toEqual(expect.any(String));
    expect(body.errorsMessages[0].field).toEqual('likeStatus');

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

  it('correct update like status by `none`', async () => {
    const { postId, blogId } = await servicePost.createPost(app);
    const { accessToken } = await serviceUsers.authorizationUser(app, 'july');

    const resp = await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);

    const { body: post } = await customRequest(app)
      .get(`posts/${postId}`)
      .expect(200);

    expect(post.extendedLikesInfo.likesCount).toBe(1);
    expect(post.extendedLikesInfo.myStatus).toBe('None');
    expect(post.extendedLikesInfo.newestLikes[0].login).toEqual('july-1');

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'None',
      })
      .expect(204);

    const { body: post1 } = await customRequest(app)
      .get(`posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(post1.extendedLikesInfo.likesCount).toBe(0);
    expect(post1.extendedLikesInfo.myStatus).toBe('None');
    expect(post1.extendedLikesInfo.newestLikes.length).toEqual(0);
  });

  it('should correct return information about posts for different users', async () => {
    const { postId, blogId } = await servicePost.createPost(app);
    const { accessToken } = await serviceUsers.authorizationUser(app, 'greg');
    const { accessToken: at1 } = await serviceUsers.authorizationUser(
      app,
      'bob',
    );
    const { accessToken: at2 } = await serviceUsers.authorizationUser(
      app,
      'nick',
    );
    const { accessToken: at3 } = await serviceUsers.authorizationUser(
      app,
      'tron',
    );
    const { accessToken: at4 } = await serviceUsers.authorizationUser(
      app,
      'marta',
    );

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${at1}`)
      .send({
        likeStatus: 'Dislike',
      })
      .expect(204);

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${at2}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${at3}`)
      .send({
        likeStatus: 'Dislike',
      })
      .expect(204);

    const { body: post } = await customRequest(app)
      .get(`posts/${postId}`)
      .expect(200);

    expect(post.extendedLikesInfo.likesCount).toBe(2);
    expect(post.extendedLikesInfo.dislikesCount).toBe(2);
    expect(post.extendedLikesInfo.newestLikes.length).toBe(2);

    expect(post.extendedLikesInfo.newestLikes[0].login).toBe('nick-1');
    expect(post.extendedLikesInfo.newestLikes[1].login).toBe('greg-1');

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${at3}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);

    const { body: post1 } = await customRequest(app)
      .get(`posts/${postId}`)
      .expect(200);

    expect(post1.extendedLikesInfo.likesCount).toBe(3);
    expect(post1.extendedLikesInfo.dislikesCount).toBe(1);
    expect(post1.extendedLikesInfo.newestLikes.length).toBe(3);

    expect(post1.extendedLikesInfo.newestLikes[0].login).toBe('tron-1');
    expect(post1.extendedLikesInfo.newestLikes[1].login).toBe('nick-1');
    expect(post1.extendedLikesInfo.newestLikes[2].login).toBe('greg-1');

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${at4}`)
      .send({
        likeStatus: 'Dislike',
      })
      .expect(204);

    const { body: post2 } = await customRequest(app)
      .get(`posts/${postId}`)
      .set('Authorization', `Bearer ${at4}`)
      .expect(200);

    expect(post2.extendedLikesInfo.likesCount).toBe(3);
    expect(post2.extendedLikesInfo.dislikesCount).toBe(2);
    expect(post2.extendedLikesInfo.newestLikes.length).toBe(3);
    expect(post2.extendedLikesInfo.myStatus).toBe('Dislike');

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'None',
      })
      .expect(204);

    const { body: post3 } = await customRequest(app)
      .get(`posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(post3.extendedLikesInfo.likesCount).toBe(2);
    expect(post3.extendedLikesInfo.dislikesCount).toBe(2);
    expect(post3.extendedLikesInfo.newestLikes.length).toBe(2);
    expect(post3.extendedLikesInfo.myStatus).toBe('None');

    expect(post3.extendedLikesInfo.newestLikes[0].login).toBe('tron-1');
    expect(post3.extendedLikesInfo.newestLikes[1].login).toBe('nick-1');
  });

  it('should validate likeStatus input thoroughly', async () => {
    const { postId } = await servicePost.createPost(app);
    const { accessToken } = await serviceUsers.authorizationUser(app);

    const invalidInputs = [
      { likeStatus: '' },
      { likeStatus: null },
      { likeStatus: 'LIKE' },
      { likeStatus: 'like' },
      { likeStatus: ' Like' },
      {},
    ];

    for (const input of invalidInputs) {
      const { body } = await customRequest(app)
        .put(`posts/${postId}/like-status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(input)
        .expect(400);

      expect(body.errorsMessages).toHaveLength(1);
      expect(body.errorsMessages[0].field).toBe('likeStatus');
    }
  });

  it('should correctly calculate dislikes statistics', async () => {
    const { postId } = await servicePost.createPost(app);
    const { accessToken: token1 } = await serviceUsers.authorizationUser(
      app,
      'user1',
    );
    const { accessToken: token2 } = await serviceUsers.authorizationUser(
      app,
      'user2',
    );

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ likeStatus: 'Dislike' });

    await customRequest(app)
      .put(`posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ likeStatus: 'Dislike' });

    const { body } = await customRequest(app)
      .get(`posts/${postId}`)
      .expect(200);

    expect(body.extendedLikesInfo.dislikesCount).toBe(2);
    expect(body.extendedLikesInfo.likesCount).toBe(0);
    expect(body.extendedLikesInfo.newestLikes).toHaveLength(0);
  });

  it('should limit newestLikes to last N users', async () => {
    const { postId } = await servicePost.createPost(app);

    const users = await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        serviceUsers.authorizationUser(app, `user${i}`)
      )
    );

    for (const { accessToken } of users) {
      await customRequest(app)
        .put(`posts/${postId}/like-status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ likeStatus: 'Like' });
    }

    const { body } = await customRequest(app)
      .get(`posts/${postId}`)
      .expect(200);

    expect(body.extendedLikesInfo.likesCount).toBe(5);
    expect(body.extendedLikesInfo.newestLikes).toHaveLength(3);
    expect(body.extendedLikesInfo.newestLikes[0].login).toBe('user4-1');
  });

});
