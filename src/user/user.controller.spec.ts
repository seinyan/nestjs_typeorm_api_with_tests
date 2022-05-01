import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NoticeService } from '../notice/notice.service';

describe('UserController', () => {
  let controller: UserController;

  const mockNoticeService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        NoticeService,
        {
          provide: getRepositoryToken(User),
          useValue: User,
        },
      ],
    })
      .overrideProvider(NoticeService)
      .useValue(mockNoticeService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
