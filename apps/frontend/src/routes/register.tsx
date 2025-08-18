import { useState, useEffect } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { RegisterIllustration } from '@/components/illustrations/RegisterIllustration'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const { register, isLoading, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      navigate({ to: '/' })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (form.password !== form.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    if (form.password.length < 6) {
      setError('密码长度至少为6位')
      return
    }
    
    try {
      const success = await register(form.username, form.email, form.password)
      if (success) {
        navigate({ to: '/' })
      } else {
        setError('注册失败，请重试')
      }
    } catch (err) {
      setError('注册失败，请重试')
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 container relative grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-gray-50 p-10 text-gray-800 lg:flex dark:border-r dark:bg-gray-100 dark:text-gray-900">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-2">
              <span className="text-primary text-sm font-bold">N</span>
            </div>
            导航站
          </div>
          
          <div className="relative z-20 flex-1 flex items-center justify-center my-8">
            <RegisterIllustration className="w-full max-w-md h-auto opacity-90" />
          </div>
          
          <div className="relative z-20">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "加入我们，让导航变得更简单，让工作变得更高效。"
              </p>
              <footer className="text-sm opacity-70">产品团队</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 flex items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                创建账户
              </h1>
              <p className="text-sm text-muted-foreground">
                请填写以下信息来创建您的账户
              </p>
            </div>
            
            <div className="grid gap-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    用户名
                  </label>
                  <Input
                    id="username"
                    placeholder="输入用户名"
                    value={form.username}
                    onChange={(e) =>
                      setForm(prev => ({ ...prev, username: e.target.value }))
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    邮箱
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="输入邮箱地址"
                    value={form.email}
                    onChange={(e) =>
                      setForm(prev => ({ ...prev, email: e.target.value }))
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    密码
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="输入密码（至少6位）"
                    value={form.password}
                    onChange={(e) =>
                      setForm(prev => ({ ...prev, password: e.target.value }))
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    确认密码
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="再次输入密码"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm(prev => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
                
                {error && (
                  <div className="rounded-md bg-destructive/15 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? '注册中...' : '创建账户'}
                </Button>
              </form>
              
              <div className="text-xs text-muted-foreground text-center bg-muted p-3 rounded-md">
                创建账户即表示您同意我们的{' '}
                <a href="#" className="underline hover:text-primary font-medium">
                  服务条款
                </a>{' '}
                和{' '}
                <a href="#" className="underline hover:text-primary font-medium">
                  隐私政策
                </a>
              </div>
            </div>
            
            <p className="px-8 text-center text-sm text-muted-foreground">
              已有账户？{' '}
              <Link
                to="/login"
                className="underline underline-offset-4 hover:text-primary font-medium"
              >
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
