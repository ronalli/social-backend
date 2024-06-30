import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../features/auth/application/auth.service';
import { ResultCode } from '../../settings/http.status';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }

    const result = await this.authService.checkAccessToken(request.headers.authorization)

    if(result.status === ResultCode.Success && result.data) {
      request['userId'] = result.data
      request['login'] = result.login
      return true;
    }

    return false;
  }
}