import { ResultCode } from '../../../settings/http.status';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';

import { bcryptService } from '../../../common/services/password-hash.service';
import { jwtService } from '../../../common/services/jwt.service';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
import { randomUUID } from 'node:crypto';
import { AuthRepository } from '../infrastructure/auth.repository';
import { LoginInputModel } from '../api/models/input/login.input.model';
import { ConfirmationInfoEmail } from '../../../common/utils/createConfirmationInfoForEmail';
import { createRecoveryCode } from '../../../common/utils/createRecoveryCode';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NodemailerService } from '../../../common/services/nodemailer.service';
import { emailExamples } from '../../../common/utils/emailExamples';
import { add } from 'date-fns';
import { AuthQueryRepository } from '../infrastructure/auth-query.repository';
import { decodeToken } from '../../../common/services/decode.token';
import { SecurityService } from '../../security/application/security.service';
import { HeaderSessionModel } from '../../../common/models/header.session.model';
import { UsersService } from '../../users/application/users.service';
import { validate as isValidUUID } from 'uuid';
import { AuthTypeOrmRepository } from '../infrastructure/auth.typeorm.repository';
import { SecurityTypeOrmRepository } from '../../security/infrastructure/security.typeorm.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly nodemailerService: NodemailerService,
    private readonly authQueryRepository: AuthQueryRepository,
    private readonly securityService: SecurityService,
    private readonly usersService: UsersService,
    private readonly authTypeORMRepository: AuthTypeOrmRepository,
    private readonly securityTypeOrmRepository: SecurityTypeOrmRepository,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async login(data: LoginInputModel, dataSession: HeaderSessionModel) {
    const { loginOrEmail }: LoginInputModel = data;
    const foundUser =
      await this.authTypeORMRepository.findByLoginOrEmail(loginOrEmail);

    if (foundUser) {
      const success = await bcryptService.checkPassword(
        data.password,
        foundUser.hash,
      );

      if (success) {
        const devicedId = randomUUID();

        const accessToken = await jwtService.createdJWT(
          {
            deviceId: devicedId,
            userId: String(foundUser.id),
          },
          '1h', //10s
        );

        const refreshToken = await jwtService.createdJWT(
          {
            deviceId: devicedId,
            userId: String(foundUser.id),
          },
          '1h', //20s
        );

        await this.securityService.createAuthSessions(
          refreshToken,
          dataSession,
        );

        return {
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

    if (result.resultEmail.length !== 0) {
      throw new BadRequestException([
        { message: 'User founded', field: 'email' },
      ]);
    }

    if (result.resultLogin.length !== 0) {
      throw new BadRequestException([
        { message: 'User founded', field: 'login' },
      ]);
    }

    const hash = await bcryptService.generateHash(password);
    const createdAt = new Date();
    const id = randomUUID();
    const confirmation = new ConfirmationInfoEmail(id);

    const userId = await this.authTypeORMRepository.createUser(
      { id, login, email, hash, createdAt },
      confirmation,
    );

    if (userId) {
      const confirmationCode =
        await this.usersQueryRepository.doesExistConfirmationCode(userId);

      this.nodemailerService
        .sendEmail(email, confirmationCode, emailExamples.registrationEmail)
        .catch((e) => {
          console.log(e);
        });
    }
    return true;
  }

  async confirmEmail(code: string) {
    if (!isValidUUID(code)) {
      throw new BadRequestException([
        { message: 'The code is not valid', field: 'code' },
      ]);
    }

    const isFindCode =
      await this.usersQueryRepository.findCodeConfirmation(code);

    if (!isFindCode) {
      throw new BadRequestException([
        { message: 'The code is incorrect', field: 'code' },
      ]);
    }

    if (isFindCode.isConfirmed) {
      return true;
    }

    if (isFindCode.expirationDate && isFindCode.expirationDate < new Date()) {
      throw new BadRequestException([
        { message: 'The code is not valid', field: 'email' },
      ]);
    }

    const foundUser = await this.usersQueryRepository.doesExistById(
      isFindCode.userId,
    );

    if (isFindCode && foundUser) {
      await this.authTypeORMRepository.updateConfirmationInfo(
        true,
        null,
        null,
        isFindCode.userId,
      );
    }
    return true;
  }

  async resendCode(email: string) {
    const result = await this.checkUserCredential(email);

    if (!result) {
      throw new BadRequestException([
        {
          message: 'If the inputModel has incorrect values',
          field: 'email',
        },
      ]);
    }

    const isConfirmed =
      await this.usersQueryRepository.doesExistConfirmationEmail(result.id);

    if (isConfirmed) {
      throw new BadRequestException([
        { message: 'Email already confirmed', field: 'email' },
      ]);
    }

    if (result && !isConfirmed) {
      const code = randomUUID();
      const expirationDate = add(new Date().toISOString(), {
        hours: 0,
        minutes: 10,
      });

      await this.authTypeORMRepository.updateConfirmationInfo(false, expirationDate, code, result.id)

      this.nodemailerService
        .sendEmail(email, code, emailExamples.registrationEmail)
        .catch((e) => console.log(e));

      return true;
    }
  }

  async logout(token: string) {
    console.log(token);

    const foundedToken =
      await this.authQueryRepository.findOneOldRefreshToken(token);

    if (foundedToken) {
      throw new UnauthorizedException();
    }

    const correctIdUser = await jwtService.getUserIdByToken(token);

    const successAddRefreshToken =
      await this.authTypeORMRepository.addOverdueRefreshToken(token);

    //add search user on id
    if (correctIdUser) {
      const data = await decodeToken(token);

      if (data) {
        await this.securityService.deleteCurrentSession(data);

        return true;
      }
    }

    throw new UnauthorizedException();
  }

  async refreshToken(token: string) {
    const validId = await jwtService.getUserIdByToken(token);

    const findedToken =
      await this.authQueryRepository.findOneOldRefreshToken(token);

    if (findedToken) {
      throw new UnauthorizedException();
    }

    if (validId && !findedToken) {
      await this.authTypeORMRepository.addOverdueRefreshToken(token);

      const currentUser = await this.usersService.findUser(validId);

      if (currentUser) {
        const decode = await decodeToken(token);
        const deviceId = decode.deviceId;
        const accessToken = await jwtService.createdJWT(
          { deviceId, userId: currentUser.id },
          '1h', //10s
        );
        const refreshToken = await jwtService.createdJWT(
          { deviceId, userId: currentUser.id },
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
    }

    throw new UnauthorizedException();
  }

  async recoveryCode(email: string) {
    const response = await this.authTypeORMRepository.findByEmail(email);

    if (response) {
      const dataCode = await createRecoveryCode(email, '1h');

      await this.authTypeORMRepository.createRecoveryCode(
        response.id,
        dataCode,
      );

      this.nodemailerService
        .sendEmail(email, dataCode, emailExamples.recoveryPasswordByAccount)
        .catch((e: Error) => console.log(e));
    }
    return true;
  }

  async updatePassword(password: string, email: string) {
    const isSearchUser =
      await this.usersQueryRepository.doesExistByEmail(email);

    if (isSearchUser) {
      const hash = await bcryptService.generateHash(password);

      await this.authTypeORMRepository.updatePasswordByUserEmail(email, hash);
    }
    return;
  }

  async checkValidRecoveryCode(code: string): Promise<string> {
    const email = await jwtService.getEmailByToken(code);

    if (email) return email;

    throw new BadRequestException([
      { message: 'The code is incorrect', field: 'recoveryCode' },
    ]);
  }

  async checkUserCredential(login: string) {
    return await this.authRepository.findByEmail(login);
  }

  async checkAccessToken(authHeader: string) {
    const token = authHeader.split(' ');

    if (token[0] !== 'Bearer') throw new UnauthorizedException();

    const id = await jwtService.getUserIdByToken(token[1]);

    if (!id) throw new UnauthorizedException();

    const payload = await this.usersQueryRepository.doesExistById(id);

    if (!payload) throw new UnauthorizedException();

    return {
      status: ResultCode.Success,
      data: payload.id,
      login: payload.login,
    };
  }
}
