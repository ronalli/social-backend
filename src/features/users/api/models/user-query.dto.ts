import { QueryParamsDto } from '../../../../common/models/query-params.dto';
import { IsOptional } from 'class-validator';

export class UserQueryDto extends QueryParamsDto {
  @IsOptional()
  searchLoginTerm?: string = null;

  @IsOptional()
  searchEmailTerm?: string = null;
}
