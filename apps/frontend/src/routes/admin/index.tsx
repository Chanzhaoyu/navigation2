import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navigation, Users, Eye, TrendingUp } from 'lucide-react'
import { publicNavItems, privateNavItems, navCategories } from '@/data/mockData'

export const Route = createFileRoute('/admin/')({
  component: Dashboard,
})

function Dashboard() {
  const totalNavItems = publicNavItems.length + privateNavItems.length
  const totalCategories = navCategories.length
  
  const stats = [
    {
      title: '导航总数',
      value: totalNavItems,
      icon: Navigation,
      color: 'text-blue-600',
    },
    {
      title: '分类数量',
      value: totalCategories,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: '本月访问',
      value: '1,234',
      icon: Eye,
      color: 'text-purple-600',
    },
    {
      title: '增长趋势',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ]

  const recentActivity = [
    { action: '添加导航', item: 'GitHub', time: '2小时前' },
    { action: '编辑分类', item: '开发工具', time: '4小时前' },
    { action: '删除导航', item: '旧网站', time: '1天前' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">仪表板</h1>
        <p className="text-muted-foreground">
          欢迎回来，这里是您的导航管理概览
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">
                      {activity.action}
                    </Badge>
                    <span className="font-medium">{activity.item}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/nav/new"
                className="block p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="font-medium">添加新导航</div>
                <div className="text-sm text-muted-foreground">
                  快速添加新的网站导航
                </div>
              </a>
              <a
                href="/admin/categories"
                className="block p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="font-medium">管理分类</div>
                <div className="text-sm text-muted-foreground">
                  创建和编辑导航分类
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
