import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle } from 'lucide-react'

interface ForgotPasswordDialogProps {
  open: boolean
  onClose: (open: boolean) => void
}

export function ForgotPasswordDialog({ open, onClose }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 简单的邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError('请输入有效的邮箱地址')
        return
      }
      
      setIsSuccess(true)
    } catch (err) {
      setError('发送失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setError('')
    setIsSuccess(false)
    setIsLoading(false)
    onClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                重置链接已发送
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                找回密码
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isSuccess 
              ? '我们已向您的邮箱发送了密码重置链接，请查收邮件并按照说明操作。'
              : '请输入您的注册邮箱，我们将向您发送密码重置链接。'
            }
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                如果您没有收到邮件，请检查垃圾邮件文件夹，或稍后重试。
              </p>
              
              {/* 演示用的测试链接 */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-xs text-blue-600 mb-2">演示模式 - 测试重置链接：</p>
                <Link
                  to="/reset-password"
                  search={{ token: 'demo-token-123', email }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                  onClick={handleClose}
                >
                  点击这里重置密码
                </Link>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              确定
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="reset-email" className="text-sm font-medium">
                邮箱地址
              </label>
              <Input
                id="reset-email"
                type="email"
                placeholder="输入您的注册邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            {error && (
              <div className="rounded-md bg-destructive/15 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="flex-1"
              >
                {isLoading ? '发送中...' : '发送重置链接'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
