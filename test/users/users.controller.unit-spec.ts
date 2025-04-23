import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/features/users/api/users.controller';
import { UsersQueryRepository } from '../../src/features/users/infrastructure/users.query-repository';
import { UsersService } from '../../src/features/users/application/users.service';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../src/common/guards/auth.basic.guard';
import { UserQueryDto } from '../../src/features/users/api/models/user-query.dto';

const commandBusMock = {
  execute: jest.fn().mockResolvedValue('1'),
};

const mockUsers = [
  {
    id: '1',
    login: 'admin',
    email: 'admin@email.com',
    createdAt: '2025-03-03T21:11:57.938Z',
  },
  {
    id: '2',
    login: 'bob',
    email: 'bob@email.com',
    createdAt: '2025-03-05T21:12:57.918Z',
  },
  {
    id: '3',
    login: 'alika',
    email: 'alika@email.com',
    createdAt: '2025-03-07T21:13:57.912Z',
  },
];

describe('UsersQueryRepository', () => {
  let controller: UsersController;
  let usersQueryRepository: UsersQueryRepository;
  let usersService: UsersService;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findUser: jest.fn().mockResolvedValue({
              id: '1',
              login: 'admin',
              email: 'admin@email.com',
              createdAt: '2025-03-03T21:11:57.938Z',
            }),
            deleteUser: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: UsersQueryRepository,
          useValue: {
            getAllUsers: jest.fn().mockResolvedValue(mockUsers),
          },
        },
        {
          provide: CommandBus,
          useValue: commandBusMock,
        },
        {
          provide: BasicAuthGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersQueryRepository =
      module.get<UsersQueryRepository>(UsersQueryRepository);
    usersService = module.get<UsersService>(UsersService);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('Get all users', async () => {
    const query: UserQueryDto = {
      searchLoginTerm: 'admin',
      searchEmailTerm: 'mail.com',
    };

    const users = await controller.getAllUsers(query, {} as any, {} as any);

    expect(users).toEqual(mockUsers);
    expect(usersQueryRepository.getAllUsers).toHaveBeenCalledWith(query);
  });

  it(`should be create user`, async () => {
    const createModel = {
      login: 'test',
      password: 'qwerty',
      email: 'test@gmail.com',
      createdAt: '2025-03-07T21:13:57.912Z',
    };

    jest
      .spyOn(usersService, 'findUser')
      .mockResolvedValue({ id: '1', ...createModel });

    const user = await controller.createUser(createModel);

    expect(user).toEqual({ id: '1', ...createModel });
    expect(commandBus.execute).toHaveBeenCalledWith(expect.any(Object));
    expect(usersService.findUser).toHaveBeenCalledWith('1');
  });

  it(`should be deleted user`, async () => {
    const result = await controller.deleteUser('1');

    expect(result).toBeUndefined();
    expect(usersService.deleteUser).toHaveBeenCalledWith('1');
  });
});
