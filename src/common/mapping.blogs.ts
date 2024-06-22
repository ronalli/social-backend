import { BlogDocument } from '../features/blogs/domain/blog.entity';
import { BlogOutputModel } from '../features/blogs/api/models/output/blog.output.model';

export const mappingBlogs = {
  formatingDataForOutputBlog(input: BlogDocument): BlogOutputModel {
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