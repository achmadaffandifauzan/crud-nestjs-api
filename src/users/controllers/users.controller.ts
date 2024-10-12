import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserIdGuard } from 'src/guards/user-id.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), UserIdGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.fetchUserById(id);
    return user;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), UserIdGuard)
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), UserIdGuard)
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    const res = await this.userService.deleteUser(id);
    return res;
  }

  // @Post(':id/notes')
  // async createUserNote(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() createUserNoteDto: CreateUserNoteDto,
  // ) {
  //   const createOneNote = this.userService.createUserNote(
  //     id,
  //     createUserNoteDto,
  //   );
  //   return createOneNote;
  // }
}
