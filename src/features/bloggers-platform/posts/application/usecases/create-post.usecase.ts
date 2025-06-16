import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
import { BadRequestException } from '@nestjs/common';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { randomUUID } from 'node:crypto';
import { PostsTypeOrmRepository } from '../../infrastructure/posts.typeorm.repository';
import { BlogsTypeOrmQueryRepository } from '../../../blogs/infrastructure/blogs.typeorm.query-repository';

export class CreatePostCommand {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public currentUser: string,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsRepository: PostsRepository,
    private readonly postsTypeOrmRepository: PostsTypeOrmRepository,
    private readonly blogsTypeOrmQueryRepository: BlogsTypeOrmQueryRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<string> {
    const { currentUser, ...post } = command;

    const findBlog = await this.blogsTypeOrmQueryRepository.blogIsExist(
      command.blogId,
    );

    if (!findBlog)
      throw new BadRequestException([
        { message: 'The blog does not exist', field: 'blogId' },
      ]);

    const newPost = {
      id: randomUUID(),
      ...post,
      createdAt: new Date().toISOString(),
    };

    return await this.postsTypeOrmRepository.create(newPost, currentUser);
  }
}
