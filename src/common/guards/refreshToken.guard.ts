import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtService } from '../services/jwt.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken)
      throw new UnauthorizedException('Refresh token not found');

    const foundUser = await jwtService.getUserIdByToken(refreshToken);

    if (!foundUser) throw new UnauthorizedException('User not found');

    return true;
  }
}
