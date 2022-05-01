import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LoginResultDto } from './result/login-result.dto';
import { AccessTokenResultDto } from './result/access-token-result.dto';

@ApiTags('Auth  (Test)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: LoginResultDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() { user }) {
    return await this.authService.login(user);
  }

  @ApiOkResponse({ type: AccessTokenResultDto })
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('/accessToken')
  async accessToken(@Request() { user }) {
    return await this.authService.accessToken(user);
  }
}
