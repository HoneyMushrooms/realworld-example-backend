import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt';
import { ITokenPayload } from './types/TokenPayload.interface';
import { UpdateUserDto } from './dto/updateUser.dto';
import { IUserResponse } from './types/userResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (user) {
      throw new UnprocessableEntityException('пока так');
    }

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  generateToken(payload: ITokenPayload): string {
    return sign(
      {
        id: payload.id,
        username: payload.username,
        email: payload.email,
      },
      this.configService.get<string>('JWT_ACCESS_SECRET'),
    );
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      email: loginUserDto.email,
    });

    if (!user) {
      throw new UnprocessableEntityException('пока так');
    }

    const boolen = await compare(loginUserDto.password, user.password);

    if (!boolen) {
      throw new UnprocessableEntityException('пока так');
    }

    return user;
  }

  findById(userId: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id: userId });
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  buildUserResponse(user: UserEntity, token: string): IUserResponse {
    delete user.id;
    delete user.password;
    return {
      user: {
        ...user,
        token,
      },
    };
  }
}
