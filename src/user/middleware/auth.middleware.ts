import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { IExpressRequest } from 'src/types/expressRequest.inteface';
import { UserService } from '../user.service';
import { ITokenPayload } from '../types/TokenPayload.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      return next();
    }
    const token = req.headers.authorization.split(' ')[1];

    try {
      const userData = verify(
        token,
        this.configService.get<string>('JWT_ACCESS_SECRET'),
      ) as ITokenPayload;
      const user = await this.userService.findById(userData.id);
      delete user.password;

      req.user = user;
      next();
    } catch {
      req.user = null;
      next();
    }
  }
}
