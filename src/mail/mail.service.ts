import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailtrapClient } from 'mailtrap';

@Injectable()
export class MailService {
  private client: MailtrapClient;

  constructor(private configService: ConfigService) {
    this.client = new MailtrapClient({
      token: this.configService.get('MAILTRAP_TOKEN')!,
    });
  }

  async sendPasswordReset(email: string, resetToken: string) {
    await this.client.send({
      from: {
        email: this.configService.get('MAIL_FROM')!,
        name: this.configService.get('MAIL_FROM_NAME'),
      },
      to: [{ email }],
      subject: 'Reset Your Password',
      text: `Your password reset token: ${resetToken}\n\nExpires in 15 minutes.`,
    });
  }
}
