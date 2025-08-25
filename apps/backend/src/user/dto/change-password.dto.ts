import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: '当前密码不能为空' })
  @IsString({ message: '当前密码必须是字符串' })
  currentPassword: string;

  @IsNotEmpty({ message: '新密码不能为空' })
  @IsString({ message: '新密码必须是字符串' })
  @MinLength(6, { message: '新密码长度至少为6位' })
  newPassword: string;

  @IsNotEmpty({ message: '确认密码不能为空' })
  @IsString({ message: '确认密码必须是字符串' })
  confirmPassword: string;
}
