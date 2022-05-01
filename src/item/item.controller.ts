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
  HttpCode,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginateQueryItemDto } from './dto/paginate-query-item.dto';
import { PaginateResultItem } from './paginate/paginate-result-item.';
import { Item } from './entities/item.entity';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

@ApiTags('Item  (Test)')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiOkResponse({ type: PaginateResultItem })
  @Get()
  async paginate(@Query() dto: PaginateQueryItemDto) {
    return await this.itemService.paginate(dto);
  }

  @ApiOkResponse({ type: Item })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item: Item = await this.itemService.findOne(+id);
    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  @ApiCreatedResponse({ type: Item })
  @ApiBadRequestResponse()
  @ApiBody({ type: CreateItemDto })
  @Post()
  async create(@Body() dto: CreateItemDto) {
    return await this.itemService.create(dto);
  }

  @ApiBody({ type: UpdateItemDto })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    if (await this.itemService.update(+id, dto)) {
      return;
    }

    throw new NotFoundException();
  }

  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (await this.itemService.remove(+id)) {
      return;
    }

    throw new NotFoundException();
  }
}
