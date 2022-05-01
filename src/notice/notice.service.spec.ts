import { Test, TestingModule } from '@nestjs/testing';
import { NoticeService } from './notice.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('NoticeService', () => {
  let service: NoticeService;

  const mockNoticeRepository = {};

  const mockMailerService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        ConfigService,
        MailerService,
        NoticeService,
        {
          provide: getRepositoryToken(Notice),
          useValue: mockNoticeRepository,
        },
      ],
    })
      .overrideProvider(MailerService)
      .useValue(mockMailerService)
      .compile();

    service = module.get<NoticeService>(NoticeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
