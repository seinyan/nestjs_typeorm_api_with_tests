import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { LoginResultDto } from './result/login-result.dto';
import { AccessTokenResultDto } from './result/access-token-result.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn().mockImplementation((user: User) => {
      return Promise.resolve({
        accessToken: Date.now().toString(),
        refreshToken: Date.now().toString(),
      } as LoginResultDto);
    }),
    accessToken: jest.fn().mockImplementation((user: User) => {
      return Promise.resolve({
        accessToken: Date.now().toString(),
      } as AccessTokenResultDto);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('should be login ', () => {
    it('should be positive', async () => {
      const user: User = new User();
      expect(await controller.login({ user })).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      } as LoginResultDto);
    });
  });

  describe('should be login ', () => {
    it('should be positive', async () => {
      const user: User = new User();
      expect(await controller.accessToken({ user })).toEqual({
        accessToken: expect.any(String),
      } as AccessTokenResultDto);
    });
  });
});
