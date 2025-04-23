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
import { BlogCreateModel } from './models/input/create-blog.input.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../../posts/application/posts.service';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { PostCreateModelQuery } from '../../posts/api/models/input/create-post.input.query.model';
import { BasicAuthGuard } from '../../../../common/guards/auth.basic.guard';
import { ValidateObjectIdPipe } from '../../../../common/pipes/validateObjectIdPipe';
import { QueryParamsDto } from '../../../../common/models/query-params.dto';
import { serviceInfoLike } from '../../../../common/services/initialization.status.like';
import { CreatePostCommand } from '../../posts/application/usecases/create-post.usecase';
import { PostUpdateSpecialModel } from '../../posts/api/models/input/update-post.special.blog.model';
import { HTTP_STATUSES } from '../../../../settings/http.status';

@ApiTags('Blogs')
@Controller('')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly postsService: PostsService,
  ) {
  }

  @UseGuards(BasicAuthGuard)
  @Get('sa/blogs')
  async getBlogs(@Query() query: QueryParamsDto) {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @UseGuards(BasicAuthGuard)
  @Post('sa/blogs')
  async createBlog(@Body() createModel: BlogCreateModel) {
    const { name, websiteUrl, description } = createModel;
    const createdBlogId = await this.commandBus.execute(
      new CreateBlogCommand(name, description, websiteUrl),
    );

    return await this.blogsQueryRepository.findBlogById(createdBlogId);
  }

  @UseGuards(BasicAuthGuard)
  @Put('sa/blogs/:blogId')
  @HttpCode(HTTP_STATUSES.NotContent)
  async update(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Body() updateBlog: BlogCreateModel,
  ): Promise<boolean> {
    const { name, description, websiteUrl } = updateBlog;

    const result = await this.commandBus.execute(
      new UpdateBlogCommand(name, description, websiteUrl, blogId),
    );

    if (!result) this.throwBlogNotFoundException(blogId);

    return;
  }

  @UseGuards(BasicAuthGuard)
  @Delete('sa/blogs/:blogId')
  @HttpCode(HTTP_STATUSES.NotContent)
  async delete(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
  ): Promise<boolean> {
    return await this.blogsService.deleteBlog(blogId);
  }

  @UseGuards(BasicAuthGuard)
  @Post('sa/blogs/:blogId/posts')
  async createPostForSpecialBlog(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Body() post: PostCreateModelQuery,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.headers.authorization?.split(' ')[1] || 'unknown';
    const currentUser = await serviceInfoLike.getIdUserByToken(token);
    const { title, shortDescription, content } = post;

    const result = await this.blogsQueryRepository.blogIsExist(blogId);

    if (!result) this.throwBlogNotFoundException(blogId);

    const idCreatedPost = await this.commandBus.execute(
      new CreatePostCommand(
        title,
        shortDescription,
        content,
        blogId,
        currentUser,
      ),
    );

    const newPost = await this.postsService.getPost(idCreatedPost, currentUser);

    return res.status(HTTP_STATUSES.Created).send(newPost);
  }

  @UseGuards(BasicAuthGuard)
  @Get('sa/blogs/:blogId/posts')
  async getAllPostsForBlog(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Query() query: QueryParamsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const header = req.headers.authorization?.split(' ')[1];
    const currentUser = await serviceInfoLike.getIdUserByToken(header);

    const blogFound = await this.blogsQueryRepository.blogIsExist(blogId);

    if (!blogFound) this.throwBlogNotFoundException(blogId);

    const foundPosts =
      await this.blogsQueryRepository.getAndSortPostsSpecialBlog(
        blogId,
        query,
        currentUser,
      );

    return res.status(HTTP_STATUSES.Success).send(foundPosts);
  }

  @UseGuards(BasicAuthGuard)
  @Put('sa/blogs/:blogId/posts/:postId')
  @HttpCode(HTTP_STATUSES.NotContent)
  async updatePostForSpecialBlog(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Param('postId', ValidateObjectIdPipe) postId: string,
    @Body() post: PostUpdateSpecialModel,
  ) {
    const response = await this.blogsService.updatePostBySpecialBlog(
      post,
      blogId,
      postId,
    );

    if (!response) this.throwPostNotFoundException();

    return;
  }

  @UseGuards(BasicAuthGuard)
  @Delete('sa/blogs/:blogId/posts/:postId')
  @HttpCode(HTTP_STATUSES.NotContent)
  async deletePostForSpecialBlog(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Param('postId', ValidateObjectIdPipe) postId: string,
  ) {
    const response = await this.blogsService.deletePostBySpecialBlog(
      blogId,
      postId,
    );

    if (!response) this.throwPostNotFoundException();

    return;
  }

  // public
  @Get('blogs')
  async getPublicAllBlogs(@Query() query: QueryParamsDto) {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get('blogs/:blogId/posts')
  async getPublicAllPostsForBlog(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Query() query: QueryParamsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const header = req.headers.authorization?.split(' ')[1];
    const currentUser = await serviceInfoLike.getIdUserByToken(header);

    const blogFound = await this.blogsQueryRepository.blogIsExist(blogId);

    if (blogFound) {
      const foundPosts =
        await this.blogsQueryRepository.getAndSortPostsSpecialBlog(
          blogId,
          query,
          currentUser,
        );

      return res.status(HTTP_STATUSES.Success).send(foundPosts);
    }

    this.throwBlogNotFoundException(blogId);
  }

  @Get('blogs/:blogId')
  async getBlog(@Param('blogId', ValidateObjectIdPipe) blogId: string) {
    const result = await this.blogsQueryRepository.findBlogById(blogId);

    if (!result) this.throwBlogNotFoundException(blogId);

    return result;
  }

  private throwBlogNotFoundException(blogId: string): never {
    throw new NotFoundException([
      { message: 'Not found blog', field: 'blogId' },
    ]);
  }

  private throwPostNotFoundException(): never {
    throw new NotFoundException([
      { message: 'Not found post', field: 'postId or blogId' },
    ]);
  }
}
