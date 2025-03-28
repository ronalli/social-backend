import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mappingsUsersService: MappingsUsersService,
    private readonly mappingsRequestHeadersService: MappingsRequestHeadersService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginModel: LoginInputModel,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const dataSession =
      this.mappingsRequestHeadersService.getHeadersForCreateSession(req);

    const result = await this.authService.login(loginModel, dataSession);

    res.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    res.json({ accessToken: result.data.accessToken });
  }

  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(
    @Body('email') email: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.recoveryCode(email);
    res.json();
  }

  @HttpCode(204)
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

  @HttpCode(204)
  @Post('registration-confirmation')
  async confirmationEmail(
    @Body('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.confirmEmail(code);
    res.json();
  }

  @HttpCode(204)
  @Post('registration')
  async registration(
    @Body() registerModel: UserCreateModel,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.registration(registerModel);
    res.json();
  }

  @HttpCode(204)
  @Post('registration-email-resending')
  async resendConfirmationCode(
    @Body('email') email: string,
    @Res() res: Response,
  ) {
    await this.authService.resendCode(email);
    res.json();
  }

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
      res.clearCookie('refreshToken', { httpOnly: true, secure: true });
      return res.status(204).send({});
    }

    throw new UnauthorizedException();
  }

  @HttpCode(200)
  @UseGuards(AuthJwtGuard)
  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    const userId = req['userId'];
    if (userId !== null) {
      const result = await this.usersService.findUser(userId);
      if (result) {
        res.json(this.mappingsUsersService.formatViewModel(result));
      }
    }
  }
}
