import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  NotFoundException,
  Put,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PaginateQueryUserDto } from './dto/paginate-query-user.dto';
import { PaginateResultUser } from './paginate/paginate-result-user.';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { RestoreUserDto } from './dto/restore-user.dto';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: Boolean })
  @ApiNotFoundResponse()
  @Get('/checkUsername')
  async checkUsername(@Query('username') username: string) {
    return await this.userService.checkUsername(username);
  }

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

  @ApiOkResponse({ type: PaginateResultUser })
  @Get()
  async paginate(@Query() dto: PaginateQueryUserDto) {
    return await this.userService.paginate(dto);
  }

  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user: User = await this.userService.findOne(+id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    if (await this.userService.update(+id, dto)) {
      return;
    }

    throw new NotFoundException();
  }

  @ApiBody({ type: UpdatePasswordUserDto })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Patch('/password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordUserDto,
  ) {
    if (await this.userService.updatePassword(+id, dto)) {
      return;
    }

    throw new NotFoundException();
  }

  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (await this.userService.remove(+id)) {
      return;
    }

    throw new NotFoundException();
  }
}
