import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserDecorator {
  id: string;
  login: string;
}

export const User = createParamDecorator(
  (
    data: keyof UserDecorator | undefined,
    ctx: ExecutionContext,
  ): UserDecorator => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.userId || !request.login) {
      throw new Error('User data not found in request');
    }

    const user = {
      id: request.userId,
      login: request.login,
    };

    return data ? user[data] : user;
  },
);
