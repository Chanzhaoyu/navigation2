import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: '重置令牌不能为空' })
  @IsString({ message: '重置令牌必须是字符串' })
  token: string;

  @IsNotEmpty({ message: '新密码不能为空' })
  @IsString({ message: '新密码必须是字符串' })
  newPassword: string;
}
