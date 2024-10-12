import { Controller } from '@nestjs/common';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
  constructor(noteService: NoteService) {}
}
