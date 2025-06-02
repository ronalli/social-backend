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
import { HTTP_STATUSES } from '../../../../settings/http.status';
import { PrivateGetBlogsApiResponse } from '../../../../common/services/swagger/blogs/private-get-blogs.api-response';
import { BlogsQueryDto } from './models/input/blogs-query.dto';
import { PrivateCreateBlogApiResponse } from '../../../../common/services/swagger/blogs/private-create-blog.api-response';
import { PrivateUpdateBlogApiResponse } from '../../../../common/services/swagger/blogs/private-update-blog.api-response';
import { CreatePostForSpecialBlogApiResponse } from '../../../../common/services/swagger/blogs/create-post-for-special-blog.api-response';
import { GetPostsForBlogApiResponse } from '../../../../common/services/swagger/blogs/get-posts-for-blog.api-response';
import { PostQueryDto } from '../../posts/api/models/post-query.dto';
import { UpdatePostForSpecialBlogApiResponse } from '../../../../common/services/swagger/blogs/update-post-for-special-blog.api-response';
import {
  DeletePostForSpecialBlogApiResponse
} from '../../../../common/services/swagger/blogs/delete-post-for-special-blog.api-response';
import { GetBlogApiResponse } from '../../../../common/services/swagger/blogs/get-blog.api-response';
import { BlogsTypeOrmQueryRepository } from '../infrastructure/blogs.typeorm.query-repository';

@ApiTags('Blogs')
@Controller('')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsTypeORMQueryRepository: BlogsTypeOrmQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly postsService: PostsService,
  ) {}

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Get('sa/blogs')
  @PrivateGetBlogsApiResponse()
  async getBlogs(@Query() query: BlogsQueryDto) {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Post('sa/blogs')
  @PrivateCreateBlogApiResponse()
  async createBlog(@Body() createModel: BlogInputModel) {
    const { name, websiteUrl, description } = createModel;
    const createdBlogId = await this.commandBus.execute(
      new CreateBlogCommand(name, description, websiteUrl),
    );

    return await this.blogsQueryRepository.findBlogById(createdBlogId);
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Put('sa/blogs/:blogId')
  @PrivateUpdateBlogApiResponse()
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

  @HttpCode(HTTP_STATUSES.NotContent)
  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Delete('sa/blogs/:blogId')
  @PrivateUpdateBlogApiResponse()
  async delete(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
  ): Promise<boolean> {
    return await this.blogsService.deleteBlog(blogId);
  }

  @HttpCode(HTTP_STATUSES.Created)
  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Post('sa/blogs/:blogId/posts')
  @CreatePostForSpecialBlogApiResponse()
  async createPostForSpecialBlog(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Body() post: PostInputModel,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.split(' ')[1] || 'unknown'; //
    const currentUser = await serviceInfoLike.getIdUserByToken(token); //
    const { title, shortDescription, content } = post;

    const result = await this.blogsTypeORMQueryRepository.blogIsExist(blogId);

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

  @HttpCode(HTTP_STATUSES.Success)
  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Get('sa/blogs/:blogId/posts')
  @GetPostsForBlogApiResponse()
  async getAllPostsForBlog(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Query() query: PostQueryDto,
    @Headers('authorization') authHeader: string,
  ) {
    const header = authHeader?.split(' ')[1];
    const currentUser = await serviceInfoLike.getIdUserByToken(header);

    const blogFound = await this.blogsTypeORMQueryRepository.blogIsExist(blogId);

    if (!blogFound) this.throwBlogNotFoundException();

    return await this.blogsQueryRepository.getAndSortPostsSpecialBlog(
      blogId,
      query,
      currentUser,
    );
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Put('sa/blogs/:blogId/posts/:postId')
  @UpdatePostForSpecialBlogApiResponse()
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

  @HttpCode(HTTP_STATUSES.NotContent)
  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Delete('sa/blogs/:blogId/posts/:postId')
  @DeletePostForSpecialBlogApiResponse()
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
  @PrivateGetBlogsApiResponse()
  async getPublicAllBlogs(@Query() query: BlogsQueryDto) {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get('blogs/:blogId/posts')
  @GetPostsForBlogApiResponse()
  async getPublicAllPostsForBlog(
    @Param('blogId', ValidateObjectIdPipe) blogId: string,
    @Query() query: PostQueryDto,
    @Headers('authorization') authHeader: string,
  ) {
    const header = authHeader?.split(' ')[1];
    const currentUser = await serviceInfoLike.getIdUserByToken(header);

    const blogFound = await this.blogsTypeORMQueryRepository.blogIsExist(blogId);

    if (!blogFound) this.throwBlogNotFoundException();

    return await this.blogsQueryRepository.getAndSortPostsSpecialBlog(
      blogId,
      query,
      currentUser,
    );
  }

  @Get('blogs/:blogId')
  @GetBlogApiResponse()
  async getBlog(@Param('blogId', ValidateObjectIdPipe) blogId: string) {
    const result = await this.blogsTypeORMQueryRepository.findBlogById(blogId);

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
