import { ApiProperty } from '@nestjs/swagger';

export class LoginResultDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
