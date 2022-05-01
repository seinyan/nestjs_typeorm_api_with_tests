import { Controller, Get, Query } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginateQueryItemDto } from '../item/dto/paginate-query-item.dto';
import { PaginateResultNotice } from './paginate/paginate-result-notice.';

@ApiTags('Notice (Test not full functional)')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiOkResponse({ type: PaginateResultNotice })
  @Get()
  async paginate(@Query() dto: PaginateQueryItemDto) {
    return await this.noticeService.paginate(dto);
  }
}
