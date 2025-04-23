import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from '../../../common/guards/refreshToken.guard';
import { Request, Response } from 'express';
import { decodeToken } from '../../../common/services/decode.token';
import { SecurityQueryRepository } from '../infrastructure/security-query.repository';
import { SecurityService } from '../application/security.service';
import { mappingSessions } from '../../../common/utils/mappings.sessions.service';
import { SkipThrottle } from '@nestjs/throttler';
import { HTTP_STATUSES } from '../../../settings/http.status';

// @SkipThrottle()
@ApiTags('Security')
@UseGuards(RefreshTokenGuard)
@Controller('security')
export class SecurityController {
  constructor(
    private readonly securityQueryRepository: SecurityQueryRepository,
    private readonly securityService: SecurityService,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get('devices')
  async getSessions(@Req() req: Request) {
    const token = req.cookies.refreshToken;
    const data = await decodeToken(token);

    if (!data) {
      throw new UnauthorizedException();
    }

    const { userId } = data;

    const response = await this.securityQueryRepository.allSessionsUser(userId);

    if (!response) throw new UnauthorizedException();

    return mappingSessions(response);
  }

  @UseGuards(RefreshTokenGuard)
  @Delete('devices')
  async deleteAllDevices(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;

    const response = await this.securityService.deleteDevices(refreshToken);

    if (response) return res.status(HTTP_STATUSES.NotContent).send({});

    throw new UnauthorizedException();
  }

  @UseGuards(RefreshTokenGuard)
  @Delete('devices/:deviceId')
  async deleteDeviceById(
    @Param('deviceId') deviceId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken || !deviceId) {
      throw new NotFoundException();
    }

    const decode = await decodeToken(refreshToken);

    if (decode) {
      await this.securityService.deleteAuthSessionWithParam(decode, deviceId);

      return res.status(HTTP_STATUSES.NotContent).send({});
    }
    throw new UnauthorizedException();
  }
}
