import { ApiBasicAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogInputModel } from './models/input/create-blog.input.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../../posts/application/posts.service';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { PostInputModel } from '../../posts/api/models/input/create-post.input.query.model';
import { BasicAuthGuard } from '../../../../common/guards/auth.basic.guard';
import { ValidateObjectIdPipe } from '../../../../common/pipes/validateObjectIdPipe';
import { QueryParamsDto } from '../../../../common/models/query-params.dto';
import { serviceInfoLike } from '../../../../common/services/initialization.status.like';
import { CreatePostCommand } from '../../posts/application/usecases/create-post.usecase';
import { PostUpdateSpecialModel } from '../../posts/api/models/input/update-post.special.blog.model';
import { HTTP_STATUSES } from '../../../../settings/http.status';
import { BlogUpdateModel } from './models/input/update-blog.input';
import { BlogOutputModel, BlogViewModel } from './models/output/blog.output.model';

@ApiTags('Blogs')
@Controller('')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly postsService: PostsService,
  ) {}

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Get('sa/blogs')
  @ApiResponse({status: 200, description: 'Success', type: BlogViewModel})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async getBlogs(@Query() query: QueryParamsDto) {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Post('sa/blogs')
  @ApiResponse({status: 201, description: 'Returns the newly created blog', type: BlogOutputModel})
  @ApiResponse({status: 400, description: 'If the inputModel has incorrect values'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async createBlog(@Body() createModel: BlogInputModel) {
    const { name, websiteUrl, description } = createModel;
    const createdBlogId = await this.commandBus.execute(
      new CreateBlogCommand(name, description, websiteUrl),
    );

    return await this.blogsQueryRepository.findBlogById(createdBlogId);
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Put('sa/blogs/:blogId')
  @HttpCode(HTTP_STATUSES.NotContent)
  async update(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Body() updateBlog: BlogInputModel,
  ): Promise<boolean> {
    const { name, description, websiteUrl } = updateBlog;

    const result = await this.commandBus.execute(
      new UpdateBlogCommand(name, description, websiteUrl, blogId),
    );

    if (!result) this.throwBlogNotFoundException();

    return;
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Delete('sa/blogs/:blogId')
  @HttpCode(HTTP_STATUSES.NotContent)
  async delete(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
  ): Promise<boolean> {
    return await this.blogsService.deleteBlog(blogId);
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Post('sa/blogs/:blogId/posts')
  @HttpCode(HTTP_STATUSES.Created)
  async createPostForSpecialBlog(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Body() post: PostInputModel,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.split(' ')[1] || 'unknown';
    const currentUser = await serviceInfoLike.getIdUserByToken(token);
    const { title, shortDescription, content } = post;

    const result = await this.blogsQueryRepository.blogIsExist(blogId);

    if (!result) this.throwBlogNotFoundException();

    const idCreatedPost = await this.commandBus.execute(
      new CreatePostCommand(
        title,
        shortDescription,
        content,
        blogId,
        currentUser,
      ),
    );

    return await this.postsService.getPost(idCreatedPost, currentUser);
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Get('sa/blogs/:blogId/posts')
  @HttpCode(HTTP_STATUSES.Success)
  async getAllPostsForBlog(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Query() query: QueryParamsDto,
    @Headers('authorization') authHeader: string,
  ) {
    const header = authHeader?.split(' ')[1];
    const currentUser = await serviceInfoLike.getIdUserByToken(header);

    const blogFound = await this.blogsQueryRepository.blogIsExist(blogId);

    if (!blogFound) this.throwBlogNotFoundException();

    return await this.blogsQueryRepository.getAndSortPostsSpecialBlog(
      blogId,
      query,
      currentUser,
    );
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Put('sa/blogs/:blogId/posts/:postId')
  @HttpCode(HTTP_STATUSES.NotContent)
  async updatePostForSpecialBlog(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Param('postId', ValidateObjectIdPipe) postId: string,
    @Body() post: PostInputModel,
  ) {
    const response = await this.blogsService.updatePostBySpecialBlog(
      post,
      blogId,
      postId,
    );

    if (!response) this.throwPostNotFoundException();

    return;
  }

  @ApiBasicAuth()
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
    @Headers('authorization') authHeader: string,
  ) {
    const header = authHeader?.split(' ')[1];
    const currentUser = await serviceInfoLike.getIdUserByToken(header);

    const blogFound = await this.blogsQueryRepository.blogIsExist(blogId);

    if (!blogFound) this.throwBlogNotFoundException();

    return await this.blogsQueryRepository.getAndSortPostsSpecialBlog(
      blogId,
      query,
      currentUser,
    );
  }

  @Get('blogs/:blogId')
  async getBlog(@Param('blogId', ValidateObjectIdPipe) blogId: string) {
    const result = await this.blogsQueryRepository.findBlogById(blogId);

    if (!result) this.throwBlogNotFoundException();

    return result;
  }

  private throwBlogNotFoundException(): never {
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
