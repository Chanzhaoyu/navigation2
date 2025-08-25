import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取所有用户（仅管理员）
   */
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.userService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
    );
  }

  /**
   * 获取当前用户信息
   */
  @Get('me')
  @UseGuards(AuthGuard)
  getCurrentUser(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  /**
   * 获取用户统计信息
   */
  @Get('me/stats')
  @UseGuards(AuthGuard)
  getUserStats(@Request() req) {
    return this.userService.getUserStats(req.user.id);
  }

  /**
   * 根据ID获取用户信息（仅管理员）
   */
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   * 更新当前用户信息
   */
  @Patch('me')
  @UseGuards(AuthGuard)
  updateMe(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  /**
   * 修改当前用户密码
   */
  @Patch('me/password')
  @UseGuards(AuthGuard)
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    return this.userService.changePassword(req.user.id, changePasswordDto);
  }

  /**
   * 更新指定用户信息（仅管理员）
   */
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * 删除用户（仅管理员）
   */
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
