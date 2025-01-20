
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BlogEntity } from '../domain/blog.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {
  }

  async create(blog: BlogEntity) {

    const {id, name, description, websiteUrl, createdAt, isMembership} = blog;

    let query = `INSERT INTO public."blogs" (id, "createdAt", description, name, "websiteUrl", "isMembership") VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`

    const result = await this.dataSource.query(query, [id, name, description, websiteUrl, createdAt, isMembership]);

    return result[0].id


  }


  // async delete(blogId: string) {
  //
  //   const foundBlog = await this.BlogModel.findOne({ _id: new ObjectId(blogId) });
  //
  //   if (!foundBlog) throw new NotFoundException([{ message: 'Not found blog', field: 'blogId' }]);
  //
  //   try {
  //     await this.BlogModel.deleteOne({ _id: new ObjectId(blogId) });
  //     return true;
  //   } catch (e) {
  //     throw new InternalServerErrorException(e);
  //   }
  // }
}