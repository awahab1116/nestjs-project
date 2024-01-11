import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entity/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import {
  LoginPasswordInvalidException,
  UserNotFoundException,
} from '../../../exception/errors.exception';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
      // 'User not found,email invalid',
      // HttpStatus.NOT_FOUND,
    }

    const isPasswordMatched = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new LoginPasswordInvalidException('Provided password not correct');
    }
    const { password, ...result } = user;
    const payload = { id: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      user: result,
      access_token,
    };
  }

  //   registerUser(registerUserDto: RegisterUserDto): Promise<User> {
  //     console.log('In service');
  //     const user: User = new User();
  //     user.firstName = registerUserDto.firstName;
  //     user.lastName = registerUserDto.lastName;
  //     user.email = registerUserDto.email;
  //     user.password = registerUserDto.password;
  //     user.createdAt = new Date();
  //     user.updatedAt = new Date();
  //     return this.userRepository.save(user);
  //   }
}
