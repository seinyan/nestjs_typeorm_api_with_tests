import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordUserDto {
  @ApiProperty({ example: '111111' })
  @IsNotEmpty()
  public password: string;
}
