import { add } from 'date-fns';
import { randomUUID } from 'node:crypto';
import { ResultCode } from '../../../settings/http.status';
import { AuthRepository } from '../infrastructure/auth.repository';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../users/domain/user.entity';
import { bcryptService } from '../../../common/services/password-hash.service';
import { jwtService } from '../../../common/services/jwt.service';
import { LoginInputModel } from '../api/models/input/login.input.model';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
import { createRecoveryCode } from '../../../common/utils/createRecoveryCode';
import { RecoveryCode, RecoveryCodeType } from '../domain/recoveryCode.entity';
import { NodemailerService } from '../../../common/services/nodemailer.service';
import { emailExamples } from '../../../common/utils/emailExamples';
import { Types } from 'mongoose';
import {
  OldRefreshToken,
  OldRefreshTokenModel,
} from '../domain/refreshToken.entity';
import { ObjectId } from 'mongodb';
import { decodeToken } from '../../../common/services/decode.token';
import { SecurityService } from '../../security/application/security.service';
import { HeaderSessionModel } from '../../../common/models/header.session.model';

// private readonly securityServices: SecurityServices,

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(RecoveryCode.name) private RecoveryCodeModel: RecoveryCodeType,
    private readonly nodemailerService: NodemailerService,
    @InjectModel(OldRefreshToken.name)
    private OldRefreshCodeModel: OldRefreshTokenModel,
    private readonly securityService: SecurityService,
  ) {}

  async login(data: LoginInputModel, dataSession: HeaderSessionModel) {
    const { loginOrEmail }: LoginInputModel = data;
    const result = await this.authRepository.findByLoginOrEmail(loginOrEmail);

    if (result.data) {
      const success = await bcryptService.checkPassword(
        data.password,
        result.data.hash,
      );

      if (success) {
        const devicedId = randomUUID();

        const accessToken = await jwtService.createdJWT(
          {
            deviceId: devicedId,
            userId: String(result.data._id),
          },
          '10s',
        );

        const refreshToken = await jwtService.createdJWT(
          {
            deviceId: devicedId,
            userId: String(result.data._id),
          },
          '20s',
        );

        await this.securityService.createAuthSessions(
          refreshToken,
          dataSession,
        );

        return {
          status: ResultCode.Success,
          data: { accessToken, refreshToken },
        };
      } else {
        throw new UnauthorizedException();
      }
    }

    throw new UnauthorizedException();
  }

  async registration(data: UserCreateModel) {
    const { login, email, password } = data;
    const result = await this.usersQueryRepository.doesExistByLoginOrEmail(
      login,
      email,
    );

    if (!result) {
      throw new BadRequestException([
        { message: 'User founded', field: 'login/email' },
      ]);
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
    });

    await user.save();

    if (user) {
      this.nodemailerService
        .sendEmail(
          email,
          user.emailConfirmation?.confirmationCode!,
          emailExamples.registrationEmail,
        )
        .catch((e) => {
          console.log(e);
        });
    }

    return true;
  }

  async confirmEmail(code: string) {
    const result =
      await this.usersQueryRepository.findUserByCodeConfirmation(code);

    if (!result) {
      throw new BadRequestException([
        { message: 'The code is incorrect', field: 'code' },
      ]);
    }

    if (result.data?.emailConfirmation?.isConfirmed) {
      return true;
    }

    if (
      result.data?.emailConfirmation?.expirationDate &&
      result.data.emailConfirmation.expirationDate < new Date()
    ) {
      throw new BadRequestException([
        { message: 'The code is not valid', field: 'email' },
      ]);
    }
    if (result) {
      try {
        const foundUser = await this.UserModel.findOne({
          _id: result.data._id,
        });

        if (foundUser && foundUser.emailConfirmation) {
          foundUser.emailConfirmation.isConfirmed = true;
          foundUser.emailConfirmation.expirationDate = null;
          foundUser.emailConfirmation.confirmationCode = null;
        }

        await foundUser.save();

        return true;
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }
  }

  async resendCode(email: string) {
    const result = await this.checkUserCredential(email);

    if (result.emailConfirmation?.isConfirmed) {
      throw new BadRequestException([
        { message: 'Email already confirmed', field: 'email' },
      ]);
    }

    if (result && !result.emailConfirmation?.isConfirmed) {
      const code = randomUUID();
      const expirationDate = add(new Date().toISOString(), {
        hours: 0,
        minutes: 1,
      });

      const user = await this.UserModel.findOne({ _id: result._id });

      if (user && user.emailConfirmation) {
        user.emailConfirmation.expirationDate = expirationDate;
        user.emailConfirmation.confirmationCode = code;
      }

      await user.save();

      this.nodemailerService
        .sendEmail(email, code, emailExamples.registrationEmail)
        .catch((e) => console.log(e));

      return true;
    }
  }

  async logout(token: string) {
    const foundedToken = await this.OldRefreshCodeModel.findOne({
      refreshToken: token,
    });

    if (foundedToken) {
      throw new UnauthorizedException();
    }
    const success = await jwtService.getUserIdByToken(token);

    const invalidRefreshToken = new this.OldRefreshCodeModel({
      _id: new Types.ObjectId(),
      refreshToken: token,
    });

    await invalidRefreshToken.save();

    if (success) {
      const data = await decodeToken(token);

      if (data && (await this.securityService.deleteCurrentSession(data))) {
        return true;
      }
    }

    throw new UnauthorizedException();
  }

  async refreshToken(token: string) {
    const validId = await jwtService.getUserIdByToken(token);

    const findedToken = await this.OldRefreshCodeModel.findOne({
      refreshToken: token,
    });

    if (findedToken) {
      throw new UnauthorizedException();
    }

    if (validId && !findedToken) {
      await this.OldRefreshCodeModel.insertMany([
        {
          _id: new Types.ObjectId(),
          refreshToken: token,
        },
      ]);

      const currentUser = await this.UserModel.findOne({
        _id: new ObjectId(validId),
      });

      if (currentUser) {
        const decode = await decodeToken(token);

        const deviceId = decode.deviceId;

        const accessToken = await jwtService.createdJWT(
          { deviceId, userId: String(currentUser._id) },
          '10s',
        );

        const refreshToken = await jwtService.createdJWT(
          { deviceId, userId: String(currentUser._id) },
          '20s',
        );

        const response =
          await this.securityService.updateVersionSession(refreshToken);

        if (response) {
          return {
            data: { accessToken, refreshToken },
          };
        }
      }

      throw new UnauthorizedException();
    }

    //
    // if (validId && !findedToken) {
    //
    //   const newRefreshToken = new RefreshTokenModel({ refreshToken: token });
    //
    //   await newRefreshToken.save();
    //
    //   const user = await this.UserModel.findOne({ _id: new ObjectId(validId) });
    //
    //   if (user) {
    //
    //     const decode = await decodeToken(token);
    //
    //     if (decode) {
    //       const deviceId = decode.deviceId;
    //
    //       const accessToken = await jwtService.createdJWT({ deviceId, userId: String(user._id) }, '10s');
    //       const refreshToken = await jwtService.createdJWT({ deviceId, userId: String(user._id) }, '20s');
    //
    //       const response = await this.securityServices.updateVersionSession(refreshToken);
    //
    //       if (response.status === ResultCode.Success) {
    //         return { status: ResultCode.Success, data: { accessToken, refreshToken } };
    //       }
    //     }
    //   }
    // }
    // return {
    //   status: ResultCode.Unauthorized,
    //   data: null,
    //   errorMessage: {
    //     message: 'If the JWT refreshToken inside cookie is missing, expired or incorrect',
    //     field: 'refreshToken',
    //   },
    // };
  }

  async recoveryCode(email: string) {
    const response = await this.authRepository.findByEmail(email);

    const dataCode = await createRecoveryCode(email, '5m');

    const newCode = new this.RecoveryCodeModel({
      _id: new Types.ObjectId(),
      code: dataCode,
    });

    await newCode.save();

    this.nodemailerService
      .sendEmail(email, dataCode, emailExamples.recoveryPasswordByAccount)
      .catch((e: Error) => console.log(e));

    return true;
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

    throw new BadRequestException([
      { message: 'The code is incorrect', field: 'recoveryCode' },
    ]);
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
