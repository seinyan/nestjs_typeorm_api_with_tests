import { Test, TestingModule } from '@nestjs/testing';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { PaginateQueryNoticeDto } from './dto/paginate-query-notice.dto';
import { PaginateResultNotice } from './paginate/paginate-result-notice.';
import { Notice } from './entities/notice.entity';

describe('NoticeController', () => {
  let controller: NoticeController;

  const mockNoticeService = {
    paginate: jest.fn().mockImplementation((dto: PaginateQueryNoticeDto) =>
      Promise.resolve({
        meta: { ...dto },
        items: [{ id: 1 } as Notice],
      } as PaginateResultNotice),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticeController],
      providers: [NoticeService],
    })
      .overrideProvider(NoticeService)
      .useValue(mockNoticeService)
      .compile();

    controller = module.get<NoticeController>(NoticeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('should be paginate ', () => {
    it('should be positive', async () => {
      const dto: PaginateQueryNoticeDto = new PaginateQueryNoticeDto();
      expect(await controller.paginate(dto)).toEqual({
        meta: { ...dto },
        items: [{ id: 1 } as Notice],
      } as PaginateResultNotice);

      expect(mockNoticeService.paginate).toHaveBeenCalledWith(dto);
    });
  });
});
