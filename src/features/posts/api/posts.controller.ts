import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { HTTP_STATUSES } from '../../../settings/http.status';
import { PostCreateModel } from './models/input/create-post.input.model';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { serviceInfo } from '../../../common/service.info';
import { CommentsService } from '../../comments/application/comments.service';
import { QueryParamsDto } from '../../../common/query-params.dto';


@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService, private readonly commentsService: CommentsService, private readonly postsQueryRepository: PostsQueryRepository) {
  }

  @Post()
  async createPost(@Body() createModel: PostCreateModel, @Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization?.split(' ')[1] || 'unknown';
    const currentUser = await serviceInfo.getIdUserByToken(token);

    const result = await this.postsService.createPost(createModel, currentUser);

    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data);
      return;
    }
    res.status(HTTP_STATUSES[result.status]).send({ errorMessage: result.errorMessage });
    return;
  }

  @Get(':id')
  async getPost(@Param() id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization?.split(' ')[1];

    const currentUser = await serviceInfo.getIdUserByToken(token);

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

    const currentUser = await serviceInfo.getIdUserByToken(token);

    const result = await this.postsQueryRepository.getPosts(query, currentUser);

    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data);
      return;
    }
    res.status(HTTP_STATUSES[result.status]).send({ errorMessage: result.errorMessage });
  }

  @Put(':id')
  async updatePost(@Param() id: string, @Body() data: PostCreateModel, @Req() req: Request, @Res() res: Response) {
    const result = await this.postsService.updatePost(id, data);
    if (result.errorMessage) {
      res.status(HTTP_STATUSES[result.status]).send({ errorMessage: result.errorMessage });
      return;
    }
    res.status(HTTP_STATUSES[result.status]).send({});
    return;
  }

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

    const currentUser = await serviceInfo.getIdUserByToken(token);

    const result = await this.commentsService.findAllComments(postId, query, currentUser);

    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data);
      return;
    }

    res.status(HTTP_STATUSES[result.status]).send({ errorMessage: result.errorMessage, data: result.data });
    return;
  }
}

