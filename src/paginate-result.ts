import { ApiProperty } from '@nestjs/swagger';

class Meta {
  constructor() {
    this.totalItems = 0;
    this.totalPages = 0;
    this.page = 1;
    this.limit = 15;
    this.order = ['id', 'DESC'];
  }

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  order: Array<any>;
}

export class PaginateResult {
  constructor() {
    this.meta = new Meta();
    this.items = [];
  }
  @ApiProperty()
  public meta: Meta;

  @ApiProperty()
  public items: any[];
}
