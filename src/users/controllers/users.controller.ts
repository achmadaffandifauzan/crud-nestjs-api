import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserNoteDto } from 'src/users/dtos/CreateUserNote.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';

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

  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    return updatedUser;
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
}
