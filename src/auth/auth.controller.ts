import { Body, Controller, Post } from '@nestjs/common';
import { SignupDTO } from './dtos/signup.dto';
import { AuthService } from './auth.service';
import { SigninDTO } from './dtos/signin.dto';
import { ForgotPasswordDTO } from './dtos/forgot-password.dto';
import { ResetPasswordDTO } from './dtos/reset-passwords.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authServices: AuthService) {}

  @Post('signup')
  signup(@Body() signupDTO: SignupDTO) {
    return this.authServices.signup(signupDTO);
  }

  @Post('signin')
  signin(@Body() signinDTO: SigninDTO) {
    return this.authServices.signin(signinDTO);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    return this.authServices.forgotPassword(forgotPasswordDTO);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    return this.authServices.resetPassword(resetPasswordDTO);
  }
}
