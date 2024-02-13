import { Module } from '@nestjs/common';
import { LoginService } from './login/login.service';
import { LogoutService } from './logout/logout.service';
import { RegisterService } from './register/register.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { UserProfileService } from './user-profile/user-profile.service';

/**
 * Module for handling authentication related functionality.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [LoginService, LogoutService, RegisterService, UserProfileService],
  controllers: [AuthController],
  exports: [UserProfileService],
})
export class AuthModule {}
