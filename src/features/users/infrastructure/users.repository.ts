import {ObjectId} from "mongodb";
import { Injectable, InternalServerErrorException} from '@nestjs/common';

import { UserOutputModel, } from '../api/models/output/user.output.model';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {
  }

  async createUser(login: string, email: string, hash: string, createdAt: string) {


    const values = [login, email, hash, createdAt]

    let query = `INSERT INTO public."users" (login, email, hash, "createdAt") VALUES($1, $2, $3, $4) RETURNING *`

    const result = await this.dataSource.query(query, values)

    return result[0]

  }

  async findAllUser () {
    return this.dataSource.query(`
      SELECT id, login, email, hash, "createdAt"
      FROM public."user";`)
  }

  async findUserById(id: number) {
    // try {
    //  return await this.UserModel.findOne({_id: new ObjectId(id)})
    // } catch (e) {
    //   throw new InternalServerErrorException(e)
    // }
  }

  async delete(id: number) {
    // try {
    //
    //   const deletingResult = await this.UserModel.deleteOne({_id: new ObjectId(id)});
    //
    //   return !!deletingResult.deletedCount
    // } catch (e) {
    //   throw new InternalServerErrorException(e)
    // }
  }

  // async doesExistById(id: string): Promise<UserOutputModel | null> {
  //   const findedUser = await this.UserModel.findOne({_id: new ObjectId(id)});
  //   if (findedUser) {
  //     return UserOutputModelMapper(findedUser);
  //   }
  //   return null;
  // }

  // async loginIsExist(login: string): Promise<boolean> {
  //   return !!(await this.UserModel.countDocuments({login}))
  // }
  //
  // async emailIsExist(email: string): Promise<boolean> {
  //   return !!(await this.UserModel.countDocuments({email}))
  // }


}