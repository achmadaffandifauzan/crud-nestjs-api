import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
