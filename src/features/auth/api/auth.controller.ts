import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { UsersService } from '../../users/application/users.service';
import { LoginInputModel } from './models/input/login.input.model';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
import { SetNewPasswordModel } from './models/input/set-new-password.model';
import { MappingsUsersService } from '../../users/application/mappings/mappings.users';
import { AuthJwtGuard } from '../../../common/guards/auth.jwt.guard';
import { RefreshTokenGuard } from '../../../common/guards/refreshToken.guard';
import { MappingsRequestHeadersService } from '../../../common/utils/mappings.request.headers';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService, private readonly mappingsUsersService: MappingsUsersService, private readonly mappingsRequestHeadersService: MappingsRequestHeadersService) {
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() loginModel: LoginInputModel, @Req() req: Request, @Res() res: Response) {

    const dataSession = this.mappingsRequestHeadersService.getHeadersForCreateSession(req);

    const result = await this.authService.login(loginModel, dataSession);

    res.cookie('refreshToken', result.data.refreshToken, { httpOnly: true, secure: true });

    res.json( {'accessToken': result.data.accessToken });
  }

  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(@Body('email') email: string,  @Req() req: Request, @Res() res: Response) {

    await this.authService.recoveryCode(email);
    res.json();
  }

  @HttpCode(204)
  @Post('new-password')
  async setNewPassword(@Body() query: SetNewPasswordModel, @Req() req: Request, @Res() res: Response) {
    const { newPassword, recoveryCode } = query;

    const response = await this.authService.checkValidRecoveryCode(recoveryCode);

    await this.authService.updatePassword(newPassword, response.data);
    return;
  }

  @HttpCode(204)
  @Post('registration-confirmation')
  async confirmationEmail(@Body('code') code: string, @Req() req: Request, @Res() res: Response) {
    return await this.authService.confirmEmail(code);
  }

  @HttpCode(204)
  @Post('registration')
  async registration(@Body() registerModel: UserCreateModel, @Req() req: Request, @Res() res: Response) {
    await this.authService.registration(registerModel);
    res.json();
  }

  @HttpCode(204)
  @Post('registration-email-resending')
  async resendConfirmationCode(@Body('email') email: string, @Req() req: Request, @Res() res: Response) {
    await this.authService.resendCode(email);
    res.json();
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

  // @Post()
  // async logout(@Req() req: Request, @Res() res: Response) {
  //   const cookie = req.cookies.refreshToken;
  //
  //   if (!cookie) {
  //     res.status(HTTP_STATUSES.Unauthorized).send({});
  //     return;
  //   }
  //
  //   const response = await this.authService.logout(cookie);
  //
  //   res.clearCookie('refreshToken', { httpOnly: true, secure: true });
  //   res.status(HTTP_STATUSES[response.status]).send({});
  //   return;
  // }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const cookie = req.cookies.refreshToken;

    const response = await this.authService.refreshToken(cookie);

    if(response.data) {
      res.cookie('refreshToken', response.data.refreshToken, { httpOnly: true, secure: true });

      return res.status(200).send({ 'accessToken': response.data.accessToken })

    }

    throw new UnauthorizedException();

    // return res.status(200).send({ 'accessToken': response.data.accessToken })

    // if (response.data) {
    //   res.cookie('refreshToken', response.data.refreshToken, { httpOnly: true, secure: true });
    //   res.status(HTTP_STATUSES[response.status]).send({ 'accessToken': response.data.accessToken });
    //   return;
    // }
    //
    // res.status(HTTP_STATUSES[response.status]).send(response.errorMessage);
    // return;
  }
}
