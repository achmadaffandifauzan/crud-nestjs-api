import { IsString } from 'class-validator';

export class CreateUserNoteDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
