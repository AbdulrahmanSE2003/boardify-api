import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
export class SignupDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  passwordConfirm: string;
}
