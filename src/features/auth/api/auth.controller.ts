import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { UsersService } from '../../users/application/users.service';
import { HTTP_STATUSES } from '../../../settings/http.status';
import { LoginInputModel } from './models/input/login.input.model';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
import { SetNewPasswordModel } from './models/input/set-new-password.model';
import { MappingsUsersService } from '../../users/application/mappings/mappings.users';
import { MapingErrorsService } from '../../../common/utils/mappings.errors.service';
import { MappingsRequestHeadersService } from '../../../common/utils/mappings.request.headers';
import { AuthJwtGuard } from '../../../common/guards/auth.jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService, private readonly mappingsUsersService: MappingsUsersService, private readonly mapingErrorsService: MapingErrorsService, private readonly mappingsRequestHeadersService: MappingsRequestHeadersService) {
  }

  @Post('login')
  async login(@Body() loginModel: LoginInputModel, @Req() req: Request, @Res() res: Response) {

    // const dataSession = this.mappingsRequestHeadersService.getHeadersForCreateSession(req);
    //
    // const result = await this.authService.login(loginModel, dataSession);
    const result = await this.authService.login(loginModel);

    if (result.data) {

      res.cookie('refreshToken', result.data.refreshToken, { httpOnly: true, secure: true });
      res.status(HTTP_STATUSES[result.status]).send({ 'accessToken': result.data.accessToken });
      return;
    }
    res.status(HTTP_STATUSES[result.status]).send({ errorMessage: result.errorMessage, data: result.data });
    return;
  }

  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(@Body() email: string, @Req() req: Request, @Res() res: Response) {
    await this.authService.recoveryCode(email);
    return;
  }

  @HttpCode(204)
  @Post('new-password')
  async setNewPassword(@Body() query: SetNewPasswordModel, @Req() req: Request, @Res() res: Response) {
    const { newPassword, recoveryCode } = query;

    const response = await this.authService.checkValidRecoveryCode(recoveryCode);

    if (!response.data) {

      throw new BadRequestException()
      // res.status(HTTP_STATUSES[response.status]).send({ 'errorsMessages': response.errorsMessages });
      // return;
    }
    await this.authService.updatePassword(newPassword, response.data);

    // res.status(HTTP_STATUSES.NotContent).send({});
    return;
  }

  @HttpCode(204)
  @Post('registration-confirmation')
  async confirmationEmail(@Body('code') code: string, @Req() req: Request, @Res() res: Response) {
    // if (result.errorMessage) {
    //   res.status(HTTP_STATUSES[result.status]).send(this.mapingErrorsService.outputResponse(result.errorMessage));
    //   return;
    // }
    // res.status(HTTP_STATUSES[result.status]).send({});
    return await this.authService.confirmEmail(code);
  }

  @Post('registration')
  async registration(@Body() registerModel: UserCreateModel, @Req() req: Request, @Res() res: Response) {
    const result = await this.authService.registration(registerModel);
    res.status(HTTP_STATUSES.NotContent).send({});
    return;
  }

  @HttpCode(204)
  @Post('registration-email-resending')
  async resendConfirmationCode(@Body('email') email: string, @Req() req: Request, @Res() res: Response) {

    const result = await this.authService.resendCode(email);

    console.log(result);

    if (result.errorMessage) {
      throw new BadRequestException(this.mapingErrorsService.outputResponse(result.errorMessage));
      // res.status(HTTP_STATUSES[result.status]).send(this.mapingErrorsService.outputResponse(result.errorMessage));
      // return;
    }
    return;
  }

  @HttpCode(200)
  @UseGuards(AuthJwtGuard)
  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    const userId = req['userId'];
    if (userId !== null) {
      const result = await this.usersService.findUser(userId);
      if (result) {
        return this.mappingsUsersService.formatViewModel(result);
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

  // @Post()
  // async refreshToken(@Req() req: Request, @Res() res: Response) {
  //   const cookie = req.cookies.refreshToken;
  //
  //   const response = await this.authService.refreshToken(cookie);
  //
  //   if (response.data) {
  //     res.cookie('refreshToken', response.data.refreshToken, { httpOnly: true, secure: true });
  //     res.status(HTTP_STATUSES[response.status]).send({ 'accessToken': response.data.accessToken });
  //     return;
  //   }
  //
  //   res.status(HTTP_STATUSES[response.status]).send(response.errorMessage);
  //   return;
  // }
}
