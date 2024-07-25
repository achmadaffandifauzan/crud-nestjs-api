import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Note } from 'src/typeorm/entities/Note';

@Module({
  imports: [TypeOrmModule.forFeature([User, Note])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
