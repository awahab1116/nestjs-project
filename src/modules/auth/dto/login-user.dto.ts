import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * Data transfer object for logging in a user.
 */
export class LoginUserDto {
  /**
   * The email of the user.
   * @example example@example.com
   */
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please provide valid Email.' })
  email: string;

  /**
   * The password of the user.
   * @example password123
   */
  @IsNotEmpty()
  @MinLength(6, { message: 'Password should have minimum 6 characters' })
  password: string;
}
