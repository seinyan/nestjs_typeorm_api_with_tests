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
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    private readonly configService: ConfigService,
    @InjectQueue('notice') private noticeQueue: Queue,
  ) {}

  async testing() {
    await this.sendEmail(
      this.configService.get('EMAIL_NORELY'),
      // 'dsa dsa dsa',
      'Testing send E-mail',
      'email_testing.hbs',
      { msg: 'Testing msg' },
    );

    return await this.noticeQueue.getJobCounts();
  }

  async paginate(dto: PaginateQueryNoticeDto): Promise<PaginateResultNotice> {
    return await Paginate(this.noticeRepository.createQueryBuilder('c'), dto);
  }

  async sendEmail(
    email: string,
    subject: string,
    template: string,
    data?: any,
  ): Promise<string> {
    const notice: Notice = new Notice();
    notice.type = NoticeType.Email;
    notice.sendFrom = this.configService.get('EMAIL_NORELY');
    notice.sendTo = email;
    notice.template = template;
    notice.subject = subject;
    notice.data = data;
    notice.dataJson = JSON.stringify(notice.data);

    const { id } = await this.noticeQueue.add(
      NoticeType[NoticeType.Email],
      notice,
    );

    return id.toString();
  }
}
