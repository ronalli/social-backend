import { Test, TestingModule } from '@nestjs/testing';
import { UsersQueryRepository } from '../../src/features/users/infrastructure/users.query-repository';
import { DataSource } from 'typeorm';
import { UserQueryDto } from '../../src/features/users/api/models/user-query.dto';

describe('UsersQueryRepository', () => {
  let usersQueryRepository: UsersQueryRepository;
  let dataSourceMock: Partial<DataSource>;

  beforeEach(async () => {
    dataSourceMock = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersQueryRepository,
        { provide: DataSource, useValue: dataSourceMock },
      ],
    }).compile();

    usersQueryRepository =
      module.get<UsersQueryRepository>(UsersQueryRepository);
  });

  it('should be return users by pagination', async () => {
    const queryParams: UserQueryDto = {
      sortDirection: 'asc',
      sortBy: 'createdAt',
      pageSize: 10,
      pageNumber: 1,
      searchLoginTerm: 'test',
      searchEmailTerm: null,
    };

    const mockUsers = [
      { id: '1', login: 'test1', email: 'test1@gmail.com' },
      {
        id: '2',
        login: 'test2',
        email: 'test2@gmail.com',
      },
    ];

    (dataSourceMock.query as jest.Mock)
      .mockResolvedValueOnce(mockUsers)
      .mockResolvedValueOnce(mockUsers);

    const result = await usersQueryRepository.getAllUsers(queryParams);

    expect(result).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: mockUsers,
    });
  });
});
