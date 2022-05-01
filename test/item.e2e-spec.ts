import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AppConfigureFunc } from '../src/main';
import { CreateItemDto } from '../src/item/dto/create-item.dto';
import { Item } from '../src/item/entities/item.entity';
import { UpdateItemDto } from '../src/item/dto/update-item.dto';
import { PaginateQueryItemDto } from '../src/item/dto/paginate-query-item.dto';
import { PaginateResultItem } from '../src/item/paginate/paginate-result-item.';

describe('ItemController (e2e)', () => {
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

  let id = '1';
  const idNegative = '0';

  describe('/item (POST) create item', () => {
    const dto = { title: 'Test title' } as CreateItemDto;

    it('should be positive (status CREATED)', () => {
      return request(app.getHttpServer())
        .post('/item')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          id = body.id;
          expect(body).toEqual({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            title: dto.title,
          } as Item);
        });
    });

    it('should be validation (status BAD_REQUEST)', () => {
      dto.title = null;
      return request(app.getHttpServer())
        .post('/item')
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/item/{id} (GET) get item', () => {
    it('should be positive (status OK)', () => {
      return request(app.getHttpServer())
        .get(`/item/${id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            id: parseInt(id),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            title: expect.any(String),
          } as Item);
        });
    });

    it('should be negative (status NOT_FOUND)', () => {
      return request(app.getHttpServer())
        .get(`/item/${idNegative}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/item (GET) pagination item', () => {
    it('should be positive', () => {
      const dto: PaginateQueryItemDto = new PaginateQueryItemDto();
      return request(app.getHttpServer())
        .get('/item')
        .send(dto)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toEqual({
            meta: {
              page: dto.page,
              limit: dto.limit,
              order: dto.order,
              totalPages: expect.any(Number),
              totalItems: expect.any(Number),
            },
            items: expect.any(Array),
          } as PaginateResultItem);

          expect(body.items[0]).toEqual({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            title: expect.any(String),
          } as Item);
        });
    });
  });

  describe('/item/{id} (PUT) update item', () => {
    const dto: UpdateItemDto = { title: 'Title update' };
    it('should be positive (status OK)', () => {
      return request(app.getHttpServer())
        .put(`/item/${id}`)
        .send(dto)
        .expect(HttpStatus.OK);
    });

    it('should be negative (status NOT_FOUND)', () => {
      return request(app.getHttpServer())
        .put(`/item/${idNegative}`)
        .send(dto)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/item/{id} (DELETE) delete item', () => {
    it('should positive (status NO_CONTENT)', () => {
      return request(app.getHttpServer())
        .delete(`/item/${id}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should negative (status NOT_FOUND)', () => {
      return request(app.getHttpServer())
        .get(`/item/${idNegative}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
