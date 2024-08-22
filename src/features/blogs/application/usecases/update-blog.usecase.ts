import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../domain/blog.entity';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

export class UpdateBlogCommand {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public blogId: string,
  ) {
  }
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {
  }
  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const {name, description, websiteUrl, blogId} = command;
    try {
      const findBlog = await this.BlogModel.findOne({_id: new ObjectId(blogId)});

      if(!findBlog) return false;

      if (findBlog) {

        findBlog.name = name;
        findBlog.description = description;
        findBlog.websiteUrl = websiteUrl;

        await findBlog.save();

        return true;
      }
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
}