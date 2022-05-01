import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { PaginateResult } from '../../paginate-result';
import { Notice } from '../entities/notice.entity';

export class PaginateResultNotice extends PaginateResult {
  @ApiModelProperty({ type: Notice, isArray: true })
  public items: Notice[];
}
