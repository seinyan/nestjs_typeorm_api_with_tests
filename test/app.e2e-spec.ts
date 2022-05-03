import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppConfigureFunc } from '../src/main';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    AppConfigureFunc(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ping (GET)', () => {
    return request(app.getHttpServer()).get('/ping').expect(200).expect('pong');
  });
});
