import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { IUserResponse } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { User } from './decorator/user.decorator';
import { UserEntity } from './entity/user.entity';
import { AuthGuard } from './guard/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller()
export class UserController {
  constructor(private readonly userServise: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userServise.createUser(createUserDto);
    const token = this.userServise.generateToken(user);
    return this.userServise.buildUserResponse(user, token);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userServise.login(loginUserDto);
    const token = this.userServise.generateToken(user);
    return this.userServise.buildUserResponse(user, token);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<IUserResponse> {
    const token = this.userServise.generateToken(user);
    return this.userServise.buildUserResponse(user, token);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateUser(
    @Body('user') updateUserDto: UpdateUserDto,
    @User('id') userId: number,
  ): Promise<IUserResponse> {
    const user = await this.userServise.updateUser(userId, updateUserDto);
    const token = this.userServise.generateToken(user);
    return this.userServise.buildUserResponse(user, token);
  }
}
