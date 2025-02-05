import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { CreatePostSpecialPostModel } from './models/input/create-post.special.post.model';
import { serviceInfoLike } from '../../../../common/services/initialization.status.like';
import { BasicAuthGuard } from '../../../../common/guards/auth.basic.guard';
import { CustomValidationPipe } from '../../../../common/pipes/pipe';
import { QueryParamsDto } from '../../../../common/models/query-params.dto';
import { ValidateObjectIdPipe } from '../../../../common/pipes/validateObjectIdPipe';
import { AuthJwtGuard } from '../../../../common/guards/auth.jwt.guard';
import { LikeStatusModel } from '../../../likes/api/models/create-like.input.model';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  // @UseGuards(BasicAuthGuard)
  // @Post()
  // async createPost(
  //   @Body(CustomValidationPipe) createModel: any,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   const token = req.headers.authorization?.split(' ')[1] || 'unknown';
  //   const currentUser = await serviceInfoLike.getIdUserByToken(token);
  //
  //   const {title, shortDescription, content, blogId} = createModel;
  //
  //   const postId = await this.commandBus.execute(new CreatePostCommand(title, shortDescription, content, blogId, currentUser))
  //
  //   const post = await this.postsService.getPost(postId, currentUser)
  //
  //   res.status(201).send(post)
  // }

  @Get(':id')
  async getPost(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.postsService.getPost(id, null);

    if (!result) {
      throw new NotFoundException([{message: 'Not found post', field: 'postId'}])
    }
    res.status(200).send(result)
  }

  @Get()
  async getPosts(
    @Query() query: QueryParamsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const currentUser = await serviceInfoLike.getIdUserByToken(token);
    const result = await this.postsQueryRepository.getPosts(query, currentUser);

    res.status(200).send(result);
  }

  // @UseGuards(BasicAuthGuard)
  // @Put(':id')
  // @HttpCode(204)
  // async updatePost(
  //   @Param('id') id: string,
  //   @Body(CustomValidationPipe) updatePost: any,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   //  const {content, blogId, shortDescription, title, } = updatePost;
  //   //
  //   //  const result = await this.commandBus.execute(new UpdatePostCommand(id, content, blogId, shortDescription, title))
  //   //
  //   //  if(!result) throw new NotFoundException([{message: 'Not found post/blog', field: 'id'}])
  //   //
  //   // res.status(204).send(result);
  // }
  //
  // @UseGuards(BasicAuthGuard)
  // @Delete(':id')
  // @HttpCode(204)
  // async deletePost(@Param('id', ValidateObjectIdPipe) id: string) {
  //   // return await this.postsService.deletePost(id);
  // }
  //
  // @UseGuards(AuthJwtGuard)
  // @Post(':postId/comments')
  // async createCommentForSpecialPost(
  //   @Param('postId', ValidateObjectIdPipe) postId: string,
  //   @Body() data: CreatePostSpecialPostModel,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   // const userId = req.userId!;
  //   //
  //   // const result = await this.commandBus.execute(new CreateCommentCommand(data.content, postId, userId))
  //   //
  //   // if(!result) throw new BadRequestException([{message: 'Wrong', field: 'bad'}])
  //   //
  //   // res.status(201).send(result);
  // }
  //
  // @Get(':postId/comments')
  // async getAllCommentsForPost(
  //   @Param('postId', ValidateObjectIdPipe) postId: string,
  //   @Query() query: QueryParamsDto,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   // const token = req.headers.authorization?.split(' ')[1];
  //   //
  //   // const currentUser = await serviceInfoLike.getIdUserByToken(token);
  //   //
  //   // const result = await this.commentsService.findAllComments(postId, query, currentUser);
  //   //
  //   // res.status(200).send(result.data);
  // }
  //
  // @UseGuards(AuthJwtGuard)
  // @Put(':postId/like-status')
  // async updateLikeStatusForSpecialPost(
  //   @Param('postId', ValidateObjectIdPipe) commentId: string,
  //   @Body() status: LikeStatusModel,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   // const userId = req.userId!;
  //   // const login = req.login!;
  //   //
  //   // await this.commandBus.execute(new UpdateLikeStatusPostCommand(commentId, userId, status, login))
  //   //
  //   // return res.status(204).send({});
  // }
}
