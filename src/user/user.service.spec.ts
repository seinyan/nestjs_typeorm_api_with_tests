import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NoticeService } from '../notice/notice.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RestoreUserDto } from './dto/restore-user.dto';
import { PaginateQueryUserDto } from './dto/paginate-query-user.dto';
import { PaginateResultUser } from './paginate/paginate-result-user.';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockNoticeService = {
    addEmailNotice: jest.fn(
      (email: string, subject: string, template: string, data?: any) => {
        return Promise.resolve(true);
      },
    ),
  };

  const mockUserRepository = {
    createQueryBuilder: jest.fn(() => ({
      delete: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnThis(),
    })),
    paginate: jest.fn().mockImplementation(),
    findOne: jest.fn().mockImplementation((params: any) => {
      const user: User = new User();
      user.id = 1;

      if (typeof params === 'object') {
        if (params.where.email === '0') {
          return Promise.resolve(undefined);
        }

        user.email = 'test@test.ru';
        return Promise.resolve(user);
      }

      if (params === 0) {
        return Promise.resolve(undefined);
      }

      user.email = 'test@test.ru';
      return Promise.resolve(user);
    }),
    create: jest.fn().mockImplementation((dto: CreateUserDto) => {
      const user: User = new User();
      user.email = dto.email;
      user.password = dto.password;

      return user;
    }),
    save: jest.fn().mockImplementation((item: User) => {
      item.id = Date.now();
      return Promise.resolve({
        ...item,
      } as User);
    }),
    update: jest.fn().mockImplementation((id: number, dto: UpdateUserDto) => {
      if (id === 0) {
        return Promise.resolve({ affected: 0 });
      }

      return Promise.resolve({ affected: 1 });
    }),
    delete: jest.fn().mockImplementation((id: number) => {
      if (id === 0) {
        return Promise.resolve({ affected: 0 });
      }

      return Promise.resolve({ affected: 1 });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticeService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    })
      .overrideProvider(NoticeService)
      .useValue(mockNoticeService)
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should be checkUsername', () => {
    it('should be (exist user) not user ID ', async () => {
      const username = 'test@test.ru';
      expect(await service.checkUsername(username)).toEqual(true);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: username },
      });
    });

    it('should be (not exist user) not user ID ', async () => {
      const username = '0';
      expect(await service.checkUsername(username)).toEqual(false);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: username },
      });
    });

    it('should (exist user this user return false) in user ID ', async () => {
      const username = 'test@test.ru';
      const id = 1;
      expect(await service.checkUsername(username, id)).toEqual(false);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: username },
      });
    });

    it('should be (not exist user) in user ID ', async () => {
      const username = '0';
      const id = 1;
      expect(await service.checkUsername(username, id)).toEqual(false);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: username },
      });
    });
  });

  describe('should be findByUsername ', () => {
    it('should be run ', async () => {
      const username = 'test@test.ru';
      expect(await service.findByUsername(username));
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: username },
      });
    });
  });

  describe('should be register', () => {
    it('should be positive', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.ru',
        password: '111111',
      } as CreateUserDto;

      expect(await service.register(dto)).toEqual({
        id: expect.any(Number),
        email: dto.email,
        password: expect.any(String),
      } as User);

      expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockNoticeService.addEmailNotice).toHaveBeenCalledWith(
        dto.email,
        expect.any(String),
        expect.any(String),
        {
          id: expect.any(Number),
          username: dto.email,
          password: dto.password,
          msg: expect.any(String),
        },
      );
    });
  });

  describe('should be restore ', () => {
    it('should be positive ', async () => {
      const dto: RestoreUserDto = { username: 'test@test.ru' };
      expect(await service.restore(dto)).toEqual(true);

      expect(mockUserRepository.update).toHaveBeenCalledWith(1, {
        password: expect.any(String),
      });

      expect(mockNoticeService.addEmailNotice).toHaveBeenCalledWith(
        dto.username,
        expect.any(String),
        expect.any(String),
        {
          id: expect.any(Number),
          username: dto.username,
          password: expect.any(String),
          msg: expect.any(String),
        },
      );
    });

    it('should be negative ', async () => {
      const dto: RestoreUserDto = { username: '0' };
      expect(await service.restore(dto)).toEqual(false);
    });
  });

  describe('should be pagination', () => {
    it('should be paginate positive', async () => {
      const dto: PaginateQueryUserDto = new PaginateQueryUserDto();
      expect(await service.paginate(dto)).toEqual(new PaginateResultUser());
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('should be findOne ', () => {
    let id = null;
    it('should be positive', async () => {
      id = 1;
      expect(await service.findOne(id)).toEqual({
        id: id,
        email: expect.any(String),
      } as User);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(id);
    });

    it('should be negative', async () => {
      id = 0;
      expect(await service.findOne(id)).toBeUndefined();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('should be updatePassword', () => {
    const dto: UpdatePasswordUserDto = {
      password: '111111',
    } as UpdatePasswordUserDto;

    it('should be positive', async () => {
      expect(await service.updatePassword(1, dto)).toEqual(1);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('should be negative', async () => {
      expect(await service.updatePassword(0, dto)).toEqual(0);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('should be update', () => {
    const dto: UpdateUserDto = {
      id: 1,
      email: '111111',
    } as UpdateUserDto;

    it('should be positive', async () => {
      expect(await service.update(1, dto)).toEqual(1);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('should be negative', async () => {
      dto.id = 0;
      expect(await service.update(0, dto)).toEqual(0);
      expect(mockUserRepository.update).toHaveBeenCalledWith(0, dto);
    });
  });

  describe('should be remove', () => {
    it('should be positive', async () => {
      expect(await service.remove(1)).toEqual(1);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should be negative', async () => {
      expect(await service.remove(0)).toEqual(0);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(0);
    });
  });
});
