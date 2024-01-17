import { UserEntity } from '../entity/user.entity';

export interface IUserResponse {
  user: { token: string } & Omit<
    UserEntity,
    'id' | 'password' | 'getHashPassword'
  >;
}
