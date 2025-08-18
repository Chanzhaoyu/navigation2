import { useState, useEffect } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { ForgotPasswordDialog } from '@/components/ForgotPasswordDialog'
import { LoginIllustration } from '@/components/illustrations/LoginIllustration'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { login, isLoading, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  useEffect(() => {
    if (user) {
      navigate({ to: '/' })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const success = await login(form.username, form.password)
      if (success) {
        navigate({ to: '/' })
      } else {
        setError('用户名或密码错误')
      }
    } catch (err) {
      setError('登录失败，请重试')
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
            <LoginIllustration className="w-full max-w-md h-auto opacity-90" />
          </div>
          
          <div className="relative z-20">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "这个导航站帮我整理了所有常用的网站，让我的工作效率大大提升。"
              </p>
              <footer className="text-sm opacity-70">张三</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 flex items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                欢迎回来
              </h1>
              <p className="text-sm text-muted-foreground">
                请输入您的账号信息登录
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
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      密码
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                    >
                      忘记密码？
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="输入密码"
                    value={form.password}
                    onChange={(e) =>
                      setForm(prev => ({ ...prev, password: e.target.value }))
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
                  {isLoading ? '登录中...' : '登录'}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    演示账号
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground text-center bg-muted p-3 rounded-md">
                用户名：<span className="font-medium">admin</span> | 密码：<span className="font-medium">admin</span>
              </div>
            </div>
            
            <p className="px-8 text-center text-sm text-muted-foreground">
              还没有账户？{' '}
              <Link
                to="/register"
                className="underline underline-offset-4 hover:text-primary font-medium"
              >
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <ForgotPasswordDialog 
        open={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  )
}
