import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, LoginParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async register(userDetails: CreateUserParams) {
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    const foundUser = await this.userRepository.findOne({
      where: { username: userDetails.username },
    });
    if (foundUser) {
      throw new HttpException('Username already exist!', HttpStatus.CONFLICT);
    }
    const newUser = this.userRepository.create({
      ...userDetails,
      password: hashedPassword,
      createdAt: new Date(),
    });
    await this.userRepository.save(newUser);
    const payload = { userId: newUser.id, username: newUser.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: newUser.id,
      statusCode: HttpStatus.CREATED,
    };
  }
  async login(
    loginParams: LoginParams,
  ): Promise<{ access_token: string; userId: number }> {
    const { username, password } = loginParams;
    const foundUser = await this.userRepository.findOne({
      where: { username },
    });
    if (!foundUser) {
      throw new HttpException('Username not found!', HttpStatus.NOT_FOUND);
    }
    const compare = await bcrypt.compare(password, foundUser.password);
    if (!compare) {
      throw new UnauthorizedException();
    }
    const payload = { userId: foundUser.id, username: foundUser.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: foundUser.id,
    };
  }
}
