import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../../../common/guards/refreshToken.guard';
import {Request, Response} from 'express';
import { decodeToken } from '../../../common/services/decode.token';
import { SecurityQueryRepository } from '../infrastructure/security-query.repository';

@ApiTags('Security')
@UseGuards(RefreshTokenGuard)
@Controller('security')
export class SecurityController {

  constructor(private readonly securityQueryRepository: SecurityQueryRepository) {
  }

  @Get('devices')
  async getSessions(@Req() req: Request) {

    const token = req.cookies.refreshToken;
    const data = await decodeToken(token)

    if (!data) {
      throw new UnauthorizedException();
    }

    const { userId } = data;
    const response = await this.securityQueryRepository.allSessionsUser(userId)

    if (!response)
      throw new UnauthorizedException();

    return response;

  }
}