import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { PaginateResultItem } from './paginate/paginate-result-item.';
import { PaginateQueryItemDto } from './dto/paginate-query-item.dto';
import { Paginate } from '../paginate';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}

  async paginate(dto: PaginateQueryItemDto): Promise<PaginateResultItem> {
    return await Paginate(this.itemRepository.createQueryBuilder('c'), dto);
  }

  async findOne(id: number): Promise<Item> {
    const item: Item = await this.itemRepository.findOne(id);

    return item;
  }

  async create(dto: CreateItemDto): Promise<Item> {
    const item: Item = this.itemRepository.create(dto);
    return await this.itemRepository.save(item);
  }

  async update(id: number, dto: UpdateItemDto) {
    const { affected } = await this.itemRepository.update(id, dto);
    return affected;
  }

  async remove(id: number): Promise<number> {
    const { affected } = await this.itemRepository.delete(id);

    return affected;
  }
}
