import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('开始数据库种子...');

  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@example.com' },
    });

    if (existingAdmin) {
      console.log('管理员用户已存在，跳过创建');
      return;
    }

    const hashedPassword: string = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        bio: '系统管理员',
      },
    });

    console.log('默认管理员创建成功:', {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error('创建管理员时发生错误:', error);
    throw error;
  }
}

void main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('数据库种子完成');
  })
  .catch(async (error: unknown) => {
    console.error('数据库种子失败:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
