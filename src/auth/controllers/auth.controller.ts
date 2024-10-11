import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dtos/Register.dto';
import { LoginDto } from 'src/auth/dtos/Login.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const newUser = this.authService.register(createUserDto);
    return newUser;
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = this.authService.login(loginDto);
    return user;
  }
}
