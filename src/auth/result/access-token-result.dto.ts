import { OmitType } from '@nestjs/swagger';
import { LoginResultDto } from './login-result.dto';

export class AccessTokenResultDto extends OmitType(LoginResultDto, [
  'refreshToken',
]) {}
