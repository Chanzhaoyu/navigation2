import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST') || 'smtp.gmail.com',
      port: this.configService.get<number>('MAIL_PORT') || 465,
      secure: true,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  /**
   * 发送验证邮件
   */
  async sendVerificationEmail(email: string, code: string) {
    try {
      const mailOptions = {
        from:
          this.configService.get<string>('MAIL_FROM') ||
          '导航系统 <noreply@navigation.com>',
        to: email,
        subject: '邮箱验证码',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">邮箱验证</h2>
            <p>您好，</p>
            <p>您的验证码是：</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #2563eb;">${code}</span>
            </div>
            <p>验证码将在 30 分钟后过期，请尽快使用。</p>
            <p>如果这不是您本人的操作，请忽略此邮件。</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`验证邮件已发送到 ${email}`);
    } catch (error) {
      this.logger.error(`发送验证邮件失败: ${error.message}`, error.stack);
      throw new Error('发送邮件失败');
    }
  }

  /**
   * 发送密码重置邮件
   */
  async sendPasswordResetEmail(email: string, resetToken: string) {
    try {
      const mailOptions = {
        from:
          this.configService.get<string>('MAIL_FROM') ||
          '导航系统 <noreply@navigation.com>',
        to: email,
        subject: '密码重置验证码',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">密码重置</h2>
            <p>您好，</p>
            <p>您请求重置密码，验证码是：</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #dc2626;">${resetToken}</span>
            </div>
            <p>验证码将在 30 分钟后过期，请尽快使用。</p>
            <p>如果这不是您本人的操作，请忽略此邮件。</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`密码重置邮件已发送到 ${email}`);
    } catch (error) {
      this.logger.error(`发送密码重置邮件失败: ${error.message}`, error.stack);
      throw new Error('发送邮件失败');
    }
  }
}
