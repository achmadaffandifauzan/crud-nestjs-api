import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from '../services/note.service';
import { CreateNoteDto } from 'src/note/dtos/CreateNote.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserIdGuard } from 'src/guards/user-id.guard';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post('new')
  @UseGuards(AuthGuard('jwt'))
  async createNote(@Body() createNoteDto: CreateNoteDto, @Req() req) {
    const userId = req.user.userId;
    const note = this.noteService.createNote(userId, createNoteDto);
    return note;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchNotes(@Req() req) {
    const userId = req.user.userId;
    const notes = this.noteService.fetchNotes(userId);
    return notes;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async fetchNoteById(@Req() req, @Param('id', ParseIntPipe) noteId: number) {
    const userId = req.user.userId;
    const note = this.noteService.fetchNoteById(noteId, userId);
    return note;
  }
}
