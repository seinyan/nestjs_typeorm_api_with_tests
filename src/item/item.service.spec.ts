import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { PaginateQueryItemDto } from './dto/paginate-query-item.dto';
import { PaginateResultItem } from './paginate/paginate-result-item.';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

describe('ItemService', () => {
  let service: ItemService;

  const mockItemRepository = {
    createQueryBuilder: jest.fn(() => ({
      delete: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnThis(),
    })),
    paginate: jest.fn().mockImplementation(),
    findOne: jest.fn().mockImplementation((id: number) => {
      if (id === 0) {
        return Promise.resolve(undefined);
      }

      return Promise.resolve({
        id: id,
        title: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Item);
    }),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((item) => {
      return Promise.resolve({
        id: Date.now(),
        createdAt: new Date(),
        ...item,
      } as Item);
    }),
    update: jest.fn().mockImplementation((id: number, dto: UpdateItemDto) => {
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
        ItemService,
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemRepository,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should be pagination', () => {
    it('should be paginate positive', async () => {
      const dto: PaginateQueryItemDto = new PaginateQueryItemDto();
      expect(await service.paginate(dto)).toEqual(new PaginateResultItem());
      expect(mockItemRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('should be findOne ', () => {
    let id = null;
    it('should be positive', async () => {
      id = 1;
      expect(await service.findOne(id)).toEqual({
        id: id,
        title: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      } as Item);
      expect(mockItemRepository.findOne).toHaveBeenCalledWith(id);
    });

    it('should be negative', async () => {
      id = 0;
      expect(await service.findOne(id)).toBeUndefined();
      expect(mockItemRepository.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('should be create ', () => {
    const dto: CreateItemDto = { title: Date.now().toString() };

    it('should positive ', async () => {
      expect(await service.create(dto)).toEqual({
        id: expect.any(Number),
        createdAt: expect.any(Date),
        title: expect.any(String),
      } as Item);
    });
  });

  describe('should be update', () => {
    const dto: UpdateItemDto = { title: 'Title update' };
    let id = null;
    it('should be positive', async () => {
      id = 1;
      // const spyFindOne = jest.spyOn(service, 'findOne');
      // expect(spyFindOne).toHaveBeenCalledWith(id);
      expect(await service.update(id, dto)).toEqual(1);
      expect(mockItemRepository.update).toHaveBeenCalledWith(id, dto);
    });

    it('should be negative', async () => {
      id = 0;
      expect(await service.update(id, dto)).toEqual(0);
      expect(mockItemRepository.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('should be remove ', () => {
    let id = null;
    it('should be positive ', async () => {
      id = 1;
      expect(await service.remove(id)).toEqual(1);
      expect(mockItemRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should negative ', async () => {
      id = 0;
      expect(await service.remove(id)).toEqual(0);
      expect(mockItemRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
