import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { randomUUID } from 'node:crypto';
import {BlogEntity } from '../../domain/blog.entity';

export class CreateBlogCommand {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {
  }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {
  }

  async execute(command: CreateBlogCommand): Promise<string> {

    const {name, description, websiteUrl} = command;

    const blog: BlogEntity = {
      id: randomUUID(),
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return await this.blogsRepository.create(blog)

  }

}