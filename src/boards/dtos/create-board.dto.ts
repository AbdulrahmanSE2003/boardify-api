import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBoardDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  title: string;
}
