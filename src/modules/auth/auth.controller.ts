import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';
import { UserProfileService } from './user-profile/user-profile.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Public } from '../../constant/customdecorator';

/**
 * Controller responsible for handling authentication-related requests.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly userProfileService: UserProfileService,
  ) {}

  /**
   * Endpoint for registering a new user.
   * @param registerUserDto - The data required to register a user.
   * @returns A promise that resolves to the result of the registration process.
   */
  @Public()
  @Post('register-user')
  create(@Body() registerUserDto: RegisterUserDto) {
    console.log('In controller');
    return this.registerService.registerUser(registerUserDto);
  }

  /**
   * Endpoint for user login.
   * @param loginUserDto - The data required to authenticate a user.
   * @returns A promise that resolves to the result of the login process.
   */
  @Public()
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.loginService.loginUser(loginUserDto);
  }

  /**
   * Endpoint for retrieving user profile.
   * @param req - The request object containing user information.
   * @returns A promise that resolves to the user profile.
   */
  @Get('profile')
  getProfile(@Request() req) {
    return this.userProfileService.userProfile(req.user.id);
  }
}
