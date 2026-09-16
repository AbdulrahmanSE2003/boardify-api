import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  name: string;

  @IsOptional()
  @IsString()
  image: string;
}
