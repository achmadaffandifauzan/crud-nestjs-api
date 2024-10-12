import { Module } from '@nestjs/common';
import { NoteController } from './controllers/note.controller';
import { NoteService } from './services/note.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Note } from 'src/typeorm/entities/Note';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Note]),
    AuthModule,
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
