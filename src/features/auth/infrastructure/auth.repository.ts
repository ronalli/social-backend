// import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
// import { UsersRepository } from '../../users/infrastructure/users.repository';
// import { InjectModel } from '@nestjs/mongoose';
// import { User, UserModelType } from '../../users/domain/user.entity';
// import { ResultCode } from '../../../settings/http.status';
// import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
//
// @Injectable()
// export class AuthRepository {
//   constructor(@InjectModel(User.name) private UserModel: UserModelType, private readonly usersRepository: UsersRepository) {
//   }
//
//   async findByLoginOrEmail(loginOrEmail: string) {
//     try {
//       const filter = {
//         $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
//       }
//
//       const findUser = await this.UserModel.findOne(filter)
//
//       if (findUser) return { status: ResultCode.Success, data: findUser };
//       return { errorMessage: 'Not found login/email', status: ResultCode.Unauthorized, data: null }
//
//     } catch (e) {
//       return { errorMessage: 'Error DB', status: ResultCode.BadRequest, data: null };
//     }
//   }
//
//   async createUser(data: UserCreateModel) {
//     try {
//       const user = new this.UserModel(data);
//       const response = await user.save();
//
//       return await this.usersRepository.findUserById(String(response._id))
//
//     } catch (e) {
//       return { errorMessage: 'Error DB', status: ResultCode.InternalServerError }
//     }
//   }
//
//   async findByEmail(email: string) {
//
//     try {
//
//
//     return await this.UserModel.findOne({ email: email })
//
//
//     // throw new BadRequestException([{ message: 'Error findByEmail', filed: 'email' }])
//   } catch (e) {
//
//       throw new InternalServerErrorException([{message: 'Error BD', field: 'BD'}])
//
//     }
//   }
// }