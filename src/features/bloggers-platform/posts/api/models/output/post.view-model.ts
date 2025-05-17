import { QuerySortSearch } from '../../../../../../common/models/query-sort-search.model';
import { ApiProperty } from '@nestjs/swagger';
import { PostOutputModel } from './post.output.model';

export class PostViewModel extends QuerySortSearch {
  @ApiProperty({
    type: [PostOutputModel],
  })
  items: PostOutputModel[]

}