import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
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

  // @UseGuards(RefreshTokenGuard)
  @Get('devices')
  async getSessions(@Req() req: Request) {
    const token = req.cookies.refreshToken;
    const data = await decodeToken(token);

    if (!data?.userId) {
      throw new UnauthorizedException();
    }

    // const { userId } = data;

    const sessions = await this.securityQueryRepository.allSessionsUser(
      data.userId,
    );

    if (!sessions) throw new UnauthorizedException();

    return mappingSessions(sessions);
  }

  // @UseGuards(RefreshTokenGuard)
  @HttpCode(HTTP_STATUSES.NotContent)
  @Delete('devices')
  async deleteAllDevices(@Req() req: Request) {
    const refreshToken = req.cookies.refreshToken;

    const isDeleted = await this.securityService.deleteDevices(refreshToken);

    if (!isDeleted) throw new UnauthorizedException();

    return;
  }

  // @UseGuards(RefreshTokenGuard)
  @HttpCode(HTTP_STATUSES.NotContent)
  @Delete('devices/:deviceId')
  async deleteDeviceById(
    @Param('deviceId') deviceId: string,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken || !deviceId) {
      throw new NotFoundException();
    }

    const decode = await decodeToken(refreshToken);

    if (!decode) {
      throw new UnauthorizedException();
    }

    await this.securityService.deleteAuthSessionWithParam(decode, deviceId);

    return;
  }
}
