import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 创建分类（仅管理员）
   */
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  /**
   * 获取所有分类（仅管理员）
   */
  @Get('all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll() {
    return this.categoryService.findAll();
  }

  /**
   * 获取公开分类
   */
  @Get()
  findPublic() {
    return this.categoryService.findPublic();
  }

  /**
   * 根据ID获取分类
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  /**
   * 更新分类（仅管理员）
   */
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  /**
   * 删除分类（仅管理员）
   */
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  /**
   * 批量更新排序（仅管理员）
   */
  @Patch('batch/order')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  updateOrder(@Body() categories: { id: string; order: number }[]) {
    return this.categoryService.updateOrder(categories);
  }
}
