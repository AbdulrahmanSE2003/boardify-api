import { IsNotEmpty, IsString } from 'class-validator';

export class AddDeleteMemberDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
