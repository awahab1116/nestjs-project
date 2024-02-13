import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('POST /auth/login', () => {
    it('should return a token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test123@gmail.com', password: '123456' }) // replace with your email and password
        .expect(201) // replace with your expected status code
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          token = res.body.access_token; // save the token for the next test
        });
    });
  });

  describe('GET /product/view', () => {
    it('should return a list of products', () => {
      return request(app.getHttpServer())
        .get('/product/view')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
        });
    });

    it('should return 401 if token is not provided', () => {
      return request(app.getHttpServer()).get('/product/view').expect(401);
    });
  });

  describe('POST /product/create', () => {
    it('should return a product', () => {
      return request(app.getHttpServer())
        .post('/product/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'test product',
          price: 100,
          description: 'test description',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });

    it('should return 401 if token is not provided', () => {
      return request(app.getHttpServer()).post('/product/create').expect(401);
    });

    it('should return 400 if name is not provided', () => {
      return request(app.getHttpServer())
        .post('/product/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          price: 100,
          quantity: 1,
          description: 'test description',
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.message).toContain(
            'name should not be empty' ||
              'name should be a string' ||
              'Product name must have atleast 5 characters.',
          );
        });
    });
  });

  describe('POST /order/place', () => {
    it('should return a order', () => {
      return request(app.getHttpServer())
        .post('/order/place')
        .set('Authorization', `Bearer ${token}`)
        .send([{ productId: 9, quantity: 1 }])
        .expect(201)
        .expect('Content-Type', /html/)
        .expect((res) => {
          console.log('Data is: ', res.text);
          expect(res.text).toBeDefined();
        });
    });

    it('should return 401 if token is not provided', () => {
      return request(app.getHttpServer()).post('/order/place').expect(401);
    });
  });
});
