import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export class BasicAuthGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {

     const request = context.switchToHttp().getRequest();
     const auth = request.headers.authorization;
      if(!auth) {
        throw new UnauthorizedException();
      } else {
        const token = Buffer.from(auth.slice(6), 'base64').toString();
        const typeEncryption = auth.slice(0, 5);
        const [name, password] = token.split(':')
        const adminData = process.env.BASIC_TOKEN as string;
        const [basicName, basicPassword] = adminData.split(":");
        return name === basicName && password === basicPassword && typeEncryption === 'Basic';
      }

  }
}