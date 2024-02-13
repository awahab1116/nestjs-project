/**
 * Service responsible for handling user login functionality.
 */
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

  /**
   * Authenticates a user by comparing the provided email and password with the stored user credentials.
   * @param loginUserDto - The DTO containing the email and password of the user.
   * @returns An object containing the user details and an access token upon successful authentication.
   * @throws UserNotFoundException if the user with the provided email does not exist.
   * @throws LoginPasswordInvalidException if the provided password is incorrect.
   */
  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
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
}
