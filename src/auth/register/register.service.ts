import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { RegisterUserDto } from '../dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    console.log('Salt is ', salt);
    const hashedPassword = await bcrypt.hash(registerUserDto.password, salt);
    const user: User = new User();
    user.firstName = registerUserDto.firstName;
    user.lastName = registerUserDto.lastName;
    user.email = registerUserDto.email;
    user.password = hashedPassword;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return this.userRepository.save(user);
  }
}
