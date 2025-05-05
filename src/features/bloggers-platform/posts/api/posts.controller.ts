import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { CommentsService } from '../../comments/application/comments.service';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostSpecialPostModel } from './models/input/create-post.special.post.model';
import { QueryParamsDto } from '../../../../common/models/query-params.dto';
import { ValidateObjectIdPipe } from '../../../../common/pipes/validateObjectIdPipe';
import { AuthJwtGuard } from '../../../../common/guards/auth.jwt.guard';
import { CreateCommentCommand } from '../../comments/application/usecases/create-comment.usecase';
import { UpdateLikeStatusPostCommand } from '../application/usecases/update-likeStatus.post.usecase';
import { LikeStatusEntity } from '../../../likes/domain/like.entity';
import { jwtService } from '../../../../common/services/jwt.service';
import { HTTP_STATUSES } from '../../../../settings/http.status';
import {
  User,
  UserDecorator,
} from '../../../../common/decorators/validate/user.decorator';

@ApiTags('Posts')
@Controller('')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly commentsService: CommentsService,
  ) {}

  // @UseGuards(BasicAuthGuard)
  // @Post('sa/posts')
  // async createPost(
  //   @Body(CustomValidationPipe) createModel: any,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   const token = req.headers.authorization?.split(' ')[1] || 'unknown';
  //   const currentUser = await serviceInfoLike.getIdUserByToken(token);
  //
  //   const { title, shortDescription, content, blogId } = createModel;
  //
  //   const postId = await this.commandBus.execute(
  //     new CreatePostCommand(
  //       title,
  //       shortDescription,
  //       content,
  //       blogId,
  //       currentUser,
  //     ),
  //   );
  //
  //   const post = await this.postsService.getPost(postId, currentUser);
  //
  //   res.status(201).send(post);
  // }

  @UseGuards(AuthJwtGuard)
  @Put('posts/:postId/like-status')
  @HttpCode(HTTP_STATUSES.NotContent)
  async updateLikeStatusForSpecialPost(
    @Param('postId', ValidateObjectIdPipe) postId: string,
    @Body() data: LikeStatusEntity,
    @User() user: UserDecorator,
  ) {
    const { id: userId, login } = user;

    const foundedPost = await this.postsQueryRepository.isPostDoesExist(postId);

    if (!foundedPost) this.throwPostNotFoundException();

    await this.commandBus.execute(
      new UpdateLikeStatusPostCommand(postId, userId, data.likeStatus, login),
    );
    return;
  }

  @Get('posts/:postId/comments')
  @HttpCode(HTTP_STATUSES.Success)
  async getAllCommentsForPost(
    @Param('postId', ValidateObjectIdPipe) postId: string,
    @Query() query: QueryParamsDto,
    @Headers('authorization') authHeader: string,
  ) {
    const foundedPost = await this.postsQueryRepository.isPostDoesExist(postId);

    if (!foundedPost) this.throwPostNotFoundException();

    const token = authHeader?.split(' ')[1];
    return await this.commentsService.findAllComments(token, postId, query);
  }

  @UseGuards(AuthJwtGuard)
  @Post('posts/:postId/comments')
  @HttpCode(HTTP_STATUSES.Created)
  async createCommentForSpecialPost(
    @Param('postId', ValidateObjectIdPipe) postId: string,
    @Body() comment: CreatePostSpecialPostModel,
    @User('id') userId: string,
  ) {
    const result = await this.commandBus.execute(
      new CreateCommentCommand(comment.content, postId, userId),
    );

    if (!result)
      throw new BadRequestException([{ message: 'Wrong', field: 'bad' }]);

    return await this.commentsService.getOneComment(userId, result.id);
  }

  @Get('posts')
  @HttpCode(HTTP_STATUSES.Success)
  async getPosts(
    @Query() query: QueryParamsDto,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.split(' ')[1];
    return await this.postsService.getAllPosts(token, query);
  }

  @Get('posts/:id')
  @HttpCode(HTTP_STATUSES.Success)
  async getPost(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Headers('authorization') authHeader: string,
  ) {
    const foundedPost = await this.postsQueryRepository.isPostDoesExist(id);

    if (!foundedPost) this.throwPostNotFoundException();

    const token = authHeader?.split(' ')[1] || '';
    const userId = await jwtService.getUserIdByToken(token);
    return await this.postsService.getPost(id, userId);
  }

  // @UseGuards(BasicAuthGuard)
  // @Put('posts/:id')
  // @HttpCode(204)
  // async updatePost(
  //   @Param('id') id: string,
  //   @Body(CustomValidationPipe) updatePost: any,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   const { content, blogId, shortDescription, title } = updatePost;
  //
  //   const result = await this.commandBus.execute(
  //     new UpdatePostCommand(id, content, blogId, shortDescription, title),
  //   );
  //
  //   if (!result)
  //     throw new NotFoundException([
  //       { message: 'Not found post/blog', field: 'id' },
  //     ]);
  //
  //   res.status(204).send(result);
  // }

  // @UseGuards(BasicAuthGuard)
  // @Delete('posts/:id')
  // @HttpCode(204)
  // async deletePost(@Param('id', ValidateObjectIdPipe) id: string) {
  //   return await this.postsService.deletePost(id);
  // }

  private throwPostNotFoundException(): never {
    throw new NotFoundException([
      {
        message: `If post with specified postId doesn\'t exists`,
        field: 'postId',
      },
    ]);
  }
}
