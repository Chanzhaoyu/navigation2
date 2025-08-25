import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: '分类名称不能为空' })
  @IsString({ message: '分类名称必须是字符串' })
  name: string;

  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  description?: string;

  @IsOptional()
  @IsString({ message: '图标必须是字符串' })
  icon?: string;

  @IsOptional()
  @IsString({ message: '颜色必须是字符串' })
  color?: string;

  @IsOptional()
  @IsInt({ message: '排序必须是整数' })
  @Min(0, { message: '排序必须大于等于0' })
  order?: number;

  @IsOptional()
  @IsBoolean({ message: '是否公开必须是布尔值' })
  isPublic?: boolean;
}
