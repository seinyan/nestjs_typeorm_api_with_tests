import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserLoginPassword } from './user-login-password';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { LoginResultDto } from '../src/auth/result/login-result.dto';
import { AppConfigure } from '../src/app-configure';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  let accessToken = null;
  let refreshToken = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    AppConfigure(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST) ', () => {
    it('should be positive', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(UserLoginPassword)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          accessToken = body.accessToken;
          refreshToken = body.accessToken;
          expect(body).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          } as LoginResultDto);
        });
    });

    it('should be negative', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: UserLoginPassword.username })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/auth/accessToken (POST)', () => {
    it('should positive', () => {
      return request(app.getHttpServer())
        .get('/auth/accessToken')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(HttpStatus.OK);
    });

    it('should negative', () => {
      return request(app.getHttpServer())
        .get('/auth/accessToken')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
