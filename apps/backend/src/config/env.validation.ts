import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @Transform(({ value }: { value: string }) => parseInt(value, 10))
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
}
