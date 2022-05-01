import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { User } from '../entities/user.entity';
import { PaginateResult } from '../../paginate-result';

export class PaginateResultUser extends PaginateResult {
  @ApiModelProperty({ type: User, isArray: true })
  public items: User[];
}
