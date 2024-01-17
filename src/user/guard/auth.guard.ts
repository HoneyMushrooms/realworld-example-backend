import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IExpressRequest } from 'src/types/expressRequest.inteface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<IExpressRequest>();

    if (request.user) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
