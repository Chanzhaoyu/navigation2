import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateQuickLinkDto {
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString({ message: '标题必须是字符串' })
  title: string;

  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  description?: string;

  @IsNotEmpty({ message: 'URL不能为空' })
  @IsUrl({}, { message: 'URL格式不正确' })
  url: string;

  @IsOptional()
  @IsString({ message: '图标必须是字符串' })
  icon?: string;

  @IsOptional()
  @IsInt({ message: '排序必须是整数' })
  @Min(0, { message: '排序必须大于等于0' })
  order?: number;

  @IsOptional()
  @IsBoolean({ message: '是否启用必须是布尔值' })
  isActive?: boolean;
}
