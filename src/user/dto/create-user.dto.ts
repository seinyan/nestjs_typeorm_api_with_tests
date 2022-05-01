import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueUserValidator } from '../unique-user.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.ru' })
  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueUserValidator)
  email: string;

  @ApiProperty({ required: false, example: '111111' })
  @IsString()
  @IsOptional()
  password: string;
}
