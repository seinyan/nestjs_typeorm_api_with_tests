import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { RestoreUserDto } from './dto/restore-user.dto';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

@ApiTags('User (Test)')
@Controller('user')
export class UserPublicController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'User register' })
  @ApiCreatedResponse({ type: User, description: 'Register' })
  @ApiBadRequestResponse()
  @ApiBody({ type: CreateUserDto })
  @Post('/register')
  async register(@Body() dto: CreateUserDto) {
    return await this.userService.register(dto);
  }

  @ApiOperation({ summary: 'User restore password' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiBody({ type: RestoreUserDto })
  @HttpCode(HttpStatus.OK)
  @Post('/restore')
  async restore(@Body() dto: RestoreUserDto) {
    if (await this.userService.restore(dto)) {
      return;
    }

    throw new NotFoundException();
  }

  @ApiOkResponse({ type: Boolean })
  @ApiNotFoundResponse()
  @Get('/checkUsername')
  async checkUsername(@Query('username') username: string) {
    return await this.userService.checkUsername(username);
  }
}
