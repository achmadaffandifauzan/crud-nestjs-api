import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  hobby: string;
}
