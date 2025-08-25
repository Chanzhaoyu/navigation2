import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建分类
   */
  async create(createCategoryDto: CreateCategoryDto) {
    // 检查分类名称是否已存在
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('分类名称已存在');
    }

    // 如果没有提供 order，则设为当前最大值 + 1
    if (!createCategoryDto.order) {
      const maxOrder = await this.prisma.category.aggregate({
        _max: { order: true },
      });
      createCategoryDto.order = (maxOrder._max.order || 0) + 1;
    }

    return this.prisma.category.create({
      data: createCategoryDto,
      include: {
        _count: {
          select: {
            navItems: true,
          },
        },
      },
    });
  }

  /**
   * 获取所有分类
   */
  async findAll() {
    return await this.prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            navItems: true,
          },
        },
      },
    });
  }

  /**
   * 获取公开分类
   */
  async findPublic() {
    return await this.prisma.category.findMany({
      where: { isPublic: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            navItems: true,
          },
        },
      },
    });
  }

  /**
   * 根据ID获取分类
   */
  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            navItems: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    return category;
  }

  /**
   * 更新分类
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id); // 确保分类存在

    // 如果更新名称，检查是否与其他分类重复
    if (updateCategoryDto.name) {
      const existingCategory = await this.prisma.category.findFirst({
        where: {
          name: updateCategoryDto.name,
          id: { not: id },
        },
      });

      if (existingCategory) {
        throw new ConflictException('分类名称已存在');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        _count: {
          select: {
            navItems: true,
          },
        },
      },
    });
  }

  /**
   * 删除分类
   */
  async remove(id: string) {
    await this.findOne(id); // 确保分类存在

    // 检查是否有导航项在使用此分类
    const navItemCount = await this.prisma.navItem.count({
      where: { categoryId: id },
    });

    if (navItemCount > 0) {
      throw new ConflictException('无法删除，该分类下还有导航项');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: '分类删除成功' };
  }

  /**
   * 批量更新分类排序
   */
  async updateOrder(categories: { id: string; order: number }[]) {
    const transactions = categories.map((category) =>
      this.prisma.category.update({
        where: { id: category.id },
        data: { order: category.order },
      }),
    );

    await this.prisma.$transaction(transactions);
    return { message: '排序更新成功' };
  }
}
