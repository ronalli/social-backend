import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { customRequest } from '../utils/custom-request';
import { randomUUID } from 'node:crypto';
import { serviceUsers } from '../utils/users/service-users';
import { servicePost } from '../utils/posts/service-post';
import { serviceComments } from '../utils/comments/service-comments';
import { jwtService } from '../../src/common/services/jwt.service';
import { initAppAndClearDB } from '../utils/base.init-settings';

describe('Comments e2e Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let commendId: string;

  beforeAll(async () => {
    const setup = await initAppAndClearDB();
    app = setup.app;
    dataSource = setup.dataSource;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it(`shouldn't return comment, because not found this comment`, async () => {
    await customRequest(app).get(`comments/${randomUUID()}`).expect(404);
  });

  it('should be correct create comment', async () => {
    const { postId, blogId } = await servicePost.createPost(app);

    const { accessToken } = await serviceUsers.authorizationUser(app);

    const resp = await customRequest(app)
      .post(`posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'test one comment the best of the best',
      })
      .expect(201);

    commendId = resp.body.id;

    expect(resp.body).toHaveProperty('commentatorInfo');
    expect(resp.body).toHaveProperty('likesInfo');
    expect(resp.body).toHaveProperty('createdAt');
  });

  it('should be correct return comment by id', async () => {
    
    const {comment, accessToken} = await serviceComments.createComment(app, 'john')
    
    const resp = await customRequest(app)
      .get(`comments/${comment.id}`)
      .expect(200);


    expect(resp.body.id).toEqual(comment.id);
    expect(resp.body).toHaveProperty('commentatorInfo');
    expect(resp.body).toHaveProperty('likesInfo');
    expect(resp.body).toHaveProperty('createdAt');
  });

  it('should be correct return all comment for special post', async () => {
    const { postId } = await serviceComments.createComments(app, 5, 'kill');

    const resp = await customRequest(app)
      .get(`posts/${postId}/comments`)
      .expect(200);

    expect(resp.body.totalCount).toBe(5);
  });

  it('should be correct delete comment by id', async () => {
    const { comment, accessToken } = await serviceComments.createComment(app, 'nick');

    await customRequest(app)
      .delete(`comments/${comment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    await customRequest(app).get(`comments/${comment.id}`).expect(404);
  });

  it(`shouldn't update comment because incorrect accessToken and return 403`, async () => {
    const { accessToken: tokenBob } = await serviceUsers.authorizationUser(
      app,
      'bob',
    );

    const { comment, accessToken } = await serviceComments.createComment(app, 'greg');

    await customRequest(app)
      .put(`comments/${comment.id}`)
      .send({
        content: 'this is a comment not my',
      })
      .set('Authorization', `Bearer ${tokenBob}`)
      .expect(403);

    await customRequest(app)
      .delete(`comments/${comment.id}`)
      .set('Authorization', `Bearer ${tokenBob}`)
      .expect(403);
  });

  it(`shouldn't create new comment`, async () => {
    const { accessToken } = await serviceUsers.authorizationUser(app, 'alex');

    const { postId, blogId } = await servicePost.createPost(app);

    const resp = await customRequest(app)
      .post(`posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        text: 'this is a comment not my',
      })
      .expect(400);

    expect(resp.body).toHaveProperty('errorsMessages');
    expect(resp.body.errorsMessages[0].message).toEqual(expect.any(String));
  });

  it('should be correct return all comments with using parameters', async () => {
    const { postId } = await serviceComments.createComments(app, 6, 'tron');

    const resp = await customRequest(app)
      .get(`posts/${postId}/comments`)
      .expect(200);

    expect(resp.body.pagesCount).toEqual(1);
    expect(resp.body.totalCount).toEqual(6);
    expect(resp.body.pageSize).toEqual(10);
    expect(resp.body.items.length).toEqual(6);
    expect(resp.body.items[0].content).toMatch(/^test 6/);

    const resp1 = await customRequest(app)
      .get(`posts/${postId}/comments?pageSize=2&sortDirection=asc`)
      .expect(200);

    expect(resp1.body.totalCount).toEqual(6);
    expect(resp1.body.items).toHaveLength(2);
    expect(resp1.body.pagesCount).toBe(3);
    expect(resp1.body.items[0].content).toMatch(/^test 1/);
  });
});
