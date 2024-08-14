import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../domain/blog.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

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
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType, private readonly blogsRepository: BlogsRepository) {
  }

  async execute(command: CreateBlogCommand): Promise<string> {

    const {name, description, websiteUrl} = command;

    const blog = new this.BlogModel({
      name,
      description,
      websiteUrl,
      _id: new Types.ObjectId(),
      createdAt: new Date().toISOString(),
      isMembership: false
    });

    return await this.blogsRepository.create(blog)

  }

}