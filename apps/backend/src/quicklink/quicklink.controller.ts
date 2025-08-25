import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuicklinkService } from './quicklink.service';
import { CreateQuickLinkDto } from './dto/create-quicklink.dto';
import { UpdateQuickLinkDto } from './dto/update-quicklink.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('quicklinks')
export class QuicklinkController {
  constructor(private readonly quicklinkService: QuicklinkService) {}

  /**
   * 创建快捷链接（仅管理员）
   */
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createQuickLinkDto: CreateQuickLinkDto, @Request() req) {
    return this.quicklinkService.create(createQuickLinkDto, req.user.id);
  }

  /**
   * 获取所有快捷链接（仅管理员）
   */
  @Get('all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll() {
    return this.quicklinkService.findAll();
  }

  /**
   * 获取启用的快捷链接
   */
  @Get()
  findActive() {
    return this.quicklinkService.findActive();
  }

  /**
   * 根据ID获取快捷链接
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quicklinkService.findOne(id);
  }

  /**
   * 更新快捷链接（仅管理员）
   */
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateQuickLinkDto: UpdateQuickLinkDto,
    @Request() req,
  ) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.quicklinkService.update(
      id,
      updateQuickLinkDto,
      req.user.id,
      isAdmin,
    );
  }

  /**
   * 删除快捷链接（仅管理员）
   */
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.quicklinkService.remove(id, req.user.id, isAdmin);
  }

  /**
   * 批量更新排序（仅管理员）
   */
  @Patch('batch/order')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  updateOrder(@Body() items: { id: string; order: number }[]) {
    return this.quicklinkService.updateOrder(items);
  }

  /**
   * 切换状态（仅管理员）
   */
  @Patch(':id/toggle')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  toggleStatus(@Param('id') id: string) {
    return this.quicklinkService.toggleStatus(id);
  }
}
