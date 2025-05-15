import { Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  async passwordRecovery(
    @Body() body: RecoveryPasswordInputModel,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.recoveryCode(body.email);
    res.json();
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @Post('new-password')
  async setNewPassword(
    @Body() query: SetNewPasswordModel,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { newPassword, recoveryCode } = query;

    const response =
      await this.authService.checkValidRecoveryCode(recoveryCode);

    await this.authService.updatePassword(newPassword, response);

    res.json();
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
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
  async confirmationEmail(
    @Body('code') code: string,
    // @Req() req: Request,
    // @Res() res: Response,
  ) {
    await this.authService.confirmEmail(code);
    return;
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @Post('registration')
  async registration(
    @Body() registerModel: UserCreateModel,
    // @Req() req: Request,
    // @Res() res: Response,
  ) {
    await this.authService.registration(registerModel);
    // res.json();
    return;
  }

  @HttpCode(HTTP_STATUSES.NotContent)
  @Post('registration-email-resending')
  async resendConfirmationCode(
    @Body('email') email: string,
    @Res() res: Response,
  ) {
    await this.authService.resendCode(email);
    res.json();
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  // @SkipThrottle()
  @Post('logout')
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
  async me(@Req() req: Request, @Res() res: Response) {
    const userId = req['userId'];

    if (!userId) throw new UnauthorizedException();

    const result = await this.usersService.findUser(userId);

    if (!result) throw new NotFoundException('User not found');

    const resp = this.mappingsUsersService.formatViewModel(result);

    res.json(resp);
  }
}
