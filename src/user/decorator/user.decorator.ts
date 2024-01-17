import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IExpressRequest } from 'src/types/expressRequest.inteface';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IExpressRequest>();

    if (!request.user) {
      return null;
    }

    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
