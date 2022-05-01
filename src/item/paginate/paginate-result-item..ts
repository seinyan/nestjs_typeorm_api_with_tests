import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Item } from '../entities/item.entity';
import { PaginateResult } from '../../paginate-result';

export class PaginateResultItem extends PaginateResult {
  @ApiModelProperty({ type: Item, isArray: true })
  public items: Item[];
}
