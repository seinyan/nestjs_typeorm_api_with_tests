import { AppBaseEntity } from '../../app-base.entity';
import { INotice } from '../interface/notice.interface';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { NoticeStatus } from '../enums/notice-status.enum';
import { Exclude } from 'class-transformer';

@Entity({ name: 'notices' })
export class Notice extends AppBaseEntity implements INotice {
  constructor() {
    super();
    this.status = NoticeStatus.New;
    this.attempt = 0;
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
  @Column({ type: 'varchar', name: 'message_id', nullable: true })
  messageId: string;

  @ApiProperty()
  @Column({ type: 'integer', name: 'attempts', default: 0 })
  attempt: number;

  @ApiProperty()
  @Column({ type: 'integer', name: 'status', default: NoticeStatus.New })
  status: number;

  @ApiProperty()
  @Column({ type: 'integer', name: 'type', nullable: true })
  type: number;

  @ApiProperty()
  @Column({ type: 'varchar', name: 'subject', nullable: true })
  subject: string;

  @ApiProperty()
  @Column({ type: 'varchar', name: 'template', nullable: true })
  template: string;

  @ApiProperty()
  @Column({ type: 'text', name: 'data_json', nullable: true })
  dataJson: string;

  @Exclude()
  data: object;

  @ApiProperty()
  @Column({ type: 'text', name: 'error', nullable: true })
  error: string;
}
