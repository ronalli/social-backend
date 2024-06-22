import {Request, Response} from "express";
import { HTTP_STATUSES } from '../../../settings/http.status';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { BlogCreateModel } from './models/input/create-blog.input.model';
import { SortDirection } from 'mongodb';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../../posts/application/posts.service';
import { serviceInfo } from '../../../common/service.info';

export interface IBlogQueryType {
  pageNumber?: number,
  pageSize?: number,
  sortBy?: string,
  sortDirection?: SortDirection,
  searchNameTerm?: string
}


@ApiTags('Blogs')
@Controller('/api/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService, private readonly  blogsQueryRepository: BlogsQueryRepository,private readonly  postsService: PostsService) {
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
  async getBlog(@Param() blogId: string, @Req() req: Request, @Res() res: Response) {
    const result = await this.blogsQueryRepository.findBlogById(blogId);
    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data)
      return
    }
    res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
    return
  }

  @Get()
  async getBlogs(@Query() query: IBlogQueryType,@Req() req: Request, @Res() res: Response) {
    const result = await this.blogsQueryRepository.getAllBlogs(query);

    if (result.data) {
      res.status(HTTP_STATUSES[result.status]).send(result.data)
      return
    }

    res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
    return
  }

  @Put(':blogId')
  async updateBlog(@Param() blogId: string, @Body() data: BlogCreateModel, @Req() req: Request, @Res() res: Response) {
    const result = await this.blogsService.updateBlog(blogId, data)
    if (result.errorMessage) {
      res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
      return
    }
    res.status(HTTP_STATUSES[result.status]).send(result.data)
    return
  }

  @Delete(':blogId')
  async deleteBlog(@Param() blogId: string, @Req() req: Request, @Res() res: Response) {
    const result = await this.blogsService.deleteBlog(blogId);
    if (result.errorMessage) {
      res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
      return
    }
    res.status(HTTP_STATUSES[result.status]).send(result.data)
    return
  }

  @Get(':id/posts')
  async getAllPostsForBlog(@Req() req: Request, @Res() res: Response) {
    const {blogId} = req.params;
    const queryParams: IBlogQueryType = req.query;

    const header = req.headers.authorization?.split(' ')[1];
    const currentUser = await serviceInfo.getIdUserByToken(header)

    const result = await this.blogsQueryRepository.findBlogById(blogId);

    if (result.data) {
      const foundPosts= await this.blogsQueryRepository.getAndSortPostsSpecialBlog(blogId, queryParams, currentUser)
      res.status(HTTP_STATUSES[foundPosts.status]).send(foundPosts.data)
      return
    }

    res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
    return
  }

  async createPostForSpecialBlog(@Req() req: Request, @Res() res: Response) {
    const inputDataPost = req.body;
    const {blogId} = req.params;

    const token = req.headers.authorization?.split(' ')[1] || "unknown";
    const currentUser = await serviceInfo.getIdUserByToken(token)

    const result = await this.blogsQueryRepository.findBlogById(blogId);

    if (!result.data) {
      res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
      return
    }

    const post = {
      blogId,
      ...inputDataPost
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

