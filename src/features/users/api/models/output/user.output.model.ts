import { IsString } from 'class-validator';
// import { UserDocument } from '../../../domain/user.entity';

export class UserOutputModel {
  @IsString()
  id: string;

  @IsString()
  login: string;

  @IsString()
  email: string;

  @IsString()
  createdAt: string;
}
//
//
// export const UserOutputModelMapper = (user: UserDocument): UserOutputModel => {
//
//   const outputModel = new UserOutputModel();
//
//   outputModel.id = String(user._id);
//   outputModel.createdAt = user.createdAt;
//   outputModel.email = user.email;
//   outputModel.login = user.login;
//
//   return outputModel;
// }
