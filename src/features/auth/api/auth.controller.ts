import { Request, Response } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { UsersService } from '../../users/application/users.service';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
import { LoginInputModel } from './models/input/login.input.model';
import { AuthJwtGuard } from '../../../common/guards/auth.jwt.guard';
import { MappingsUsersService } from '../../users/application/mappings/mappings.users';
import { SetNewPasswordModel } from './models/input/set-new-password.model';
import { RefreshTokenGuard } from '../../../common/guards/refreshToken.guard';
import { MappingsRequestHeadersService } from '../../../common/utils/mappings.request.headers';
import { SkipThrottle } from '@nestjs/throttler';
import { HTTP_STATUSES } from '../../../settings/http.status';
import { RecoveryPasswordInputModel } from '../../users/api/models/input/recovery-password.input.model';
import { LoginApiResponse } from '../../../common/services/swagger/auth/login.api-response';
import { PasswordRecoveryApiResponse } from '../../../common/services/swagger/auth/pasword-recovery.api-response';
import { NewPasswordApiResponse } from '../../../common/services/swagger/auth/new-password.api-response';
import { RefreshTokenApiResponse } from '../../../common/services/swagger/auth/refresh-token.api-response';
import { RegistrationConfirmationApiResponse } from '../../../common/services/swagger/auth/registration-confirmation.api-response';
import { RegistrationConfirmationCode } from './models/input/registration-confirmation-code.model';
import { RegistrationApiResponse } from '../../../common/services/swagger/auth/registration.api-response';
import { RegistrationEmailResendingApiResponse } from '../../../common/services/swagger/auth/registration-email-resending.api-response';
import { RegistrationEmailResending } from './models/input/registration-email-resending.model';
import { LogoutApiResponse } from '../../../common/services/swagger/auth/logout.api-response';
import { MeApiResponse } from '../../../common/services/swagger/auth/me.api-response';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
} as const;

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mappingsUsersService: MappingsUsersService,
    private readonly mappingsRequestHeadersService: MappingsRequestHeadersService,
  ) {}

  @Post('login')
  @LoginApiResponse()
  @HttpCode(HTTP_STATUSES.Success)
  async login(
    @Body() loginModel: LoginInputModel,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const dataSession =
      this.mappingsRequestHeadersService.getHeadersForCreateSession(req);

    const result = await this.authService.login(loginModel, dataSession);

    res.cookie('refreshToken', result.data.refreshToken, COOKIE_OPTIONS);

    res.json({ accessToken: result.data.accessToken });
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @Post('password-recovery')
  @PasswordRecoveryApiResponse()
  async passwordRecovery(@Body() body: RecoveryPasswordInputModel) {
    await this.authService.recoveryCode(body.email);
    return;
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @Post('new-password')
  @NewPasswordApiResponse()
  async setNewPassword(@Body() query: SetNewPasswordModel) {
    const { newPassword, recoveryCode } = query;

    const response =
      await this.authService.checkValidRecoveryCode(recoveryCode);

    await this.authService.updatePassword(newPassword, response);

    return;
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  @RefreshTokenApiResponse()
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const cookie = req.cookies.refreshToken;
    const response = await this.authService.refreshToken(cookie);

    if (response.data) {
      res.cookie('refreshToken', response.data.refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return res.status(200).send({ accessToken: response.data.accessToken });
    }

    throw new UnauthorizedException();
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @Post('registration-confirmation')
  @RegistrationConfirmationApiResponse()
  async confirmationEmail(@Body() body: RegistrationConfirmationCode) {
    await this.authService.confirmEmail(body.code);
    return;
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @Post('registration')
  @RegistrationApiResponse()
  async registration(@Body() registerModel: UserCreateModel) {
    await this.authService.registration(registerModel);
    return;
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @Post('registration-email-resending')
  @RegistrationEmailResendingApiResponse()
  async resendConfirmationCode(@Body() body: RegistrationEmailResending) {
    await this.authService.resendCode(body.email);
    return;
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @SkipThrottle()
  @Post('logout')
  @LogoutApiResponse()
  async logout(@Req() req: Request, @Res() res: Response) {
    const cookie = req.cookies.refreshToken;

    if (!cookie) {
      throw new UnauthorizedException();
    }

    const response = await this.authService.logout(cookie);

    if (response) {
      res.clearCookie('refreshToken', COOKIE_OPTIONS);
      return res.status(HTTP_STATUSES.NotContent).send({});
    }

    throw new UnauthorizedException();
  }

  @ApiBearerAuth()
  @HttpCode(HTTP_STATUSES.Success)
  @UseGuards(AuthJwtGuard)
  @Get('me')
  @MeApiResponse()
  async me(@Req() req: Request) {
    const userId = req['userId'];

    if (!userId) throw new UnauthorizedException();

    const result = await this.usersService.findUser(userId);

    if (!result) throw new NotFoundException('User not found');

    return this.mappingsUsersService.formatViewModel(result);
  }
}
