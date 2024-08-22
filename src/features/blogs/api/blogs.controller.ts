import {Request, Response} from "express";
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get, HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BlogCreateModel } from './models/input/create-blog.input.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../../posts/application/posts.service';
import { QueryParamsDto } from '../../../common/models/query-params.dto';
import { serviceInfoLike } from '../../../common/services/initialization.status.like';
import { BasicAuthGuard } from '../../../common/guards/auth.basic.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { ValidateObjectIdPipe } from '../../../common/pipes/validateObjectIdPipe';
import { CreatePostCommand } from '../../posts/application/usecases/create-post.usecase';
import { PostCreateModelQuery } from '../../posts/api/models/input/create-post.input.query.model';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(@Inject(BlogsService) private readonly blogsService: BlogsService, @Inject(BlogsQueryRepository) private readonly  blogsQueryRepository: BlogsQueryRepository, @Inject(PostsService) private readonly  postsService: PostsService, private readonly commandBus: CommandBus) {
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() createModel: BlogCreateModel) {
    const {name, websiteUrl, description} = createModel;
    const createdBlogId = await this.commandBus.execute(new CreateBlogCommand(name, description, websiteUrl))

    return await this.blogsQueryRepository.findBlogById(createdBlogId);
  }

  @Get(':blogId')
  async getBlog(@Param('blogId', ValidateObjectIdPipe) blogId: string) {

    const result = await this.blogsQueryRepository.findBlogById(blogId);

    if(!result) {
      throw new NotFoundException([{message: `Blog with id ${blogId} not found`, field: 'blogId'}])
    }

    return result
  }

  @Get()
  async getBlogs(@Query() query: QueryParamsDto) {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':blogId')
  @HttpCode(204)
  async update(@Param('blogId', ValidateObjectIdPipe) blogId: string, @Body() updateBlog: BlogCreateModel): Promise<boolean> {

    const {name, description, websiteUrl, } = updateBlog

    const result = await this.commandBus.execute(new UpdateBlogCommand(name, description, websiteUrl, blogId));

    if(!result) throw new NotFoundException([{message: 'Not found blog', field: 'blogId'}])

    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':blogId')
  @HttpCode(204)
  async delete(@Param('blogId', ValidateObjectIdPipe) blogId: string): Promise<boolean> {
    return await this.blogsService.deleteBlog(blogId);
  }

  @Get(':blogId/posts')
  async getAllPostsForBlog(@Param('blogId', ValidateObjectIdPipe) blogId: string, @Query() query: QueryParamsDto,  @Req() req: Request, @Res() res: Response) {


    const header = req.headers.authorization?.split(' ')[1];
    const currentUser = await serviceInfoLike.getIdUserByToken(header)

    const result = await this.blogsQueryRepository.findBlogById(blogId);

    if (result) {
      const foundPosts= await this.blogsQueryRepository.getAndSortPostsSpecialBlog(blogId, query, currentUser)
      return res.status(200).send(foundPosts.data)
    }

    throw new NotFoundException([{message: 'If specified blog is not exists', field: 'blogId'}])
  }

  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  async createPostForSpecialBlog(@Param('blogId', ValidateObjectIdPipe) blogId: string, @Body() post: PostCreateModelQuery,  @Req() req: Request, @Res() res: Response) {

    const token = req.headers.authorization?.split(' ')[1] || "unknown";

    const currentUser = await serviceInfoLike.getIdUserByToken(token)

    const {title, shortDescription, content} = post;

    const result = await this.blogsQueryRepository.findBlogById(blogId);

    if(!result) throw new NotFoundException([{message: 'Not found blog', field: 'blogId'}])

    const createdPost = await this.commandBus.execute(new CreatePostCommand(title, shortDescription, content, blogId, currentUser));

    return res.status(201).send(createdPost);
  }
}

