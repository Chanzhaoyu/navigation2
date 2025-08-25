import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('开始数据库种子...');

  // 清理现有数据
  await prisma.navItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.quickLink.deleteMany();
  await prisma.user.deleteMany();

  // 创建管理员用户
  const hashedPassword = await bcrypt.hash('admin', 10);
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  // 创建普通用户
  const normalUser = await prisma.user.create({
    data: {
      username: 'user',
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
    },
  });

  // 创建分类
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: '开发工具',
        description: '编程和开发相关工具',
        icon: 'Code',
        color: 'blue',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: '设计资源',
        description: '设计和创意工具',
        icon: 'Palette',
        color: 'purple',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: '学习教育',
        description: '在线学习和教育资源',
        icon: 'GraduationCap',
        color: 'green',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: '工作效率',
        description: '提升工作效率的工具',
        icon: 'Zap',
        color: 'orange',
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: '社交媒体',
        description: '社交网络和通讯工具',
        icon: 'MessageCircle',
        color: 'pink',
        order: 5,
      },
    }),
  ]);

  // 创建公共导航项
  const publicNavItems = [
    // 开发工具
    {
      title: 'GitHub',
      description: '全球最大的代码托管平台',
      url: 'https://github.com',
      icon: 'Github',
      tags: 'git,代码,开源',
      categoryId: categories[0].id,
      isPrivate: false,
      isPublic: true,
      order: 1,
    },
    {
      title: 'VS Code',
      description: 'Microsoft 开发的免费代码编辑器',
      url: 'https://code.visualstudio.com',
      icon: 'Code',
      tags: '编辑器,IDE,微软',
      categoryId: categories[0].id,
      isPrivate: false,
      isPublic: true,
      order: 2,
    },
    {
      title: 'Stack Overflow',
      description: '程序员问答社区',
      url: 'https://stackoverflow.com',
      icon: 'HelpCircle',
      tags: '问答,社区,编程',
      categoryId: categories[0].id,
      isPrivate: false,
      isPublic: true,
      order: 3,
    },
    // 设计资源
    {
      title: 'Figma',
      description: '基于浏览器的协作设计工具',
      url: 'https://figma.com',
      icon: 'Figma',
      tags: '设计,UI,协作',
      categoryId: categories[1].id,
      isPrivate: false,
      isPublic: true,
      order: 1,
    },
    {
      title: 'Dribbble',
      description: '设计师作品分享平台',
      url: 'https://dribbble.com',
      icon: 'Dribbble',
      tags: '设计,作品,灵感',
      categoryId: categories[1].id,
      isPrivate: false,
      isPublic: true,
      order: 2,
    },
    // 学习教育
    {
      title: 'MDN Web Docs',
      description: '权威的 Web 开发文档',
      url: 'https://developer.mozilla.org',
      icon: 'Book',
      tags: 'Web,文档,学习',
      categoryId: categories[2].id,
      isPrivate: false,
      isPublic: true,
      order: 1,
    },
    {
      title: 'Coursera',
      description: '在线课程学习平台',
      url: 'https://coursera.org',
      icon: 'GraduationCap',
      tags: '课程,学习,教育',
      categoryId: categories[2].id,
      isPrivate: false,
      isPublic: true,
      order: 2,
    },
  ];

  await Promise.all(
    publicNavItems.map((item) => prisma.navItem.create({ data: item })),
  );

  // 创建私人导航项（属于普通用户）
  const privateNavItems = [
    {
      title: '个人 GitHub',
      description: '我的 GitHub 个人主页',
      url: 'https://github.com/myusername',
      icon: 'Github',
      tags: 'git,个人,代码',
      categoryId: categories[0].id,
      userId: normalUser.id,
      isPrivate: true,
      isPublic: false,
      order: 1,
    },
    {
      title: '个人博客',
      description: '我的技术博客',
      url: 'https://myblog.com',
      icon: 'BookOpen',
      tags: '博客,技术,个人',
      categoryId: categories[2].id,
      userId: normalUser.id,
      isPrivate: true,
      isPublic: false,
      order: 2,
    },
  ];

  await Promise.all(
    privateNavItems.map((item) => prisma.navItem.create({ data: item })),
  );

  // 创建快捷链接（管理员创建）
  const quickLinks = [
    {
      title: '在线工具',
      description: '常用的在线小工具集合',
      url: 'https://tool.lu',
      icon: 'Wrench',
      order: 1,
      userId: adminUser.id,
    },
    {
      title: 'Can I Use',
      description: '浏览器兼容性查询',
      url: 'https://caniuse.com',
      icon: 'Browser',
      order: 2,
      userId: adminUser.id,
    },
    {
      title: 'JSON Formatter',
      description: 'JSON 格式化工具',
      url: 'https://jsonformatter.curiousconcept.com',
      icon: 'FileText',
      order: 3,
      userId: adminUser.id,
    },
  ];

  await Promise.all(
    quickLinks.map((link) => prisma.quickLink.create({ data: link })),
  );

  console.log('数据库种子完成!');
  console.log(`创建了 ${categories.length} 个分类`);
  console.log(`创建了 ${publicNavItems.length} 个公共导航项`);
  console.log(`创建了 ${privateNavItems.length} 个私人导航项`);
  console.log(`创建了 ${quickLinks.length} 个快捷链接`);
  console.log('管理员账号: admin / admin');
  console.log('普通用户账号: user / user123');
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
