import {
  Controller,
  Get,
  Body,
  Put,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('User (Test)')
@Controller('user')
export class UserCurrentController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: User })
  @UseGuards(JwtAuthGuard)
  @Get('/get')
  async get(@Request() { user }) {
    return await this.userService.findOne(user.id);
  }

  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Put('/update')
  async update(@Request() { user }, @Body() dto: UpdateUserDto) {
    return await this.userService.update(+user.id, dto);
  }

  @ApiBody({ type: UpdatePasswordUserDto })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Patch('/password')
  async updatePassword(
    @Request() { user },
    @Body() dto: UpdatePasswordUserDto,
  ) {
    return await this.userService.updatePassword(+user.id, dto);
  }
}
