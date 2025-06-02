import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsTypeOrmRepository } from '../../infrastructure/blogs.typeorm.repository';
import { async } from 'rxjs';

export class UpdateBlogCommand {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public blogId: string,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository,
  private readonly blogsTypeORMRepository: BlogsTypeOrmRepository) {}

  async execute(command: UpdateBlogCommand): Promise<boolean> {
    return await this.blogsTypeORMRepository.updateBlog(command);
  }
}
