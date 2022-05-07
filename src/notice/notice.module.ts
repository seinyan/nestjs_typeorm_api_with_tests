import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumers/email-consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notice]),
    ConfigModule,
    BullModule.registerQueue({
      name: 'notice',
      defaultJobOptions: {
        removeOnFail: true,
        removeOnComplete: true,
        attempts: 2,
        backoff: 3000,
      },
    }),
  ],
  controllers: [NoticeController],
  providers: [NoticeService, EmailConsumer],
  exports: [NoticeService],
})
export class NoticeModule {}
