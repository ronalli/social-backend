import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
import { Request } from 'express';
import { decodeToken } from '../../../common/services/decode.token';
import { SecurityQueryRepository } from '../infrastructure/security-query.repository';
import { SecurityService } from '../application/security.service';
import { mappingSessions } from '../../../common/utils/mappings.sessions.service';
import { SkipThrottle } from '@nestjs/throttler';
import { HTTP_STATUSES } from '../../../settings/http.status';
import { GetDevicesApiResponse } from '../../../common/services/swagger/security/get-devices.api-response';
import { DeleteAllApiResponse } from '../../../common/services/swagger/security/delete-all.api-response';
import { DeleteSpecifiedApiResponse } from '../../../common/services/swagger/security/delete-specified.api-response';

@SkipThrottle()
@ApiTags('Security')
@UseGuards(RefreshTokenGuard)
@Controller('security')
export class SecurityController {
  constructor(
    private readonly securityQueryRepository: SecurityQueryRepository,
    private readonly securityService: SecurityService,
  ) {}

  @ApiBearerAuth()
  @Get('devices')
  @GetDevicesApiResponse()
  async getSessions(@Req() req: Request) {
    const token = req.cookies.refreshToken;
    const data = await decodeToken(token);

    if (!data?.userId) {
      throw new UnauthorizedException();
    }
    const sessions = await this.securityQueryRepository.allSessionsUser(
      data.userId,
    );

    if (!sessions) throw new UnauthorizedException();

    return mappingSessions(sessions);
  }

  @ApiBearerAuth()
  @HttpCode(HTTP_STATUSES.NotContent)
  @Delete('devices')
  @DeleteAllApiResponse()
  async deleteAllDevices(@Req() req: Request) {
    const refreshToken = req.cookies.refreshToken;

    const isDeleted = await this.securityService.deleteDevices(refreshToken);

    if (!isDeleted) throw new UnauthorizedException();

    return;
  }

  @ApiBearerAuth()
  @HttpCode(HTTP_STATUSES.NotContent)
  @Delete('devices/:deviceId')
  @DeleteSpecifiedApiResponse()
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
