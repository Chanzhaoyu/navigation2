import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { CreateNavItemDto } from './dto/create-nav-item.dto';
import { UpdateNavItemDto } from './dto/update-nav-item.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  /**
   * 创建导航项
   */
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createNavItemDto: CreateNavItemDto, @Request() req) {
    const userId = createNavItemDto.isPrivate ? req.user.id : undefined;
    return this.navigationService.create(createNavItemDto, userId);
  }

  /**
   * 获取所有导航项（管理员）
   */
  @Get('all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
    @Query('isPrivate') isPrivate?: string,
    @Query('search') search?: string,
  ) {
    return this.navigationService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      categoryId,
      isPrivate === 'true' ? true : isPrivate === 'false' ? false : undefined,
      search,
    );
  }

  /**
   * 获取公开导航项
   */
  @Get('public')
  findPublic(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.navigationService.findPublic(categoryId, search);
  }

  /**
   * 获取用户私人导航项
   */
  @Get('private')
  @UseGuards(AuthGuard)
  findPrivate(
    @Request() req,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.navigationService.findPrivate(req.user.id, categoryId, search);
  }

  /**
   * 根据ID获取导航项
   */
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req?.user?.id;
    return this.navigationService.findOne(id, userId);
  }

  /**
   * 更新导航项
   */
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateNavItemDto: UpdateNavItemDto,
    @Request() req,
  ) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.navigationService.update(
      id,
      updateNavItemDto,
      req.user.id,
      isAdmin,
    );
  }

  /**
   * 删除导航项
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.navigationService.remove(id, req.user.id, isAdmin);
  }

  /**
   * 增加点击量
   */
  @Post(':id/click')
  incrementClick(@Param('id') id: string) {
    return this.navigationService.incrementClick(id);
  }

  /**
   * 批量更新排序
   */
  @Patch('batch/order')
  @UseGuards(AuthGuard)
  updateOrder(@Body() items: { id: string; order: number }[], @Request() req) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.navigationService.updateOrder(items, req.user.id, isAdmin);
  }
}
