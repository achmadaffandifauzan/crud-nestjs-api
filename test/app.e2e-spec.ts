import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setTimeout } from 'timers/promises';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let noteId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'test_user',
        password: 'test_password',
        firstName: 'Test',
        lastName: 'User',
      })
      .expect(201)
      .expect((res) => {
        jwtToken = res.body.access_token;
        expect(jwtToken).toBeDefined();
      });
  });

  it('should add a note using the JWT token', () => {
    return request(app.getHttpServer())
      .post('/note')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'Test Note Title',
        content: 'This is the test note description.',
      })
      .expect(201)
      .expect((res) => {
        noteId = res.body.noteId;
        expect(noteId).toBeDefined();
        expect(res.body.title).toEqual('Test Note Title');
      });
  });

  it('should fail to access the protected route without a token', () => {
    return request(app.getHttpServer())
      .post('/note')
      .send({
        title: 'Another One',
        content: 'This is the test note description too.',
      })
      .expect(401);
  });

  it('should fail to delete the note after token expiration (8 seconds)', async () => {
    await setTimeout(8000);
    return request(app.getHttpServer())
      .delete(`/note/${noteId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(401);
  });

  it('should login and return a new JWT token after expiration', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test_user',
        password: 'test_password',
      })
      .expect(200)
      .expect((res) => {
        jwtToken = res.body.access_token;
        expect(jwtToken).toBeDefined();
      });
  });

  it('should delete the note using the new JWT token', () => {
    return request(app.getHttpServer())
      .delete(`/note/${noteId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });
});
