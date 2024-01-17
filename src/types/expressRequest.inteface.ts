import { Request } from 'express';
import { UserEntity } from 'src/user/entity/user.entity';

export interface IExpressRequest extends Request {
  user?: UserEntity;
}
