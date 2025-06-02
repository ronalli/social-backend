import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { randomUUID } from 'node:crypto';
import { Blog } from '../../domain/blog.entity';
import { BlogsTypeOrmRepository } from '../../infrastructure/blogs.typeorm.repository';

export class CreateBlogCommand {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository,
  private readonly blogsTypeOrmRepository: BlogsTypeOrmRepository
  ) {}

  async execute(command: CreateBlogCommand): Promise<string> {
    const { name, description, websiteUrl } = command;

    const blog: Blog = {
      id: randomUUID(),
      name,
      description,
      websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };

    return await this.blogsTypeOrmRepository.create(blog);
  }
}
