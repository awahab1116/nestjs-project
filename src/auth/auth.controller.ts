import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';
import { UserProfileService } from './user-profile/user-profile.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Public } from '../constant/customdecorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly userProfileService: UserProfileService,
  ) {}

  @Public()
  @Post('register-user')
  create(@Body() registerUserDto: RegisterUserDto) {
    console.log('In controller');
    return this.registerService.registerUser(registerUserDto);
  }

  @Public()
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.loginService.loginUser(loginUserDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.userProfileService.userProfile(req.user.id);
  }
}
