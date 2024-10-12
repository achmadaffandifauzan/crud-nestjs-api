import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Note } from 'src/typeorm/entities/Note';
import { User } from 'src/typeorm/entities/User';
import { CreateNoteParams, UpdateNoteParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Note) private noteRepository: Repository<Note>,
  ) {}

  async fetchNotes(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['notes'],
    });
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

  async createNote(userId: number, createNoteDetails: CreateNoteParams) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const newNote = this.noteRepository.create({
      ...createNoteDetails,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.noteRepository.save(newNote);

    return {
      noteId: newNote.id,
      title: newNote.title,
      statusCode: HttpStatus.CREATED,
      message: 'Note created successfully!',
    };
  }

  async updateNoteById(
    noteId: number,
    userId: number,
    updateNoteDetails: UpdateNoteParams,
  ) {
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
    await this.noteRepository.update(
      { id: noteId },
      { ...updateNoteDetails, updatedAt: new Date() },
    );
    const updatedNote = await this.userRepository.findOne({
      where: { id: noteId },
    });
    await this.noteRepository.save(updatedNote);

    return {
      noteId: updatedNote.id,
      statusCode: HttpStatus.OK,
      message: 'Note updated successfully!',
    };
  }

  async deleteNoteById(noteId: number, userId: number) {
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
    await this.noteRepository.delete(noteId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Note deleted successfully',
    };
  }
}
