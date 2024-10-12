import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Note } from 'src/typeorm/entities/Note';
import { User } from 'src/typeorm/entities/User';
import { CreateUserNoteParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Note) private noteRepository: Repository<Note>,
    private jwtService: JwtService,
  ) {}

  async fetchUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['notes'],
    });

    const { password, ...res } = user;
    return res;
  }

  async updateUser(id: number, updateUserDetails: UpdateUserParams) {
    const { password: newpassword, username } = updateUserDetails;
    if (newpassword) {
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      updateUserDetails.password = hashedPassword;
    }
    if (username) {
      const foundUser = await this.userRepository.findOne({
        where: { username },
      });
      if (foundUser) {
        throw new HttpException('Username already exist!', HttpStatus.CONFLICT);
      }
    }
    await this.userRepository.update({ id }, { ...updateUserDetails });
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    const { password, ...res } = updatedUser;
    return res;
  }
  async deleteUser(id: number) {
    const foundUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!foundUser) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete(id);
    return {
      message: 'User deleted successfully',
      statusCode: HttpStatus.OK,
    };
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
