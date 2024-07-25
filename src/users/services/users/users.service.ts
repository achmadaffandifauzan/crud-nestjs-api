import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/typeorm/entities/Note';
import { User } from 'src/typeorm/entities/User';
import {
  CreateUserNoteParams,
  CreateUserParams,
  UpdateUserParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Note) private noteRepository: Repository<Note>,
  ) {}

  fetchUsers() {
    return this.userRepository.find({ relations: ['notes'] });
  }
  fetchUserById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['notes'],
    });
  }
  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }
  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    const updatedUser = this.userRepository.update(
      { id },
      { ...updateUserDetails },
    );
    return updatedUser;
  }
  deleteUser(id: number) {
    return this.userRepository.delete(id);
  }

  async createUserNote(
    id: number,
    createUserNoteDetails: CreateUserNoteParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        'User not found, failed creating a note!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newNote = this.noteRepository.create({
      ...createUserNoteDetails,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.noteRepository.save(newNote);

    return this.userRepository.findOne({
      where: { id },
      relations: ['notes'],
    });
  }
}
