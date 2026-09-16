import {
  Body,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { SignupDTO } from './dtos/signup.dto';
import { SigninDTO } from './dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(private usersRepository: Repository<User>) {}

  async signup(@Body() signupDTO: SignupDTO) {
    const { name, email, password, passwordConfirm } = signupDTO;

    if (password !== passwordConfirm)
      throw new ConflictException('Passwords do not match.');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        throw new ConflictException('Username must be unique');
      }

      throw new InternalServerErrorException();
    }
  }

  async signin(@Body() signinDTO: SigninDTO) {
    const { email, password } = signinDTO;

    const user = await this.usersRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JWTPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please enter valid Credentials.');
    }
  }
}
