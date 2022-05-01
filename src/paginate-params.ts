import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginateParams {
  constructor() {
    this.page = 1;
    this.limit = 15;
    this.order = ['id', 'DESC'];
  }

  @Type(() => Number)
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  public page: number;

  @Type(() => Number)
  @ApiProperty({ required: false, default: 15 })
  @IsNumber()
  public limit: number;

  @ApiProperty({ required: false, example: ['id', 'DESC'] })
  @IsOptional()
  public order: Array<string>;
}
