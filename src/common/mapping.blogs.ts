import { BlogDocument } from '../features/blogs/domain/blog.entity';
import { IBlogViewModel } from '../features/blogs/api/models/all.types';

export const mappingBlogs = {
  formatingDataForOutputBlog(input: BlogDocument): IBlogViewModel {
    return {
      id: String(input._id),
      name: input.name,
      description: input.description,
      websiteUrl: input.websiteUrl,
      createdAt: input.createdAt,
      isMembership: input.isMembership,
    };
  }
}