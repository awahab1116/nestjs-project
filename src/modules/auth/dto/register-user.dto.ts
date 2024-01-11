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

//   const passwordRegEx =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class RegisterUserDto {
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Firstname must have atleast 2 characters.' })
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Lastname must have atleast 2 characters.' })
  lastName: string;

  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password should have minimum 6 characters' })
  password: string;
  // @Matches(passwordRegEx, {
  //   message: `Password must contain Minimum 8 and maximum 20 characters,
  //   at least one uppercase letter,
  //   one lowercase letter,
  //   one number and
  //   one special character`,
  // })
}
