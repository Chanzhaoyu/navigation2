import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: '用户名必须是字符串' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @IsString({ message: '头像必须是字符串' })
  avatar?: string;

  @IsOptional()
  @IsInt({ message: '年龄必须是整数' })
  @Min(1, { message: '年龄必须大于0' })
  @Max(120, { message: '年龄不能超过120' })
  age?: number;

  @IsOptional()
  @IsString({ message: '性别必须是字符串' })
  gender?: string;

  @IsOptional()
  @IsString({ message: '个人简介必须是字符串' })
  bio?: string;
}
