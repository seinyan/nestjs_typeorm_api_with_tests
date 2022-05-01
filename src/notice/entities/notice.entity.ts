import { AppBaseEntity } from '../../app-base.entity';
import { INotice } from '../interface/notice.interface';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { NoticeStatusEnum } from '../enums/notice-status.enum';

@Entity({ name: 'notices' })
export class Notice extends AppBaseEntity implements INotice {
  constructor() {
    super();
    this.status = NoticeStatusEnum.New;
  }

  @ApiProperty()
  @Column({ type: 'varchar', name: 'send_from', nullable: true })
  sendFrom: string; // email | phone ...

  @ApiProperty()
  @Column({ type: 'varchar', name: 'send_to', nullable: true })
  sendTo: string; // email | phone ...

  @ApiProperty()
  @Column({ type: 'bigint', name: 'other_id', nullable: true })
  otherId: number;

  @ApiProperty()
  @Column({ type: 'integer', name: 'status', default: NoticeStatusEnum.New })
  status: number;

  @ApiProperty()
  @Column({ type: 'integer', name: 'send_type', nullable: true })
  sendType: number;

  @ApiProperty()
  @Column({ type: 'varchar', name: 'subject', nullable: true })
  subject: string;

  @ApiProperty()
  @Column({ type: 'varchar', name: 'template', nullable: true })
  template: string;

  @ApiProperty()
  @Column({ type: 'text', name: 'data_json', nullable: true })
  dataJson: string;

  @ApiProperty()
  @Column({ type: 'text', name: 'error', nullable: true })
  error: string;
}
