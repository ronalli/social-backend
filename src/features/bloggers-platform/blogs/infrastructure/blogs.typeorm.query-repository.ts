import { Injectable } from '@nestjs/common';
import { QueryParamsService } from '../../../../common/utils/create.default.values';
import { BlogQueryDto } from '../api/models/blog-query.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogOutputModel } from '../api/models/output/blog.output.model';
import { Blog } from '../domain/blog.entity';
import { Post } from '../../posts/domain/post.entity';
import { MappingsPostsService } from '../../posts/application/mappings/mapping.posts';

@Injectable()
export class BlogsTypeOrmQueryRepository {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectDataSource() protected dataSource: DataSource,
    public queryParamsService: QueryParamsService,
    private readonly mappingsPostsService: MappingsPostsService,
  ) {}

  async getAndSortPostsSpecialBlog(
    blogId: string,
    queryParams: BlogQueryDto,
    userId: string,
  ) {
    const defaultQueryParams =
      this.queryParamsService.createDefaultValuesQueryParams(queryParams);

    const { pageNumber, pageSize, sortBy, sortDirection } = defaultQueryParams;

    const queryBuilder = this.postRepository
      .createQueryBuilder('p')
      .select([
        'p.id AS id',
        'p.title AS title',
        'p.shortDescription AS "shortDescription"',
        'p.content AS content',
        'p.blogId as "blogId"',
        'b.name AS "blogName"',
        'p.createdAt AS "createdAt"',
      ]);

    if (userId === 'None') {
      queryBuilder.addSelect(`'None'`, 'myStatus');
    } else {
      queryBuilder.addSelect((subQuery) => {
        return subQuery
          .select("COALESCE(s.likeStatus, 'None')", 'myStatus')
          .from('postsLikeStatus', 's')
          .where('s.postId = p.id')
          .andWhere('s.userId = :userId', { userId });
      }, 'myStatus');
    }
    queryBuilder
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)')
          .from('postsLikeStatus', 'pls')
          .where('pls.postId = p.id')
          .andWhere("pls.likeStatus = 'Like'");
      }, 'likesCount')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)')
          .from('postsLikeStatus', 'pls')
          .where('pls.postId = p.id')
          .andWhere("pls.likeStatus = 'Dislike'");
      }, 'dislikesCount')
      .addSelect((subQuery) => {
        return subQuery.select("COALESCE(json_agg(likes), '[]')").from((qb) => {
          return qb
            .select([
              'pls.userId AS "userId"',
              'u.login AS login',
              'pls.createdAt AS "addedAt"',
            ])
            .from('postsLikeStatus', 'pls')
            .innerJoin('users', 'u', 'u.id = pls.userId')
            .where('pls.postId = p.id')
            .andWhere("pls.likeStatus = 'Like'")
            .orderBy('pls.createdAt', 'DESC')
            .limit(3);
        }, 'likes');
      }, 'newestLikes')
      .innerJoin('blogs', 'b', 'b.id = p.blogId')
      .where('p.blogId = :blogId', { blogId })
      .orderBy(`p."${sortBy}"`, `${sortDirection}`)
      .limit(pageSize)
      .offset(pageSize * (pageNumber - 1));

    const posts = await queryBuilder.getRawMany();

    const totalCount = await queryBuilder.clone().getCount();

    const items = this.mappingsPostsService.formatingAllPostForView(posts);

    return {
      pagesCount: +Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items,
    };
  }

  async getAllBlogs(queryParams: BlogQueryDto) {
    const defaultQueryParams =
      this.queryParamsService.createDefaultValues(queryParams);

    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      defaultQueryParams;

    const result = await this.blogRepository
      .createQueryBuilder('b')
      .where(searchNameTerm ? 'b.name ILIKE :name' : '1=1', {
        name: `%${searchNameTerm}%`,
      })
      .addOrderBy(`"${sortBy}"`, `${sortDirection}`)
      .skip(pageSize * (pageNumber - 1))
      .take(pageSize)
      .getManyAndCount();

    const pagesCount = Math.ceil(result[1] / pageSize);

    return {
      pagesCount: +pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +result[1],
      items: result[0],
    };
  }

  async findBlogById(blogId: string): Promise<BlogOutputModel> {
    return await this.blogRepository.findOne({
      where: {
        id: blogId,
      },
    });
  }

  async blogIsExist(blogId: string): Promise<boolean> {
    const blog = await this.blogRepository.findOne({
      where: {
        id: blogId,
      },
    });

    return !!blog;
  }
}
