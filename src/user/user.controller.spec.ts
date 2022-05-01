import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RestoreUserDto } from './dto/restore-user.dto';
import { NotFoundException } from '@nestjs/common';
import { PaginateQueryUserDto } from './dto/paginate-query-user.dto';
import { PaginateResultUser } from './paginate/paginate-result-user.';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    register: jest.fn().mockImplementation((dto: CreateUserDto) => {
      const user: User = new User();
      user.email = dto.email;
      user.id = Date.now();
      return Promise.resolve(user);
    }),
    restore: jest.fn().mockImplementation((dto: RestoreUserDto) => {
      if (dto.username === '0') {
        return Promise.resolve(false);
      }

      return Promise.resolve(true);
    }),
    paginate: jest.fn().mockImplementation((dto: PaginateQueryUserDto) =>
      Promise.resolve({
        meta: { ...dto },
        items: [{ id: 1 } as User],
      } as PaginateResultUser),
    ),
    findOne: jest.fn().mockImplementation((id: number) => {
      if (id === 0) {
        return Promise.resolve(null);
      }

      return Promise.resolve({
        id: id,
        email: Date.now().toString(),
      } as User);
    }),
    update: jest.fn().mockImplementation((id: number, dto: UpdateUserDto) => {
      if (id === 0) {
        return Promise.resolve(0);
      }
      return Promise.resolve(1);
    }),
    updatePassword: jest
      .fn()
      .mockImplementation((id: number, dto: UpdatePasswordUserDto) => {
        if (id === 0) {
          return Promise.resolve(0);
        }
        return Promise.resolve(1);
      }),
    remove: jest.fn((id: number) => {
      if (id === 0) {
        return Promise.resolve(0);
      }

      return Promise.resolve(1);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('should be register', () => {
    it('should be positive', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.ru',
        password: '1111111',
      } as CreateUserDto;

      expect(await controller.register(dto)).toEqual({
        id: expect.any(Number),
        email: dto.email,
      } as User);

      expect(mockUserService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('should be restore ', () => {
    const dto: RestoreUserDto = { username: 'test@test.ru' } as RestoreUserDto;
    it('should be positive', async () => {
      expect(await controller.restore(dto)).not.toBeDefined();
      expect(mockUserService.restore).toHaveBeenCalledWith(dto);
    });

    it('should be negative', async () => {
      dto.username = '0';
      await expect(controller.restore(dto)).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockUserService.restore).toHaveBeenCalledWith(dto);
    });
  });

  describe('should be method pagination', () => {
    it('should be positive status Ok', async () => {
      const dto: PaginateQueryUserDto = new PaginateQueryUserDto();
      expect(await controller.paginate(dto)).toEqual({
        meta: { ...dto },
        items: [{ id: 1 } as User],
      } as PaginateResultUser);

      expect(mockUserService.paginate).toHaveBeenCalledWith(dto);
    });
  });

  describe('should be method findOne', () => {
    it('should positive status Ok', async () => {
      const id = '1';

      expect(await controller.findOne(id)).toEqual({
        id: 1,
        email: expect.any(String),
      } as User);
      expect(mockUserService.findOne).toHaveBeenCalledWith(+id);
    });

    it('should negative status NotFound', async () => {
      const id = '0';
      await expect(controller.findOne(id)).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockUserService.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('should be method update', () => {
    it('should be positive status OK', async () => {
      const dto: UpdateUserDto = new UpdateUserDto();
      dto.email = 'test@test.ru';
      const id = '1';

      expect(await controller.update(id, dto)).toEqual(undefined);
      expect(mockUserService.update).toHaveBeenCalledWith(+id, dto);
    });

    it('should negative status NotFount', async () => {
      const id = '0';
      const dto: UpdateUserDto = new UpdateUserDto();
      await expect(controller.update(id, dto)).rejects.toThrowError(
        NotFoundException,
      );

      expect(mockUserService.update).toHaveBeenCalledWith(+id, dto);
    });
  });

  describe('should be method updatePassword', () => {
    const dto: UpdatePasswordUserDto = {
      password: '111111',
    } as UpdatePasswordUserDto;

    it('should positive status Ok', async () => {
      const id = '1';
      expect(await controller.updatePassword(id, dto)).not.toBeDefined();
      expect(mockUserService.updatePassword).toHaveBeenCalledWith(+id, dto);
    });

    it('should negative status NotFound', async () => {
      const id = '0';
      await expect(controller.updatePassword(id, dto)).rejects.toThrowError(
          NotFoundException,
      );
      expect(mockUserService.updatePassword).toHaveBeenCalledWith(+id, dto);
    });
  });

  describe('should be method remove', () => {
    it('should positive status NoContent', async () => {
      const id = '1';
      expect(await controller.remove(id)).toEqual(undefined);

      expect(mockUserService.remove).toHaveBeenCalledWith(+id);
    });

    it('should positive status NOtFount', async () => {
      const id = '0';
      await expect(controller.remove(id)).rejects.toThrowError(
        NotFoundException,
      );

      expect(mockUserService.remove).toHaveBeenCalledWith(+id);
    });
  });
});
