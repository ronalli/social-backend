import { Injectable } from '@nestjs/common';
import { MappingsCommentsService } from '../application/mappings/mapping.comments';
import { UpdateLikeStatusCommentCommand } from '../application/usecases/update-likeStatus.usecase';
import { InputCommentModel } from '../api/models/input/update-comment.model';
import { QueryParamsService } from '../../../../common/utils/create.default.values';
import { QueryParamsDto } from '../../../../common/models/query-params.dto';
import { CommentCreateModel } from '../api/models/input/create-comment.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from '../domain/comment.entity';

export interface ILikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
}

@Injectable()
export class CommentsTypeOrmRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    private readonly queryParamsService: QueryParamsService,
    private readonly mappingsCommentsService: MappingsCommentsService,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async updateComment(
    id: string,
    contentUpdate: InputCommentModel,
  ): Promise<boolean> {
    const query = await this.commentsRepository.update(id, contentUpdate);

    return query.affected === 1;
  }

  async deleteComment(id: string): Promise<boolean> {
    const query = await this.commentsRepository.delete(id);

    return query.affected === 1;
  }

  async createComment(comment: Comment): Promise<string> {
    const commentCreated = this.commentsRepository.create(comment);

    const result = await this.commentsRepository.save(commentCreated);

    return result.id;
  }

  // async addComment(data: CommentCreateModel) {
  //   // const result = await this.usersQueryRepository.findUserById(data.userId);
  //   // try {
  //   //   const newComment = new this.CommentModel({
  //   //     // _id: new Types.ObjectId(),
  //   //     postId: data.postId,
  //   //     content: data.content,
  //   //     createdAt: new Date().toISOString(),
  //   //     commentatorInfo: {
  //   //       userId: data.userId,
  //   //       userLogin: result.login,
  //   //     },
  //   //     likesCount: 0,
  //   //     dislikesCount: 0,
  //   //   });
  //   //   const response = await newComment.save();
  //   //   const comment = await this.CommentModel.findOne({ _id: new ObjectId(response._id) });
  //   //
  //   //   const likesInfo: ILikesInfoViewModel = {
  //   //     likesCount: 0,
  //   //     dislikesCount: 0,
  //   //     myStatus: 'None',
  //   //   };
  //   //
  //   //   if (comment) {
  //   //     const res = this.mappingsCommentsService.formatCommentForView(comment, likesInfo);
  //   //     return { status: ResultCode.Created, data: res };
  //   //   }
  //   //   return { errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null };
  //   // } catch (e) {
  //   //   return { errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null };
  //   // }
  // }

  // async addStatusLike(like: LikeDocument) {
  //   // try {
  //   //   const insertResult = await this.LikeModel.insertMany([like]);
  //   //   return insertResult[0].id;
  //   // } catch (e) {
  //   //   throw new InternalServerErrorException(e);
  //   // }
  // }

  async updateStatusLike() // comment: CommentDocument, // like: UpdateLikeStatusCommentCommand,
  {
    // const currentStatus = await this.LikeModel.findOne({
    //   $and: [{ userId: like.userId }, { parentId: like.parentId }],
    // });
    //
    // if (!currentStatus) {
    //   throw new BadRequestException([
    //     { message: 'If the inputModel has incorrect values', field: 'status' },
    //   ]);
    // }
    //
    // if(like.status.likeStatus === LikeStatus.None) {
    //   await this.LikeModel.deleteOne({$and: [{ userId: like.userId }, { parentId: like.parentId }]})
    //
    //   currentStatus.status === LikeStatus.Like ? comment.likesCount -=1 : comment.dislikesCount -= 1;
    //
    //   await comment.save()
    //
    //   return true;
    // }
    //
    // if (currentStatus.status === like.status.likeStatus) {
    //   return true
    // }
    //
    // if (like.status.likeStatus === LikeStatus.Like) {
    //   comment.likesCount += 1;
    //   comment.dislikesCount -= 1;
    // } else  {
    //   comment.likesCount -= 1;
    //   comment.dislikesCount += 1;
    // }
    //
    // currentStatus.status = like.status.likeStatus;
    //
    // await comment.save();
    //
    // await currentStatus.save();
    //
    // return true;
  }

  async getCommentById(id: string) {
    // return this.CommentModel.findOne({ _id: new ObjectId(id) });
  }

  async getCommentsForSpecialPost(
    postId: string,
    queryParams: QueryParamsDto,
    currentUser: string | null,
  ) {
    // const query =
    //   this.queryParamsService.createDefaultValuesQueryParams(queryParams);
    //
    // try {
    //   const filter = { postId: postId };
    //   const comments = await this.CommentModel.find(filter)
    //     .sort({ [query.sortBy]: query.sortDirection })
    //     .skip((query.pageNumber - 1) * query.pageSize)
    //     .limit(query.pageSize);
    //
    //   const totalCount = await this.CommentModel.countDocuments(filter);
    //
    //   return {
    //     data: {
    //       pagesCount: Math.ceil(totalCount / query.pageSize),
    //       pageSize: query.pageSize,
    //       page: query.pageNumber,
    //       totalCount,
    //       items:
    //         await this.mappingsCommentsService.formatDataAllCommentsForView(
    //           comments,
    //           currentUser,
    //           this.LikeModel,
    //         ),
    //     },
    //   };
    // } catch (e) {
    //   throw new InternalServerErrorException(e);
    // }
  }

  async getCurrentLike(parentId: string, userId: string) {
    // return this.LikeModel.findOne({
    //   $and: [{ userId: userId }, { parentId: parentId }],
    // });
  }
}
