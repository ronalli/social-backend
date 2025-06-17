import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DeleteService {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async deleteAll() {
    const query = `TRUNCATE TABLE public."users", public.blogs,  public.posts, public."postsLikeStatus", public."confirmationEmailUsers", public."recoveryCodes", public."oldRefreshTokens", public."deviceSessions" RESTART IDENTITY CASCADE;`;

    const response = await this.dataSource.query(query);
  }
}

// const query = `TRUNCATE TABLE public."users", public.blogs,  public.posts, public."commentsPosts", public."commentsLikeStatus", public."postsLikeStatus", public."oldRefreshTokens", public."recoveryCodes", public."confirmationEmailUsers", public."deviceSessions" RESTART IDENTITY CASCADE;`;