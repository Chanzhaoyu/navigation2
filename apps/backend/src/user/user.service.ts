import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 获取所有用户（仅管理员）
   */
  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          avatar: true,
          age: true,
          gender: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              navItems: true,
              quickLinks: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 根据ID获取用户信息
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        age: true,
        gender: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            navItems: true,
            quickLinks: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 更新用户信息
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查用户名是否重复
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });

      if (existingUser) {
        throw new ConflictException('用户名已被使用');
      }
    }

    // 检查邮箱是否重复
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('邮箱已被使用');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        age: true,
        gender: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * 修改密码
   */
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    // 检查新密码和确认密码是否一致
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('新密码和确认密码不一致');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || !user.password) {
      throw new NotFoundException('用户不存在');
    }

    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('当前密码错误');
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });

    return { message: '密码修改成功' };
  }

  /**
   * 删除用户（仅管理员）
   */
  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查用户是否有关联数据
    const [navItemCount, quickLinkCount] = await Promise.all([
      this.prisma.navItem.count({ where: { userId: id } }),
      this.prisma.quickLink.count({ where: { userId: id } }),
    ]);

    if (navItemCount > 0 || quickLinkCount > 0) {
      throw new ConflictException('无法删除，用户还有关联的导航项或快捷链接');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: '用户删除成功' };
  }

  /**
   * 获取用户统计信息
   */
  async getUserStats(id: string) {
    const user = await this.findOne(id);

    const [navItemStats, quickLinkStats] = await Promise.all([
      this.prisma.navItem.groupBy({
        by: ['isPrivate'],
        where: { userId: id },
        _count: true,
      }),
      this.prisma.quickLink.groupBy({
        by: ['isActive'],
        where: { userId: id },
        _count: true,
      }),
    ]);

    return {
      user,
      stats: {
        navItems: {
          private:
            (navItemStats.find((stat) => stat.isPrivate)?._count as number) ||
            0,
          public:
            (navItemStats.find((stat) => !stat.isPrivate)?._count as number) ||
            0,
        },
        quickLinks: {
          active:
            (quickLinkStats.find((stat) => stat.isActive)?._count as number) ||
            0,
          inactive:
            (quickLinkStats.find((stat) => !stat.isActive)?._count as number) ||
            0,
        },
      },
    };
  }
}
