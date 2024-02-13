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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World');
  });

  describe('POST /auth/register-user', () => {
    it('should return a user', () => {
      return request(app.getHttpServer())
        .post('/auth/register-user')
        .send({
          email: 'test123@gmail.com',
          password: '123456',
          firstName: 'test',
          lastName: 'user',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });
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

    it("should return 401 if user doesn't exist", () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@email.com", password: "123456' })
        .expect(400);
    });

    it('should return 401 if password is incorrect', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test123@gmail.com', password: 'wrongpassword' })
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Provided password not correct',
          );
        });
    });

    it('should return 400 if email is invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: '', password: '1234' }) // replace with invalid email
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.message).toContain(
            'Please provide valid Email.' ||
              'Password should have minimum 6 characters',
          );
        });
    });
  });

  describe('GET /auth/profile', () => {
    it('should return user profile', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('firstName');
          expect(res.body).toHaveProperty('lastName');
        });
    });

    it('should return 401 if token is invalid', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer invalidtoken`)
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Unauthorized');
        });
    });
  });
});
