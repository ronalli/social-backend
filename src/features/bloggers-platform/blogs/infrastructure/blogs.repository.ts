import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BlogEntity } from '../domain/blog.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogUpdateModel } from '../api/models/input/update-blog.input';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async create(blog: BlogEntity) {
    const { id, name, description, websiteUrl, createdAt, isMembership } = blog;

    let query = `INSERT INTO public."blogs" (id, "createdAt", description, name, "websiteUrl", "isMembership") VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`;

    const result = await this.dataSource.query(query, [
      id,
      createdAt,
      description,
      name,
      websiteUrl,
      isMembership,
    ]);

    return result[0].id;
  }

  async updateBlog(blog: BlogUpdateModel) {
    let query = `UPDATE public.blogs SET name = $1, description = $2, "websiteUrl" = $3 WHERE id = $4 RETURNING *;`;

    const values = [blog.name, blog.description, blog.websiteUrl, blog.blogId];

    const response = await this.dataSource.query(query, values);

    return response[0];
  }

  async delete(blogId: string) {

    const foundBlog = await this.findBlogById(blogId);

    if (!foundBlog)
      throw new NotFoundException([
        { message: 'Not found blog', field: 'blogId' },
      ]);

    let query = `DELETE FROM public.blogs WHERE id = $1 RETURNING *;`;

    const result = await this.dataSource.query(query, [blogId])

    return result[1] === 1;

  }


  async findBlogById(blogId: string) {
    const query = `SELECT * FROM public."blogs" WHERE id = $1;`;
    const result = await this.dataSource.query(query, [blogId]);
    return result[0];
  }

}
