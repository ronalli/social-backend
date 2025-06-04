import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../domain/blog.entity';
import { BlogUpdateModel } from '../api/models/input/update-blog.input';

@Injectable()
export class BlogsTypeOrmRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}

  public async create(blog: Blog) {
    const blogCreated = this.blogRepository.create(blog);

    const result = await this.blogRepository.save(blogCreated);

    return result.id;
  }

  async updateBlog(blog: BlogUpdateModel) {
    const blogUpdate = await this.blogRepository.update(blog.blogId, {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
    });

    return blogUpdate.affected === 1;
  }

  async delete(blogId: string): Promise<boolean> {
    const foundBlog = await this.findBlogById(blogId);
    if (!foundBlog)
      throw new NotFoundException([
        { message: 'Not found blog', field: 'blogId' },
      ]);

    const result = await this.blogRepository.delete(blogId);

    return result.affected === 1;
  }

  async findBlogById(id: string) {
    return await this.dataSource
      .getRepository(Blog)
      .createQueryBuilder('blogs')
      .where('blogs.id = :id', { id })
      .getRawOne();
  }
}
