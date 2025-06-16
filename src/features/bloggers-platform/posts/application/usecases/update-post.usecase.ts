import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostCommand {
  constructor(
    public id: string,
    public content: string,
    public blogId: string,
    public shortDescription: string,
    public title: string,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute(command: UpdatePostCommand) {
    // const response = await this.postsRepository.updateCurrentPost(command);
    //
    // return response.length > 0;
  }
}
