import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


@Injectable()
export class DeleteService {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
  ) {
  }

  async deleteAll() {
    const query = `TRUNCATE TABLE public."users", public."oldRefreshTokens", public."recoveryCodes", public."confirmationEmailUsers", public."deviceSessions" RESTART IDENTITY CASCADE;`;

    const response = await this.dataSource.query(query);

    console.log('end', response);
  }
}