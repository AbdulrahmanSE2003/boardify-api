import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SearchUsersDTO {
  @IsEmail({}, { message: 'Please provide a valid email address format.' })
  email: string;
}
