import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { Note } from './typeorm/entities/Note';
import { AuthModule } from './auth/auth.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'nestjs1',
      password: 'nestjs1',
      database: 'nestjs1',
      entities: [User, Note],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    NoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
