import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Query,
  NotFoundException,
  Put,
  Patch, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PaginateQueryUserDto } from './dto/paginate-query-user.dto';
import { PaginateResultUser } from './paginate/paginate-result-user.';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@ApiTags('User (Test)')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: PaginateResultUser })
  @UseGuards(JwtAuthGuard)
  @Get()
  async paginate(@Query() dto: PaginateQueryUserDto) {
    return await this.userService.paginate(dto);
  }

  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (await this.userService.remove(+id)) {
      return;
    }

    throw new NotFoundException();
  }
}
