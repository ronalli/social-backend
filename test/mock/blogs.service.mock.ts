import { BlogsService } from '../../src/features/bloggers-platform/blogs/application/blogs.service';
import { BlogsRepository } from '../../src/features/bloggers-platform/blogs/infrastructure/blogs.repository';

export const BlogsServiceMockObject = {
  create() {
    return Promise.resolve('123');
  },
};

export class BlogsServiceMock extends BlogsService {
  constructor(blogsRepository: BlogsRepository) {
    super(blogsRepository);
  }
}
