import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { SignupDTO } from './dtos/signup.dto';
import { SigninDTO } from './dtos/signin.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDTO } from './dtos/reset-passwords.dto';
import { ForgotPasswordDTO } from './dtos/forgot-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(signupDTO: SignupDTO) {
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

      const payload: JwtPayload = { sub: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        message: 'User successfully created',
        accessToken,
      };
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async signin(signinDTO: SigninDTO) {
    const { email, password } = signinDTO;

    const user = await this.usersRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { sub: user.id, email: user.email };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please enter valid Credentials.');
    }
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
    const { email } = forgotPasswordDTO;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found.');

    const resetToken = await this.jwtService.signAsync(
      { sub: user.id, type: 'password_reset' },
      { expiresIn: '15m' },
    );

    await this.mailService.sendPasswordReset(email, resetToken);

    return { message: 'Password reset email sent successfully.' };
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const { token, password, passwordConfirm } = resetPasswordDTO;

    if (password !== passwordConfirm) {
      throw new ConflictException('Passwords do not match.');
    }

    let payload: { sub: string; email: string; type?: string };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    if (payload.type !== 'password_reset') {
      throw new BadRequestException('Invalid token type.');
    }

    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new NotFoundException('User no longer exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await this.usersRepository.save(user);

    return { message: 'Password has been reset successfully.' };
  }
}
