import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paginate } from '../paginate';
import { Notice } from './entities/notice.entity';
import { PaginateResultNotice } from './paginate/paginate-result-notice.';
import { PaginateQueryNoticeDto } from './dto/paginate-query-notice.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import {NoticeSendTypeEnum} from "./enums/notice-send-type.enum";

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async paginate(dto: PaginateQueryNoticeDto): Promise<PaginateResultNotice> {
    // await this.sendEmailTesting();
    return await Paginate(this.noticeRepository.createQueryBuilder('c'), dto);
  }

  async addEmailNotice(
    email: string,
    subject: string,
    template: string,
    data?: any,
  ): Promise<boolean> {
    const notice: Notice = new Notice();
    notice.sendType = NoticeSendTypeEnum.Email;
    notice.sendFrom = this.configService.get('EMAIL_NORELY');
    notice.sendTo = email;
    notice.subject = subject;
    notice.template = template;
    notice.dataJson = JSON.stringify(data);

    await this.noticeRepository.save(notice);

    return true;
  }

  async sendEmailTesting() {
    const notice: Notice = new Notice();
    notice.sendTo = this.configService.get('EMAIL_NORELY');
    notice.sendTo = 'Testing send E-mail';
    notice.template = 'email_testing.hbs';
    notice.dataJson = JSON.stringify({ msg: 'Testing msg' });

    return await this.sendEmail(notice);
  }

  private async sendEmail(notice: Notice) {
    let data = {};
    if (notice.dataJson) {
      data = JSON.parse(notice.dataJson);
    }

    console.log('=== sendEmail');
    console.log({ notice });
    console.log({ data });

    // this.mailerService
    //   .sendMail({
    //     to: notice.sendTo,
    //     from: this.configService.get('EMAIL_NORELY'),
    //     subject: notice.subject,
    //     template: process.cwd() + '/templates/emails/' + notice.template,
    //     context: data,
    //   })
    //   .then((success) => {
    //     console.log('success');
    //     // notice.status = 'ok';
    //     // this.noticeRepository.save(notice);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     // notice.status = 'err';
    //     // notice.status = 'ok';
    //     // this.noticeRepository.save(notice);
    //   });
  }
}
