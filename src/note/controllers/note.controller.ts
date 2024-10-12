import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from '../services/note.service';
import { CreateNoteDto } from 'src/note/dtos/CreateNote.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateNoteDto } from '../dtos/UpdateNote.dto';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

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

  @Post('new')
  @UseGuards(AuthGuard('jwt'))
  async createNote(@Body() createNoteDto: CreateNoteDto, @Req() req) {
    const userId = req.user.userId;
    const note = this.noteService.createNote(userId, createNoteDto);
    return note;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateNoteById(
    @Req() req,
    @Param('id', ParseIntPipe) noteId: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const userId = req.user.userId;
    const note = this.noteService.updateNoteById(noteId, userId, updateNoteDto);
    return note;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteNoteById(@Req() req, @Param('id', ParseIntPipe) noteId: number) {
    const userId = req.user.userId;
    const note = this.noteService.deleteNoteById(noteId, userId);
    return note;
  }
}
