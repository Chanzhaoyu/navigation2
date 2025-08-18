import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/admin/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  })

  const handleSave = () => {
    // 这里应该调用 API 更新用户信息
    console.log('保存用户信息:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">请先登录</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">个人资料</h1>
        <p className="text-muted-foreground">
          管理您的账户信息和偏好设置
        </p>
      </div>

      <div className="grid gap-6">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{user.username}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-1">
                  活跃用户
                </Badge>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">用户名</label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">邮箱</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>保存</Button>
                  <Button variant="outline" onClick={handleCancel}>取消</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">用户名</label>
                  <p className="text-sm">{user.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">邮箱</label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  编辑资料
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 偏好设置 */}
        <Card>
          <CardHeader>
            <CardTitle>偏好设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">主题</label>
                <p className="text-xs text-muted-foreground">选择您喜欢的主题</p>
              </div>
              <Badge variant="outline">{user.preferences.theme}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">布局</label>
                <p className="text-xs text-muted-foreground">导航项显示方式</p>
              </div>
              <Badge variant="outline">{user.preferences.layout === 'grid' ? '网格' : '列表'}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">每页显示</label>
                <p className="text-xs text-muted-foreground">每页显示的导航数量</p>
              </div>
              <Badge variant="outline">{user.preferences.itemsPerPage} 项</Badge>
            </div>
          </CardContent>
        </Card>

        {/* 安全设置 */}
        <Card>
          <CardHeader>
            <CardTitle>安全设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              修改密码
            </Button>
            <Button variant="outline" className="w-full">
              两步验证
            </Button>
            <Button variant="destructive" className="w-full">
              删除账户
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
