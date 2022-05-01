import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { NotFoundException } from '@nestjs/common';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginateQueryItemDto } from './dto/paginate-query-item.dto';
import { PaginateResultItem } from './paginate/paginate-result-item.';

describe('ItemController Uint functional testing', () => {
  let controller: ItemController;
  const mockItemService = {
    paginate: jest.fn().mockImplementation((dto: PaginateQueryItemDto) =>
      Promise.resolve({
        meta: { ...dto },
        items: [{ id: 1 } as Item],
      } as PaginateResultItem),
    ),
    findOne: jest.fn().mockImplementation((id: number) => {
      if (id === 0) {
        return Promise.resolve(null);
      }

      return Promise.resolve({
        id: id,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: Date.now().toString(),
      } as Item);
    }),
    create: jest.fn().mockImplementation((dto: CreateItemDto) => {
      const item: Item = new Item();
      item.id = Date.now();
      item.createdAt = new Date();

      return Promise.resolve({
        ...item,
        ...dto,
      });
    }),
    update: jest.fn().mockImplementation((id: number, dto: UpdateItemDto) => {
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
      controllers: [ItemController],
      providers: [ItemService],
    })
      .overrideProvider(ItemService)
      .useValue(mockItemService)
      .compile();

    controller = module.get<ItemController>(ItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('should be method pagination', () => {
    it('should be positive status Ok', async () => {
      const dto: PaginateQueryItemDto = new PaginateQueryItemDto();
      expect(await controller.paginate(dto)).toEqual({
        meta: { ...dto },
        items: [{ id: 1 } as Item],
      } as PaginateResultItem);

      expect(mockItemService.paginate).toHaveBeenCalledWith(dto);
    });
  });

  describe('should be method findOne', () => {
    it('should positive status Ok', async () => {
      const id = '1';

      expect(await controller.findOne(id)).toEqual({
        id: 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: expect.any(String),
      } as Item);
      expect(mockItemService.findOne).toHaveBeenCalledWith(+id);
    });

    it('should negative status NotFound', async () => {
      const id = '0';
      await expect(controller.findOne(id)).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockItemService.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('should be method create', () => {
    it('should positive status Created', async () => {
      const dto: CreateItemDto = new CreateItemDto();
      dto.title = 'Title create';

      expect(await controller.create(dto)).toEqual({
        id: expect.any(Number),
        createdAt: expect.any(Date),
        ...dto,
      } as Item);

      expect(mockItemService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('should be method update', () => {
    it('should be positive status OK', async () => {
      const dto: UpdateItemDto = new UpdateItemDto();
      dto.title = 'Title update';
      const id = '1';

      expect(await controller.update(id, dto)).toEqual(undefined);
      expect(mockItemService.update).toHaveBeenCalledWith(+id, dto);
    });

    it('should negative status NotFount', async () => {
      const id = '0';
      const dto: UpdateItemDto = new UpdateItemDto();
      await expect(controller.update(id, dto)).rejects.toThrowError(
        NotFoundException,
      );

      expect(mockItemService.update).toHaveBeenCalledWith(+id, dto);
    });
  });

  describe('should be method remove', () => {
    it('should positive status NoContent', async () => {
      const id = '1';
      expect(await controller.remove(id)).toEqual(undefined);

      expect(mockItemService.remove).toHaveBeenCalledWith(+id);
    });

    it('should positive status NOtFount', async () => {
      const id = '0';
      await expect(controller.remove(id)).rejects.toThrowError(
        NotFoundException,
      );

      expect(mockItemService.remove).toHaveBeenCalledWith(+id);
    });
  });
});
