import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsNumber()
  PORT: number;

  @IsString()
  CLIENT_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;

  @IsOptional()
  @IsString()
  MAIL_HOST?: string;

  // 邮件
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  MAIL_PORT?: number;

  @IsOptional()
  @IsString()
  MAIL_USER?: string;

  @IsOptional()
  @IsString()
  MAIL_PASSWORD?: string;

  @IsOptional()
  @IsString()
  MAIL_FROM?: string;
}
