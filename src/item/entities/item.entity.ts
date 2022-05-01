import { AppBaseEntity } from '../../app-base.entity';
import { Column, Entity } from 'typeorm';
import { IItem } from '../interface/item.interface';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'items' })
export class Item extends AppBaseEntity implements IItem {
  @ApiProperty()
  @Column({ type: 'varchar', name: 'title', nullable: true })
  title: string;
}
