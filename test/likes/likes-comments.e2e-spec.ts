import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { initAppAndClearDB } from '../utils/base.init-settings';
import { serviceUsers } from '../utils/users/service-users';
import { customRequest } from '../utils/custom-request';
import { randomUUID } from 'node:crypto';
import { serviceComments } from '../utils/comments/service-comments';

describe('Likes e2e Test by Comments', () => {
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

  it(`shouldn't add like status by current comment, because be out authorization header`, async () => {
    const { accessToken, comment } = await serviceComments.createComment(app);
    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .expect(401);
  });

  it(`shouldn't add like status by current comment, because incorrect body`, async () => {
    const { accessToken, comment } = await serviceComments.createComment(app);
    const { body } = await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'Like',
      })
      .expect(400);

    expect(body).toHaveProperty('errorsMessages');
    expect(body.errorsMessages).toHaveLength(1);
    expect(body.errorsMessages[0].message).toEqual(expect.any(String));
    expect(body.errorsMessages[0].field).toEqual('likeStatus');
  });

  it(`shouldn't add like status by comment, because this comment isn't found`, async () => {
    const { accessToken, comment } = await serviceComments.createComment(app);
    await customRequest(app)
      .put(`comments/${randomUUID()}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(404);
  });

  it(`should add like status by current comment`, async () => {
    const { accessToken, comment } = await serviceComments.createComment(app);
    const { accessToken: at1 } = await serviceUsers.authorizationUser(
      app,
      'bob',
    );

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${at1}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'Dislike',
      })
      .expect(204);

    const { body: respComment } = await customRequest(app)
      .get(`comments/${comment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(respComment.id).toEqual(comment.id);
    expect(respComment.commentatorInfo.userLogin).toEqual('test-1');
    expect(respComment.likesInfo.likesCount).toBe(1);
    expect(respComment.likesInfo.dislikesCount).toBe(1);
    expect(respComment.likesInfo.myStatus).toEqual('Dislike');
  });

  it('should correct add likeStatus by comment and update this status', async () => {
    const { accessToken, comment } = await serviceComments.createComment(app);

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);

    const { body: comment1 } = await customRequest(app)
      .get(`comments/${comment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(comment1.likesInfo.likesCount).toBe(1);
    expect(comment1.likesInfo.dislikesCount).toBe(0);
    expect(comment1.likesInfo.myStatus).toBe('Like');

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'None',
      })
      .expect(204);

    const { body: comment2 } = await customRequest(app)
      .get(`comments/${comment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(comment2.likesInfo.likesCount).toBe(0);
    expect(comment2.likesInfo.dislikesCount).toBe(0);
    expect(comment2.likesInfo.myStatus).toBe('None');

    const { body: comment3 } = await customRequest(app)
      .get(`comments/${comment.id}`)
      .expect(200);
    expect(comment3.likesInfo.likesCount).toBe(0);
    expect(comment3.likesInfo.dislikesCount).toBe(0);
    expect(comment3.likesInfo.myStatus).toBe('None');
  });

  it('should correct return information about comment for different users', async () => {
    const { accessToken, comment } = await serviceComments.createComment(app);
    const { accessToken: at1 } = await serviceUsers.authorizationUser(
      app,
      'greg',
    );
    const { accessToken: at2 } = await serviceUsers.authorizationUser(
      app,
      'bob',
    );
    const { accessToken: at3 } = await serviceUsers.authorizationUser(
      app,
      'nick',
    );
    const { accessToken: at4 } = await serviceUsers.authorizationUser(
      app,
      'tron',
    );
    const { accessToken: at5 } = await serviceUsers.authorizationUser(
      app,
      'marta',
    );

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${at1}`)
      .send({
        likeStatus: 'Dislike',
      })
      .expect(204);

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${at2}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${at3}`)
      .send({
        likeStatus: 'Dislike',
      })
      .expect(204);

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${at4}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);

    const { body: respComment } = await customRequest(app)
      .get(`comments/${comment.id}`)
      .expect(200);

    expect(respComment.likesInfo.likesCount).toBe(3);
    expect(respComment.likesInfo.dislikesCount).toBe(2);
    expect(respComment.likesInfo.myStatus).toBe('None');

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${at5}`)
      .send({
        likeStatus: 'Dislike',
      })
      .expect(204);

    const { body: respComment1 } = await customRequest(app)
      .get(`comments/${comment.id}`)
      .set('Authorization', `Bearer ${at1}`)
      .expect(200);

    expect(respComment1.likesInfo.likesCount).toBe(3);
    expect(respComment1.likesInfo.dislikesCount).toBe(3);
    expect(respComment1.likesInfo.myStatus).toBe('Dislike');

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${at3}`)
      .send({
        likeStatus: 'None',
      })
      .expect(204);

    await customRequest(app)
      .put(`comments/${comment.id}/like-status`)
      .set('Authorization', `Bearer ${at4}`)
      .send({
        likeStatus: 'None',
      })
      .expect(204);

    const { body: respComment2 } = await customRequest(app)
      .get(`comments/${comment.id}`)
      .set('Authorization', `Bearer ${at4}`)
      .expect(200);

    expect(respComment2.likesInfo.likesCount).toBe(2);
    expect(respComment2.likesInfo.dislikesCount).toBe(2);
    expect(respComment2.likesInfo.myStatus).toBe('None');
  });
});
