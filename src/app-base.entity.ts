import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transform, Type } from 'class-transformer';

export class AppBaseEntity {
  @Type(() => Number)
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty()
  // @Type(() => Date)
  // @Transform(({ value }) => moment(value).format('DD-MM-YYYY HH:mm'))
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @ApiProperty()
  // @Type(() => Date)
  // @Transform(({ value }) => moment(value).format('DD-MM-YYYY HH:mm'))
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  // // @ApiProperty()
  // // // @Type(() => Date)
  // // @Transform(({ value }) => moment(value).format('DD-MM-YYYY HH:mm'))
  // @Exclude()
  // @DeleteDateColumn({ name: 'deletedAt' })
  // deletedAt: Date;

  // public delete() {
  //   // this.deletedAt = new Date();
  // }
}
