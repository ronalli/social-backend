import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query-repository';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { QueryParamsDto } from '../../../../common/models/query-params.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository, private readonly postsQueryRepository: PostsQueryRepository) {
  }

  // async update(id: string, content: string, userId: string) {
  //
  //   const result = await this.commentsRepository.getCommentById(id);
  //   if (!result) {
  //     return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null}
  //   }
  //   if (result && userId !== result.commentatorInfo.userId) {
  //     return {
  //       status: ResultCode.Forbidden,
  //       errorMessage: 'Try edit the comment that is not your own',
  //       data: null
  //     }
  //   }
  //   return await this.commentsRepository.updateComment(id, content);
  // }
  //
  // async delete(id: string, userId: string) {
  //   const result = await this.commentsRepository.getCommentById(id);
  //
  //   if (!result) {
  //     return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null}
  //   }
  //   if (result && userId !== result.commentatorInfo.userId) {
  //     return {
  //       status: ResultCode.Forbidden,
  //       errorMessage: 'Try edit the comment that is not your own',
  //       data: null
  //     }
  //   }
  //   return await this.commentsRepository.deleteComment(id);
  // }
  //
  // async create(data: CommentCreateModel) {
  //   const {postId} = data;
  //   const findPost = await this.postsQueryRepository.getPostById(postId);
  //   // if (findPost.errorMessage) {
  //   //   return findPost
  //   // }
  //   return this.commentsRepository.addComment(data);
  // }

  async findAllComments(postId: string, queryParams: QueryParamsDto, currentUser: string | null) {

    const result = await this.postsQueryRepository.getPostById(postId);

    if (result) {
      return await this.commentsRepository.getCommentsForSpecialPost(postId, queryParams, currentUser)
    }

    throw new NotFoundException([{message: 'If post for passed postId doesn\'t exist', field: 'postId'}])
  }

  // async updateLikeStatus(dataLike: Omit<ILikeTypeDB, 'addedAt'>) {
  //   const comment = await this.commentsRepository.getCommentById(dataLike.parentId)
  //
  //   if (!comment) {
  //     return {
  //       status: ResultCode.BadRequest,
  //       data: null,
  //       errorsMessages: [
  //         {
  //           "message": "Wrong",
  //           "field": 'comment id'
  //         }
  //       ]
  //     }
  //   }
  //
  //   const searchLike = await this.commentsRepository.getCurrentLike(dataLike.parentId, dataLike.userId)
  //
  //   if (!searchLike) {
  //     await this.commentsRepository.addStatusLike(dataLike)
  //     dataLike.status === LikeStatus.Like
  //       ? comment.likesCount += 1
  //       : dataLike.status === 'None'
  //         ? ''
  //         : comment.dislikesCount += 1;
  //
  //     await comment.save();
  //
  //     return {status: ResultCode.NotContent, data: null}
  //   }
  //
  //   return await this.commentsRepository.updateStatusLike(dataLike, comment);
  // }
}