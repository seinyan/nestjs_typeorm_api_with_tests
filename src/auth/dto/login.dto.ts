import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@test.ru' })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty({ example: '111111' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
