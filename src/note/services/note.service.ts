import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Note } from 'src/typeorm/entities/Note';
import { User } from 'src/typeorm/entities/User';
import { CreateNoteParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Note) private noteRepository: Repository<Note>,
  ) {}
  async createNote(userId: number, createNoteDetails: CreateNoteParams) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException(
        'User not found, failed creating a note!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newNote = this.noteRepository.create({
      ...createNoteDetails,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.noteRepository.save(newNote);

    return {
      noteId: newNote.id,
      statusCode: HttpStatus.CREATED,
      message: 'Note created successfully!',
    };
  }

  async fetchNotes(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['notes'],
    });
    if (!user) {
      throw new HttpException(
        'User not found, failed creating a note!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.notes;
  }

  async fetchNoteById(noteId: number, userId: number) {
    const note = await this.noteRepository.findOne({
      where: { id: noteId },
      relations: ['user'],
    });
    if (!note) {
      throw new HttpException('Note not found!', HttpStatus.NOT_FOUND);
    }
    if (note.user.id !== userId) {
      throw new HttpException('Forbidden!', HttpStatus.FORBIDDEN);
    }
    const { user, ...res } = note;
    return res;
  }
}
