import { Test, TestingModule } from '@nestjs/testing';
import { NoticeService } from './notice.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { ConfigService } from '@nestjs/config';
import { getQueueToken } from '@nestjs/bull';
import { PaginateQueryNoticeDto } from './dto/paginate-query-notice.dto';
import { PaginateResultNotice } from './paginate/paginate-result-notice.';

describe('NoticeService', () => {
  let service: NoticeService;

  const mockNoticeRepository = {
    createQueryBuilder: jest.fn(() => ({
      delete: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnThis(),
    })),
  };

  const mockNoticeQueue = {
    add: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: Date.now(),
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: getRepositoryToken(Notice),
          useValue: mockNoticeRepository,
        },
        {
          provide: getQueueToken('notice'),
          useValue: mockNoticeQueue,
        },
        NoticeService,
        ConfigService,
      ],
    })
      .overrideProvider(getQueueToken('notice'))
      .useValue(mockNoticeQueue)
      .compile();

    service = module.get<NoticeService>(NoticeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should be paginate', () => {
    it('should be positive', async () => {
      const dto: PaginateQueryNoticeDto = new PaginateQueryNoticeDto();
      expect(await service.paginate(dto)).toEqual(new PaginateResultNotice());
      expect(mockNoticeRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('should be sendEmail ', () => {
    it('should be positive', async () => {
      expect(
        await service.sendEmail('test@test.ru', 'Testing email..', 'test', {
          msg: 'Test msg',
        }),
      ).toEqual(expect.any(String));
      expect(mockNoticeQueue.add).toHaveBeenCalled();
    });
  });
});
