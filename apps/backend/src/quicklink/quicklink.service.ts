import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuickLinkDto } from './dto/create-quicklink.dto';
import { UpdateQuickLinkDto } from './dto/update-quicklink.dto';

@Injectable()
export class QuicklinkService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建快捷链接（仅管理员）
   */
  async create(createQuickLinkDto: CreateQuickLinkDto, userId: string) {
    // 如果没有提供 order，则设为当前最大值 + 1
    if (!createQuickLinkDto.order) {
      const maxOrder = await this.prisma.quickLink.aggregate({
        _max: { order: true },
      });
      createQuickLinkDto.order = (maxOrder._max.order || 0) + 1;
    }

    return await this.prisma.quickLink.create({
      data: {
        ...createQuickLinkDto,
        userId,
      },
      include: {
        user: { select: { username: true } },
      },
    });
  }

  /**
   * 获取所有快捷链接
   */
  async findAll() {
    return await this.prisma.quickLink.findMany({
      orderBy: { order: 'asc' },
      include: {
        user: { select: { username: true } },
      },
    });
  }

  /**
   * 获取启用的快捷链接
   */
  async findActive() {
    return await this.prisma.quickLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        user: { select: { username: true } },
      },
    });
  }

  /**
   * 根据ID获取快捷链接
   */
  async findOne(id: string) {
    const quickLink = await this.prisma.quickLink.findUnique({
      where: { id },
      include: {
        user: { select: { username: true } },
      },
    });

    if (!quickLink) {
      throw new NotFoundException('快捷链接不存在');
    }

    return quickLink;
  }

  /**
   * 更新快捷链接（仅管理员）
   */
  async update(
    id: string,
    updateQuickLinkDto: UpdateQuickLinkDto,
    userId: string,
    isAdmin: boolean,
  ) {
    const quickLink = await this.prisma.quickLink.findUnique({
      where: { id },
    });

    if (!quickLink) {
      throw new NotFoundException('快捷链接不存在');
    }

    // 只有管理员可以编辑，或者是创建者本人
    if (!isAdmin && quickLink.userId !== userId) {
      throw new ForbiddenException('无权编辑此快捷链接');
    }

    return await this.prisma.quickLink.update({
      where: { id },
      data: updateQuickLinkDto,
      include: {
        user: { select: { username: true } },
      },
    });
  }

  /**
   * 删除快捷链接（仅管理员）
   */
  async remove(id: string, userId: string, isAdmin: boolean) {
    const quickLink = await this.prisma.quickLink.findUnique({
      where: { id },
    });

    if (!quickLink) {
      throw new NotFoundException('快捷链接不存在');
    }

    // 只有管理员可以删除，或者是创建者本人
    if (!isAdmin && quickLink.userId !== userId) {
      throw new ForbiddenException('无权删除此快捷链接');
    }

    await this.prisma.quickLink.delete({
      where: { id },
    });

    return { message: '快捷链接删除成功' };
  }

  /**
   * 批量更新排序（仅管理员）
   */
  async updateOrder(items: { id: string; order: number }[]) {
    const transactions = items.map((item) =>
      this.prisma.quickLink.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await this.prisma.$transaction(transactions);
    return { message: '排序更新成功' };
  }

  /**
   * 批量切换状态（仅管理员）
   */
  async toggleStatus(id: string) {
    const quickLink = await this.findOne(id);

    return await this.prisma.quickLink.update({
      where: { id },
      data: { isActive: !quickLink.isActive },
    });
  }
}
