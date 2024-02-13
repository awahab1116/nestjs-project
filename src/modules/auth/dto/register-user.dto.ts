import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

/**
 * Data transfer object for registering a user.
 */
export class RegisterUserDto {
  /**
   * The first name of the user.
   * @minimumLength 2
   */
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Firstname must have atleast 2 characters.' })
  firstName: string;

  /**
   * The last name of the user.
   * @minimumLength 2
   */
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Lastname must have atleast 2 characters.' })
  lastName: string;

  /**
   * The email address of the user.
   * @isNotEmpty
   * @isEmail
   */
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please provide valid Email.' })
  email: string;

  /**
   * The password of the user.
   * @isNotEmpty
   * @minimumLength 6
   */
  @IsNotEmpty()
  @MinLength(6, { message: 'Password should have minimum 6 characters' })
  password: string;
}
