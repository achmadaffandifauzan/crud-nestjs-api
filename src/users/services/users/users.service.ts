import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Note } from 'src/typeorm/entities/Note';
import { User } from 'src/typeorm/entities/User';
import {
  CreateUserNoteParams,
  CreateUserParams,
  SignInParams,
  UpdateUserParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Note) private noteRepository: Repository<Note>,
    private jwtService: JwtService,
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
  async createUser(userDetails: CreateUserParams) {
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    const foundUser = await this.userRepository.findOne({
      where: { username: userDetails.username },
    });
    if (foundUser) {
      throw new HttpException('Username already exist!', 409);
    }
    const newUser = this.userRepository.create({
      ...userDetails,
      password: hashedPassword,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }
  async signIn(
    signinParams: SignInParams,
  ): Promise<{ access_token: string; userId: number }> {
    const { username, password } = signinParams;
    const foundUser = await this.userRepository.findOne({
      where: { username },
    });
    if (!foundUser) {
      throw new HttpException('Username not found!', 404);
    }
    const compare = await bcrypt.compare(password, foundUser.password);
    if (!compare) {
      throw new UnauthorizedException();
    }
    const payload = { sub: foundUser.id, username: foundUser.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: foundUser.id,
    };
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
