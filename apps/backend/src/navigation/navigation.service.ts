import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNavItemDto } from './dto/create-nav-item.dto';
import { UpdateNavItemDto } from './dto/update-nav-item.dto';

@Injectable()
export class NavigationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建导航项
   */
  async create(createNavItemDto: CreateNavItemDto, userId?: string) {
    // 验证分类是否存在
    const category = await this.prisma.category.findUnique({
      where: { id: createNavItemDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('指定的分类不存在');
    }

    // 如果没有提供 order，则设为当前最大值 + 1
    if (!createNavItemDto.order) {
      const maxOrder = await this.prisma.navItem.aggregate({
        where: { categoryId: createNavItemDto.categoryId },
        _max: { order: true },
      });
      createNavItemDto.order = (maxOrder._max.order || 0) + 1;
    }

    // 如果创建私人导航，必须提供用户ID
    if (createNavItemDto.isPrivate && !userId) {
      throw new BadRequestException('创建私人导航必须提供用户ID');
    }

    const data = {
      ...createNavItemDto,
      userId: createNavItemDto.isPrivate ? userId : undefined,
    };

    return await this.prisma.navItem.create({
      data,
      include: {
        category: true,
        user: createNavItemDto.isPrivate
          ? { select: { username: true } }
          : false,
      },
    });
  }

  /**
   * 获取所有导航项（分页）
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    isPrivate?: boolean,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (typeof isPrivate === 'boolean') {
      where.isPrivate = isPrivate;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.navItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        include: {
          category: true,
          user: { select: { username: true } },
        },
      }),
      this.prisma.navItem.count({ where }),
    ]);

    return {
      items: items.map((item) => this.transformNavItem(item)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 获取公开导航项
   */
  async findPublic(categoryId?: string, search?: string) {
    const where: any = { isPublic: true, isPrivate: false };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await this.prisma.navItem.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        category: true,
      },
    });

    return items.map((item) => this.transformNavItem(item));
  }

  /**
   * 获取用户私人导航项
   */
  async findPrivate(userId: string, categoryId?: string, search?: string) {
    const where: any = { userId, isPrivate: true };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await this.prisma.navItem.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        category: true,
        user: { select: { username: true } },
      },
    });

    return items.map((item) => this.transformNavItem(item));
  }

  /**
   * 根据ID获取导航项
   */
  async findOne(id: string, userId?: string) {
    const navItem = await this.prisma.navItem.findUnique({
      where: { id },
      include: {
        category: true,
        user: { select: { username: true } },
      },
    });

    if (!navItem) {
      throw new NotFoundException('导航项不存在');
    }

    // 如果是私人导航，检查权限
    if (navItem.isPrivate && navItem.userId !== userId) {
      throw new ForbiddenException('无权访问此私人导航');
    }

    return this.transformNavItem(navItem);
  }

  /**
   * 更新导航项
   */
  async update(
    id: string,
    updateNavItemDto: UpdateNavItemDto,
    userId?: string,
    isAdmin?: boolean,
  ) {
    const navItem = await this.prisma.navItem.findUnique({
      where: { id },
    });

    if (!navItem) {
      throw new NotFoundException('导航项不存在');
    }

    // 权限检查：只有管理员或导航项的所有者可以编辑
    if (!isAdmin && navItem.userId !== userId) {
      throw new ForbiddenException('无权编辑此导航项');
    }

    // 如果更新分类，验证分类是否存在
    if (updateNavItemDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateNavItemDto.categoryId },
      });

      if (!category) {
        throw new BadRequestException('指定的分类不存在');
      }
    }

    return await this.prisma.navItem.update({
      where: { id },
      data: updateNavItemDto,
      include: {
        category: true,
        user: { select: { username: true } },
      },
    });
  }

  /**
   * 删除导航项
   */
  async remove(id: string, userId?: string, isAdmin?: boolean) {
    const navItem = await this.prisma.navItem.findUnique({
      where: { id },
    });

    if (!navItem) {
      throw new NotFoundException('导航项不存在');
    }

    // 权限检查：只有管理员或导航项的所有者可以删除
    if (!isAdmin && navItem.userId !== userId) {
      throw new ForbiddenException('无权删除此导航项');
    }

    await this.prisma.navItem.delete({
      where: { id },
    });

    return { message: '导航项删除成功' };
  }

  /**
   * 增加点击量
   */
  async incrementClick(id: string) {
    const navItem = await this.prisma.navItem.findUnique({
      where: { id },
    });

    if (!navItem) {
      throw new NotFoundException('导航项不存在');
    }

    return await this.prisma.navItem.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
  }

  /**
   * 批量更新排序
   */
  async updateOrder(
    items: { id: string; order: number }[],
    userId?: string,
    isAdmin?: boolean,
  ) {
    // 如果不是管理员，验证所有项目是否属于该用户
    if (!isAdmin) {
      const navItems = await this.prisma.navItem.findMany({
        where: { id: { in: items.map((item) => item.id) } },
        select: { id: true, userId: true },
      });

      const hasUnauthorized = navItems.some((item) => item.userId !== userId);
      if (hasUnauthorized) {
        throw new ForbiddenException('无权修改其他用户的导航项');
      }
    }

    const transactions = items.map((item) =>
      this.prisma.navItem.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await this.prisma.$transaction(transactions);
    return { message: '排序更新成功' };
  }

  /**
   * 转换导航项数据格式
   */
  private transformNavItem(navItem: any): any {
    return {
      ...navItem,
      tags: navItem.tags
        ? navItem.tags.split(',').map((tag: string) => tag.trim())
        : [],
    };
  }
}
