import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RestoreUserDto {
  @ApiProperty({ example: 'test@test.ru' })
  @IsNotEmpty()
  @IsEmail()
  public username: string;
}
