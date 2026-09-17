import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateBoardDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  title: string;
}
