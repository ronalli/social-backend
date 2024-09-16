import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/post.entity';
import { Types } from 'mongoose';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class CreatePostCommand {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public currentUser: string,
  ) {
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    @InjectModel(Post.name) private PostModel: PostModelType,
    private readonly postsRepository: PostsRepository) {
  }

  async execute(command: CreatePostCommand): Promise<any> {

    const {title, shortDescription, content, blogId, currentUser} = command;

    const findBlog = await this.blogsQueryRepository.findBlogById(blogId);

    if (!findBlog) throw new BadRequestException([{message: 'The blog does not exist', field: 'blogId'}]);

    const post = new this.PostModel({
      _id: new Types.ObjectId(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: findBlog.name,
      createdAt: new Date().toISOString(),
      dislikesCount: 0,
      likesCount: 0
    });

    return await this.postsRepository.create(post, currentUser)

  }
}