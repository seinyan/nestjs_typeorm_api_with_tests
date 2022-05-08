import {
  Processor,
  Process,
  OnQueueFailed,
  OnQueueCompleted,
} from '@nestjs/bull';
import { NoticeType } from '../enums/notice-type.enum';
import { DoneCallback, Job } from 'bull';
import { Notice } from '../entities/notice.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoticeStatus } from '../enums/notice-status.enum';
import { join } from 'path';

@Processor('notice')
export class EmailConsumer {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  @Process({ name: NoticeType[NoticeType.Email] })
  async sendProcess(job: Job<Notice>, done: DoneCallback) {
    job.data.status = NoticeStatus.Process;
    job.data.attempt++;

    try {
      const { messageId } = await this.mailerService.sendMail({
        to: job.data.sendTo,
        from: job.data.sendFrom,
        subject: job.data.subject,
        template: './templates/emails/' + job.data.template,
        context: job.data.data,
      });

      job.data.messageId = messageId;
      await job.update(job.data);
      done(null, job.data);
    } catch (e) {
      job.data.error = e.toString();
      await job.update(job.data);
      done(new Error(e.toString()), job.data);
    }
  }

  @OnQueueFailed()
  async onError(job: Job<Notice>, err: Error) {
    if (job.opts.attempts === job.attemptsMade) {
      await this.createNotice(job.data);
    }
  }

  @OnQueueCompleted()
  async onComplete(job: Job<Notice>) {
    await this.createNotice(job.data);
  }

  async createNotice(notice: Notice): Promise<Notice> {
    return await this.noticeRepository.save(notice);
  }
}
