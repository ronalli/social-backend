import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import {
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
import { HTTP_STATUSES } from '../../../settings/http.status';
import { PostCreateModel } from './models/input/create-post.input.model';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { CommentsService } from '../../comments/application/comments.service';
import { QueryParamsDto } from '../../../common/models/query-params.dto';
import { serviceInfoLike } from '../../../common/services/initialization.status.like';
import { BasicAuthGuard } from '../../../common/guards/auth.basic.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
import { ValidateObjectIdPipe } from '../../../common/pipes/validateObjectIdPipe';


@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService, private readonly commentsService: CommentsService, private readonly postsQueryRepository: PostsQueryRepository, private readonly commandBus: CommandBus) {
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() createModel: PostCreateModel, @Req() req: Request, @Res() res: Response) {

    const token = req.headers.authorization?.split(' ')[1] || 'unknown';
    const currentUser = await serviceInfoLike.getIdUserByToken(token);

    const {title, shortDescription, content, blogId} = createModel;

    const result = await this.commandBus.execute(new CreatePostCommand(title, shortDescription, content, blogId, currentUser))

    res.status(201).send(result)

  }

  @Get(':id')
  async getPost(@Param() id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization?.split(' ')[1];

    const currentUser = await serviceInfoLike.getIdUserByToken(token);

    const result = await this.postsService.getPost(id, currentUser);

    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data);
      return;
    }
    res.status(HTTP_STATUSES[result.status]).send({ errorMessage: result.errorMessage });
    return;
  }

  @Get()
  async getPosts(@Query() query: QueryParamsDto, @Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization?.split(' ')[1];

    const currentUser = await serviceInfoLike.getIdUserByToken(token);

    const result = await this.postsQueryRepository.getPosts(query, currentUser);

    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data);
      return;
    }
    res.status(HTTP_STATUSES[result.status]).send({ errorMessage: result.errorMessage });
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePost(@Param('id', ValidateObjectIdPipe) id: string, @Body() updatePost: PostCreateModel) {

    const {content, blogId, shortDescription, title, } = updatePost;

    const result = await this.commandBus.execute(new UpdatePostCommand(id, content, blogId, shortDescription, title))

    if(!result) throw new NotFoundException([{message: 'Not found', field: 'post id'}])

    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deletePost(@Param() id: string, @Req() req: Request, @Res() res: Response) {
    const result = await this.postsService.deletePost(id);
    if (result.errorMessage) {
      res.status(HTTP_STATUSES[result.status]).send({ errorMessage: result.errorMessage, data: result.data });
      return;
    }
    res.status(HTTP_STATUSES[result.status]).send({});
  }

  ///!!! any

  // @Post(':postId/comments')
  // async createCommentForSpecialPost(@Param() postId: string, @Body() content: any, @Req() req: Request, @Res() res: Response) {
  //   const userId = req.userId!;
  //   const result = await this.commentsService.create({ postId, userId, content });
  //
  //   if (result.data) {
  //     res.status(HTTP_STATUSES[result.status]).send(result.data);
  //     return;
  //   }
  //   res.status(HTTP_STATUSES[result.status]).send({ errorMessage: result.errorMessage, data: result.data });
  //   return;
  // }

  @Get(':postId/comments')
  async getAllCommentsForPost(@Param('postId') postId: string, @Query() query: QueryParamsDto, @Req() req: Request, @Res() res: Response) {

    const token = req.cookies?.refreshToken || '';

    const currentUser = await serviceInfoLike.getIdUserByToken(token);

    const result = await this.commentsService.findAllComments(postId, query, currentUser);

    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data);
      return;
    }

    res.status(HTTP_STATUSES[result.status]).send({ errorMessage: result.errorMessage, data: result.data });
    return;
  }
}

