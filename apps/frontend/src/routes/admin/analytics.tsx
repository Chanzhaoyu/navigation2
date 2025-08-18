import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Users, MousePointer, Calendar } from 'lucide-react'

export const Route = createFileRoute('/admin/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  // 模拟统计数据
  const stats = {
    totalClicks: 1234,
    todayClicks: 45,
    topNavigations: [
      { name: 'GitHub', clicks: 256, category: '开发工具' },
      { name: 'Figma', clicks: 189, category: '设计资源' },
      { name: 'Stack Overflow', clicks: 167, category: '开发工具' },
      { name: 'Dribbble', clicks: 134, category: '设计资源' },
      { name: 'MDN Web Docs', clicks: 98, category: '学习教育' },
    ],
    categoryStats: [
      { name: '开发工具', clicks: 523, percentage: 42.4 },
      { name: '设计资源', clicks: 323, percentage: 26.2 },
      { name: '学习教育', clicks: 198, percentage: 16.0 },
      { name: '工作效率', clicks: 123, percentage: 10.0 },
      { name: '娱乐休闲', clicks: 67, percentage: 5.4 },
    ],
    recentActivity: [
      { action: '点击', item: 'GitHub', time: '2分钟前', ip: '192.168.1.1' },
      { action: '点击', item: 'Figma', time: '5分钟前', ip: '192.168.1.2' },
      { action: '点击', item: 'Stack Overflow', time: '8分钟前', ip: '192.168.1.3' },
      { action: '点击', item: 'Dribbble', time: '12分钟前', ip: '192.168.1.4' },
    ]
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">统计分析</h1>
        <p className="text-muted-foreground">
          查看导航站点的使用情况和统计数据
        </p>
      </div>

      {/* 概览卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总点击量</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +20.1% 较上月
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日点击</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayClicks}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% 较昨日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +5.4% 较上周
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均点击率</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +0.3% 较上月
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 热门导航 */}
        <Card>
          <CardHeader>
            <CardTitle>热门导航</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topNavigations.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.category}</div>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {item.clicks} 次点击
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 分类统计 */}
        <Card>
          <CardHeader>
            <CardTitle>分类统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.categoryStats.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.clicks} ({category.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div>
                      <div className="text-sm">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-muted-foreground"> {activity.item}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.ip}</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 图表占位符 */}
        <Card>
          <CardHeader>
            <CardTitle>访问趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">图表组件占位符</p>
                <p className="text-xs text-muted-foreground">可以集成 Chart.js 或 Recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
