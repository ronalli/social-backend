import {Request, Response} from "express";
import { HTTP_STATUSES } from '../../../settings/http.status';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { BlogCreateModel } from './models/input/create-blog.input.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../../posts/application/posts.service';
import { PostCreateModel } from '../../posts/api/models/input/create-post.input.model';
import { QueryParamsDto } from '../../../common/models/query-params.dto';
import { serviceInfoLike } from '../../../common/services/initialization.status.like';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(@Inject(BlogsService) private readonly blogsService: BlogsService, @Inject(BlogsQueryRepository) private readonly  blogsQueryRepository: BlogsQueryRepository, @Inject(PostsService) private readonly  postsService: PostsService) {
  }

  @Post()
  async createBlog(@Body() createModel: BlogCreateModel, @Req() req: Request, @Res() res: Response) {

    const result = await this.blogsService.createBlog(createModel);
    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data)
      return;
    }
    res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
    return
  }

  @Get(':blogId')
  async getBlog(@Param('blogId') blogId: string, @Req() req: Request, @Res() res: Response) {
    const result = await this.blogsQueryRepository.findBlogById(blogId);
    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data)
      return
    }
    res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
    return
  }

  @Get()
  async getBlogs(@Query() query: QueryParamsDto, @Req() req: Request, @Res() res: Response) {
    const result = await this.blogsQueryRepository.getAllBlogs(query);

    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data)
      return
    }

    res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
    return
  }

  @Put(':blogId')
  async update(@Param('blogId') blogId: string, @Body() data: BlogCreateModel, @Req() req: Request, @Res() res: Response) {

    const result = await this.blogsService.updateBlog(blogId, data)
    if (result.errorMessage) {
      res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
      return
    }
    res.status(HTTP_STATUSES[result.status]).send(result.data)
    return
  }

  @Delete(':blogId')
  async delete(@Param('blogId') blogId: string, @Req() req: Request, @Res() res: Response) {

    const result = await this.blogsService.deleteBlog(blogId);
    if (result.errorMessage) {
      res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
      return
    }
    res.status(HTTP_STATUSES[result.status]).send(result.data)
    return
  }

  @Get(':blogId/posts')
  async getAllPostsForBlog(@Param('blogId') blogId: string, @Query() query: QueryParamsDto,  @Req() req: Request, @Res() res: Response) {
    const header = req.headers.authorization?.split(' ')[1];
    const currentUser = await serviceInfoLike.getIdUserByToken(header)

    const result = await this.blogsQueryRepository.findBlogById(blogId);

    if (result.data) {
      const foundPosts= await this.blogsQueryRepository.getAndSortPostsSpecialBlog(blogId, query, currentUser)
      res.status(HTTP_STATUSES[foundPosts.status]).send(foundPosts.data)
      return
    }

    res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
    return
  }

  @Post(':blogId/posts')
  async createPostForSpecialBlog(@Param('blogId') blogId: string, @Body() data: PostCreateModel,  @Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization?.split(' ')[1] || "unknown";
    const currentUser = await serviceInfoLike.getIdUserByToken(token)

    const result = await this.blogsQueryRepository.findBlogById(blogId);

    if (!result.data) {
      res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
      return
    }

    const post = {
      blogId,
      ...data
    }

    const createdPost = await this.postsService.createPost(post, currentUser);

    if (createdPost.data) {
      res.status(HTTP_STATUSES[createdPost.status]).send(createdPost.data)
      return
    }
    res.status(HTTP_STATUSES[createdPost.status]).send({error: createdPost.errorMessage, data: createdPost.data})
    return
  }
}

