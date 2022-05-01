import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { UniqueUserValidator } from '../unique-user.validator';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password']) {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  public id: number;

  @ApiProperty({ example: 'test@test.ru' })
  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueUserValidator)
  public email;
}
