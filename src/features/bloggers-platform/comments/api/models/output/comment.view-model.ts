import { QuerySortSearch } from '../../../../../../common/models/query-sort-search.model';
import { ApiProperty } from '@nestjs/swagger';
import { CommentOutputModel } from './comment.output.model';

export class CommentViewModel extends QuerySortSearch{

@ApiProperty({
  type: [CommentOutputModel],
})
  items: [CommentOutputModel]
}