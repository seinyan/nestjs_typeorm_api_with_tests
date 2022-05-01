import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { NoticeService } from '../notice/notice.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { User } from '../user/entities/user.entity';
import { LoginResultDto } from './result/login-result.dto';
import { AccessTokenResultDto } from './result/access-token-result.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockNoticeService = {
    addEmailNotice: jest.fn(
      (email: string, subject: string, template: string, data?: any) => {
        return Promise.resolve(true);
      },
    ),
  };

  const mockUserService = {
    findByUsername: jest.fn().mockImplementation(async (username) => {
      const user: User = new User();
      user.id = Date.now();
      user.password = '111111';
      await user.generatePasswordHash();
      user.email = 'test@test.ru';

      return Promise.resolve(user);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get<string>('JWT_EXPIRES'),
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        NoticeService,
        UserService,
      ],
    })
      .overrideProvider(NoticeService)
      .useValue(mockNoticeService)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should be login ', () => {
    it('should be positive ', async () => {
      const spyGenerateJWTToken = jest.spyOn(service, 'generateJWTToken');
      const spyGenerateRefreshToken = jest.spyOn(
        service,
        'generateRefreshToken',
      );

      const user: User = { id: 1, email: 'test@test.ru' } as User;

      expect(await service.login(user)).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      } as LoginResultDto);

      expect(mockNoticeService.addEmailNotice).toHaveBeenCalledWith(
        user.email,
        expect.any(String),
        expect.any(String),
        expect.any(Object),
      );

      expect(spyGenerateJWTToken).toHaveBeenCalledWith(user);
      expect(spyGenerateRefreshToken).toHaveBeenCalledWith(user);
    });
  });

  describe('should be accessToken ', () => {
    // const spyGenerateJWTToken = jest.spyOn(service, 'generateJWTToken');

    const user: User = { id: 1, email: 'test@test.ru' } as User;

    it('should be positive', async () => {
      expect(await service.accessToken(user)).toEqual({
        accessToken: expect.any(String),
      } as AccessTokenResultDto);
    });

    // expect(jest.spyOn(service, 'generateJWTToken')).toHaveBeenCalledWith(user);
  });

  describe('should be validateUser', () => {
    const email = 'test@test.ru';
    let password = '111111';

    it('should be positive', async () => {
      expect(await service.validateUser(email, '111111')).toEqual({
        id: expect.any(Number),
        email: email,
      });

      expect(mockUserService.findByUsername).toHaveBeenCalledWith(email);
    });

    password = '1234457';
    it('should be negative', async () => {
      expect(await service.validateUser(email, password)).toEqual(null);

      expect(mockUserService.findByUsername).toHaveBeenCalledWith(email);
    });
  });

  describe('should be generateJWTToken ', () => {
    const user: User = new User();
    user.email = 'test@test.ru';

    it('should positive ', async () => {
      expect(await service.generateJWTToken(user)).toEqual(expect.any(String));
    });
  });

  describe('should be generateRefreshToken ', () => {
    const user: User = new User();
    user.email = 'test@test.ru';

    it('should positive ', async () => {
      expect(await service.generateRefreshToken(user)).toEqual(
        expect.any(String),
      );
    });
  });
});
