import { useState, useEffect } from 'react'
import { Link, createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, Eye, EyeOff } from 'lucide-react'
import { ResetPasswordIllustration } from '@/components/illustrations/ResetPasswordIllustration'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
    email: (search.email as string) || '',
  }),
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const { token, email } = useSearch({ from: '/reset-password' })
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!token || !email) {
      setError('重置链接无效或已过期')
    }
  }, [token, email])

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return '密码长度至少为6位'
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return '密码必须包含大写字母、小写字母和数字'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const passwordError = validatePassword(form.password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setIsLoading(true)

    try {
      const success = await resetPassword(token, email, form.password)
      
      if (success) {
        setIsSuccess(true)
        
        setTimeout(() => {
          navigate({ to: '/login' })
        }, 3000)
      } else {
        setError('重置链接无效或已过期')
      }
    } catch (err) {
      setError('密码重置失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                密码重置成功
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                您的密码已成功重置，即将跳转到登录页面...
              </p>
            </div>
            
            <Button asChild className="w-full">
              <Link to="/login">立即登录</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container relative grid h-full flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-gray-50 p-10 text-gray-800 lg:flex dark:border-r dark:bg-gray-100 dark:text-gray-900">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-2">
            <span className="text-primary text-sm font-bold">N</span>
          </div>
          导航站
        </div>
        
        <div className="relative z-20 flex-1 flex items-center justify-center my-8">
          <ResetPasswordIllustration className="w-full max-w-md h-auto opacity-90" />
        </div>
        
        <div className="relative z-20">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "设置一个强密码，保护您的账户安全。"
            </p>
            <footer className="text-sm opacity-70">安全提醒</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              重置密码
            </h1>
            <p className="text-sm text-muted-foreground">
              为账户 {email} 设置新密码
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/15 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

            <div className="grid gap-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="password" className="text-sm font-medium leading-none">
                    新密码
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="输入新密码"
                      value={form.password}
                      onChange={(e) =>
                        setForm(prev => ({ ...prev, password: e.target.value }))
                      }
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    密码至少6位，包含大写字母、小写字母和数字
                  </p>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                    确认新密码
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="再次输入新密码"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm(prev => ({ ...prev, confirmPassword: e.target.value }))
                      }
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !token || !email}
                >
                  {isLoading ? '重置中...' : '重置密码'}
                </Button>
              </form>
            </div>

            <p className="px-8 text-center text-sm text-muted-foreground">
              想起密码了？{' '}
              <Link
                to="/login"
                className="underline underline-offset-4 hover:text-primary font-medium"
              >
                返回登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }
