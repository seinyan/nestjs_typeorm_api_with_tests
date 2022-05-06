import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paginate } from '../paginate';
import { Notice } from './entities/notice.entity';
import { PaginateResultNotice } from './paginate/paginate-result-notice.';
import { PaginateQueryNoticeDto } from './dto/paginate-query-notice.dto';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NoticeType } from './enums/notice-type.enum';

@Injectable()
export class NoticeService {
  constructor(
    @InjectQueue('notice') private noticeQueue: Queue,
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    private readonly configService: ConfigService,
  ) {}

  async paginate(dto: PaginateQueryNoticeDto): Promise<PaginateResultNotice> {
    return await Paginate(this.noticeRepository.createQueryBuilder('c'), dto);
  }

  async test() {
    await this.sendEmail(
      this.configService.get('EMAIL_NORELY'),
      // 'dsa dsa dsa',
      'Testing send E-mail',
      'email_testing.hbs',
      { msg: 'Testing msg' },
    );

    return await this.noticeQueue.getJobCounts();
  }

  async sendEmail(
    email: string,
    subject: string,
    template: string,
    data?: any,
  ): Promise<number | string> {
    const notice: Notice = new Notice();
    notice.sendFrom = this.configService.get('EMAIL_NORELY');
    notice.sendTo = email;
    notice.template = template;
    notice.subject = subject;
    notice.data = data;
    notice.dataJson = JSON.stringify(notice.data);

    const { id } = await this.noticeQueue.add(NoticeType.Email, notice);

    return id;
  }
}
