import { add } from 'date-fns';
import { randomUUID } from 'node:crypto';
import { ResultCode } from '../../../settings/http.status';
import { AuthRepository } from '../infrastructure/auth.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { AuthQueryRepository } from '../infrastructure/auth-query.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../../users/domain/user.entity';
import { bcryptService } from '../../../common/services/password-hash.service';
import { jwtService } from '../../../common/services/jwt.service';
import { LoginInputModel } from '../api/models/input/login.input.model';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
import { createRecoveryCode } from '../../../common/utils/createRecoveryCode';
import { RecoveryCode, RecoveryCodeType } from '../domain/recoveryCode.entity';
import { NodemailerService } from '../../../common/services/nodemailer.service';
import { emailExamples } from '../../../common/utils/emailExamples';
import { Types } from 'mongoose';

// private readonly securityServices: SecurityServices,

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository, private readonly authQueryRepository: AuthQueryRepository, private readonly usersRepository: UsersRepository, private readonly usersQueryRepository: UsersQueryRepository, @InjectModel(User.name) private UserModel: UserModelType, @InjectModel(RecoveryCode.name) private RecoveryCodeModel: RecoveryCodeType, private readonly nodemailerService: NodemailerService) {
  }

  // async login(data: LoginInputModel, dataSession: IHeadersSession)

  async login(data: LoginInputModel) {
    const { loginOrEmail }: LoginInputModel = data;
    const result = await this.authRepository.findByLoginOrEmail(loginOrEmail);

    if (result.data) {

      const success = await bcryptService.checkPassword(data.password, result.data.hash);

      if (success) {

        const devicedId = randomUUID();

        const accessToken = await jwtService.createdJWT({
          deviceId: devicedId,
          userId: String(result.data._id),
        }, '1h');

        const refreshToken = await jwtService.createdJWT({
          deviceId: devicedId,
          userId: String(result.data._id),
        }, '2h');

        // await this.securityServices.createAuthSessions(refreshToken, dataSession);

        return { status: ResultCode.Success, data: { accessToken, refreshToken } };
      } else {
        return {
          status: ResultCode.Unauthorized,
          errorMessage: 'Incorrect data entered',
          data: null,
        };
      }
    }
    return { status: result.status, errorMessage: result.errorMessage, data: null };
  }

  async registration(data: UserCreateModel) {
    const { login, email, password } = data;
    const result = await this.usersQueryRepository.doesExistByLoginOrEmail(login, email);

    if (!result) {
      throw new BadRequestException([{message: 'User founded', field: 'login/email'}, ]);
    }

    const hash = await bcryptService.generateHash(password);

    const user = new this.UserModel({
        _id: new Types.ObjectId(),
        login,
        email,
        hash,
        createdAt: new Date().toISOString(),
        emailConfirmation: {
          confirmationCode: randomUUID(),
          expirationDate: add(new Date(), { hours: 0, minutes: 1 }),
          isConfirmed: false,
        },
      },
    );

    await user.save();

    if (user) {
      this.nodemailerService.sendEmail(email, user.emailConfirmation?.confirmationCode!, emailExamples.registrationEmail)
        .catch(e => {
          console.log(e);
        });
    }

    return true;

  }

  async confirmEmail(code: string) {
    const result= await this.usersQueryRepository.findUserByCodeConfirmation(code);

    if(!result) {
      throw new BadRequestException([{message: 'The code is incorrect', field: 'code'}]);
    }


    if (result.data?.emailConfirmation?.isConfirmed) {
      return true;
      // return {
      //   status: ResultCode.Success,
      //   errorMessage: {
      //     message: 'Email already confirmed',
      //     field: 'email',
      //   },
      // };
    }

    if (result.data?.emailConfirmation?.expirationDate && result.data.emailConfirmation.expirationDate < new Date()) {

      throw new  BadRequestException([{message: 'The code is not valid', field: 'email'}, ])
      // return {
      //   status: ResultCode.BadRequest,
      //   errorMessage: {
      //     message: 'The code is not valid',
      //     field: 'email',
      //   },
      // };
    }
    if (result) {
      try {

        const foundUser = await this.UserModel.findOne({ _id: result.data._id });

        if (foundUser && foundUser.emailConfirmation) {
          foundUser.emailConfirmation.isConfirmed = true;
          foundUser.emailConfirmation.expirationDate = null;
          foundUser.emailConfirmation.confirmationCode = null;

        }

        await foundUser.save();

        return true;

      } catch (e) {

        throw new InternalServerErrorException(e);
        // return {
        //   status: ResultCode.InternalServerError,
        //   errorMessage: {
        //     field: 'DB',
        //     message: 'Error DB',
        //   },
        // };
      }
    }

    // return {
    //   status: result.status,
    //   errorMessage: {
    //     message: result.message,
    //     field: result.field,
    //   },
    // };
  }

  async resendCode(email: string) {
    const result = await this.checkUserCredential(email);

    if (result.data?.emailConfirmation?.isConfirmed) {
      return {
        status: ResultCode.BadRequest,
        errorMessage: {
          message: 'Email already confirmed',
          field: 'email',
        },
      };
    }

    if (result.data && !result.data.emailConfirmation?.isConfirmed) {
      const code = randomUUID();
      const expirationDate = add(new Date().toISOString(), { hours: 0, minutes: 1 });

      const user = await this.UserModel.findOne({ _id: result.data._id });

      if (user && user.emailConfirmation) {
        user.emailConfirmation.expirationDate = expirationDate;
        user.emailConfirmation.confirmationCode = code;
      }

      await user.save()

      this.nodemailerService.sendEmail(email, code, emailExamples.registrationEmail).catch(e => console.log(e));

      return {
        status: ResultCode.NotContent,
      };
    }

    // return {
    //   status: result.status,
    //   errorMessage: {
    //     message: result.errorMessage || 'Something went wrong',
    //     field: 'email',
    //   },
    // };

    throw new BadRequestException();
  }

  // async logout(token: string) {
  //   const foundedToken = await RefreshTokenModel.findOne({ refreshToken: token });
  //
  //   if (foundedToken) {
  //     return {
  //       status: ResultCode.Unauthorized,
  //       data: null,
  //       errorMessage: {
  //         message: 'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  //         filed: 'token',
  //       },
  //     };
  //   }
  //   const success = await jwtService.getUserIdByToken(token);
  //
  //   const invalidRefreshToken = new RefreshTokenModel({ refreshToken: token });
  //
  //   await invalidRefreshToken.save();
  //
  //   if (success) {
  //
  //     const data = await decodeToken(token);
  //
  //     if (data && await this.securityServices.deleteCurrentSession(data)) {
  //       return {
  //         status: ResultCode.NotContent,
  //         data: null,
  //       };
  //     }
  //   }
  //
  //   return {
  //     status: ResultCode.Unauthorized,
  //     data: null,
  //     errorMessage: {
  //       message: 'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  //       filed: 'token',
  //     },
  //   };
  // }

  // async refreshToken(token: string) {
  //   const validId = await jwtService.getUserIdByToken(token);
  //
  //   const findedToken = await RefreshTokenModel.findOne({ refreshToken: token });
  //
  //   if (findedToken) {
  //     return {
  //       status: ResultCode.Unauthorized,
  //       data: null,
  //       errorMessage: {
  //         message: 'If the JWT refreshToken - invalid',
  //         field: 'refreshToken',
  //       },
  //     };
  //   }
  //
  //   if (validId && !findedToken) {
  //
  //     const newRefreshToken = new RefreshTokenModel({ refreshToken: token });
  //
  //     await newRefreshToken.save();
  //
  //     const user = await this.UserModel.findOne({ _id: new ObjectId(validId) });
  //
  //     if (user) {
  //
  //       const decode = await decodeToken(token);
  //
  //       if (decode) {
  //         const deviceId = decode.deviceId;
  //
  //         const accessToken = await jwtService.createdJWT({ deviceId, userId: String(user._id) }, '10s');
  //         const refreshToken = await jwtService.createdJWT({ deviceId, userId: String(user._id) }, '20s');
  //
  //         const response = await this.securityServices.updateVersionSession(refreshToken);
  //
  //         if (response.status === ResultCode.Success) {
  //           return { status: ResultCode.Success, data: { accessToken, refreshToken } };
  //         }
  //       }
  //     }
  //   }
  //   return {
  //     status: ResultCode.Unauthorized,
  //     data: null,
  //     errorMessage: {
  //       message: 'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  //       field: 'refreshToken',
  //     },
  //   };
  // }

  async recoveryCode(email: string) {
    const response = await this.authRepository.findByEmail(email);

    if (!response.data) {
      return {
        status: ResultCode.NotContent,
        data: null,
      };
    }

    const dataCode = await createRecoveryCode(email, '5m');

    const newCode = new this.RecoveryCodeModel({ code: dataCode });

    await newCode.save();

    this.nodemailerService.sendEmail(email, dataCode, emailExamples.recoveryPasswordByAccount).catch((e: Error) => console.log(e));

    return {
      status: ResultCode.NotContent,
      data: null,
    };
  }

  async updatePassword(password: string, email: string) {

    const user = await this.UserModel.findOne({ email: email });

    if (user) {
      user.hash = await bcryptService.generateHash(password);
      await user.save();
    }

    return {
      status: ResultCode.NotContent,
      data: null,
    };
  }

  async checkValidRecoveryCode(code: string) {
    const response = await jwtService.getEmailByToken(code);

    if (response) return { status: ResultCode.Success, data: response };

    return {
      status: ResultCode.BadRequest, data: null, errorsMessages: [{
        message: 'Incorrect', field: 'recoveryCode',
      }],
    };
  }

  async checkUserCredential(login: string) {
    return await this.authRepository.findByEmail(login);
  }

  async checkAccessToken(authHeader: string) {
    const token = authHeader.split(' ');

    if (token[0] !== 'Bearer') {
      return {
        status: ResultCode.Unauthorized,
        data: null,
        errorMessage: {
          message: 'Wrong authorization',
          field: 'header',
        },
      };
    }

    const id = await jwtService.getUserIdByToken(token[1]);

    if (!id) {
      return {
        data: null,
        status: ResultCode.Unauthorized,
        errorMessage: {
          message: 'Wrong access token',
          field: 'token',
        },
      };
    }

    const payload = await this.usersRepository.doesExistById(id);

    if (!payload) {
      return {
        status: ResultCode.Unauthorized,
        data: null,
        errorMessage: {
          message: 'User not found',
          field: 'token',
        },
      };
    }

    return {
      status: ResultCode.Success,
      data: payload.id,
      login: payload.login,
    };
  }
}