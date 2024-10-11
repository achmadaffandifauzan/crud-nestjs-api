import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Render,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { CreateUserNoteDto } from 'src/users/dtos/CreateUserNote.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { SignInDto } from 'src/users/dtos/SignIn.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.fetchUsers();
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.fetchUserById(id);
    return user;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = this.userService.createUser(createUserDto);
    return newUser;
  }
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const user = this.userService.signIn(signInDto);
    return user;
  }

  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }

  @Post(':id/notes')
  async createUserNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserNoteDto: CreateUserNoteDto,
  ) {
    const createOneNote = this.userService.createUserNote(
      id,
      createUserNoteDto,
    );
    return createOneNote;
  }

  //   @Get(':id/notes/:noteId')
  //   async getUserNoteById(

  //   )
}
