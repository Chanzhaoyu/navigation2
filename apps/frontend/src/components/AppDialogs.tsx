import { useState } from 'react'
import { Grid3X3, Calendar, Copy, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import jsonToTs from 'json-to-ts'
import QRCode from 'qrcode'

export function AppCenterDialog() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('json-to-ts')
  const [jsonInput, setJsonInput] = useState('')
  const [tsOutput, setTsOutput] = useState('')
  const [qrInput, setQrInput] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')

  const handleJsonToTs = () => {
    try {
      const json = JSON.parse(jsonInput)
      const tsTypes = jsonToTs(json)
      setTsOutput(tsTypes.join('\n\n'))
    } catch (error) {
      setTsOutput('错误: 请输入有效的 JSON 格式')
    }
  }

  const handleGenerateQR = async () => {
    try {
      const url = await QRCode.toDataURL(qrInput, {
        width: 200,
        margin: 2,
      })
      setQrDataUrl(url)
    } catch (error) {
      console.error('生成二维码失败:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = qrDataUrl
      link.click()
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Grid3X3 className="h-4 w-4" />
        <span className="hidden md:inline ml-2">应用中心</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-7xl sm:max-w-7xl max-h-[95vh] overflow-hidden w-[95vw]">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Grid3X3 className="h-6 w-6 text-primary" />
              </div>
              应用中心
            </DialogTitle>
            <p className="text-muted-foreground mt-2">
              精选实用工具，提升开发效率
            </p>
          </DialogHeader>
          
          <div className="flex w-full h-[calc(90vh-10rem)]">
            {/* 左侧菜单 */}
            <div className="w-64 border-r bg-muted/30 flex-shrink-0">
              <div className="p-3 space-y-1">
                <Button
                  variant={activeTab === 'json-to-ts' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('json-to-ts')}
                >
                  <span className="mr-2">⚡</span>
                  JSON to TS
                </Button>
                <Button
                  variant={activeTab === 'qr-generator' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('qr-generator')}
                >
                  <span className="mr-2">📱</span>
                  二维码生成
                </Button>
              </div>
            </div>
            
            {/* 右侧内容 */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'json-to-ts' && (
                <div className="p-4 h-full">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">JSON to TypeScript 转换器</h3>
                      <p className="text-muted-foreground text-sm">将 JSON 数据转换为 TypeScript 类型定义</p>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4">
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium">JSON 输入</label>
                        <Textarea
                          placeholder="请输入 JSON 数据...&#10;例如：&#10;{&#10;  &quot;user&quot;: {&#10;    &quot;name&quot;: &quot;张三&quot;,&#10;    &quot;age&quot;: 25,&#10;    &quot;tags&quot;: [&quot;前端&quot;, &quot;React&quot;]&#10;  }&#10;}"
                          value={jsonInput}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJsonInput(e.target.value)}
                          className="min-h-[400px] font-mono text-sm"
                        />
                      </div>
                      
                      <div className="col-span-1 space-y-2 pt-6">
                        <Button onClick={handleJsonToTs} disabled={!jsonInput} className="w-full">
                          <span className="mr-2">⚡</span>
                          转换
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setJsonInput('')
                            setTsOutput('')
                          }}
                          className="w-full"
                        >
                          清空
                        </Button>
                      </div>
                      
                      <div className="col-span-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">TypeScript 输出</label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(tsOutput)}
                            disabled={!tsOutput}
                            className="gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            复制
                          </Button>
                        </div>
                        <Textarea
                          placeholder="转换后的 TypeScript 类型定义将在这里显示..."
                          value={tsOutput}
                          readOnly
                          className="min-h-[400px] font-mono text-sm bg-muted/30"
                        />
                      </div>
                    </div>
                    
                    {tsOutput && (
                      <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                        💡 提示：生成的类型定义可以直接在 TypeScript 项目中使用
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'qr-generator' && (
                <div className="p-4 h-full">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">二维码生成器</h3>
                      <p className="text-muted-foreground text-sm">快速生成二维码，支持文本、URL 等内容</p>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4">
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium">输入内容</label>
                        <div className="space-y-3">
                          <Input
                            placeholder="请输入要生成二维码的内容..."
                            value={qrInput}
                            onChange={(e) => setQrInput(e.target.value)}
                            className="h-12 text-base"
                          />
                          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg min-h-[350px] flex items-start">
                            💡 可以输入网址、文本、联系方式等任何内容
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-1 space-y-2 pt-6">
                        <Button 
                          onClick={handleGenerateQR} 
                          disabled={!qrInput}
                          className="w-full"
                        >
                          <span className="mr-2">📱</span>
                          生成
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setQrInput('')
                            setQrDataUrl('')
                          }}
                          className="w-full"
                        >
                          清空
                        </Button>
                      </div>
                      
                      <div className="col-span-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">二维码输出</label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadQR}
                            disabled={!qrDataUrl}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            下载
                          </Button>
                        </div>
                        <div className="border-2 border-dashed rounded-xl p-6 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
                          {qrDataUrl ? (
                            <div className="text-center space-y-4">
                              <div className="bg-white p-4 rounded-lg inline-block shadow-lg">
                                <img src={qrDataUrl} alt="Generated QR Code" className="max-w-full" />
                              </div>
                              <div className="text-sm text-muted-foreground">
                                扫描二维码或点击下载按钮保存图片
                              </div>
                            </div>
                          ) : (
                            <div className="text-center space-y-3">
                              <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
                                <span className="text-2xl">📱</span>
                              </div>
                              <p className="text-muted-foreground">输入内容后点击生成按钮</p>
                              <p className="text-sm text-muted-foreground">二维码将在这里显示</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function CalendarDialog() {
  const [open, setOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showYearMonth, setShowYearMonth] = useState(false)

  // 获取当月第一天是星期几 (0 = 周日, 1 = 周一, ...)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  // 获取当月天数
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  // 获取上个月天数
  const getDaysInPrevMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate()
  }

  const today = new Date()
  const currentMonth = currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
  const firstDay = getFirstDayOfMonth(currentDate)
  const daysInMonth = getDaysInMonth(currentDate)
  const daysInPrevMonth = getDaysInPrevMonth(currentDate)

  // 生成日历数组
  const calendarDays = []
  
  // 上个月的尾部日期
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false
    })
  }
  
  // 当月日期
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = 
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      day === today.getDate()
    
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday
    })
  }
  
  // 下个月的开头日期
  const remainingCells = 42 - calendarDays.length // 6行 x 7列
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const selectDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(selected)
  }

  const changeYear = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth()))
  }

  const changeMonth = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month))
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Calendar className="h-4 w-4" />
        <span className="hidden md:inline ml-2">日历</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              日历
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 年月选择 */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                {showYearMonth ? (
                  <div className="flex items-center gap-2">
                    <select 
                      value={currentDate.getFullYear()} 
                      onChange={(e) => changeYear(parseInt(e.target.value))}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      {Array.from({length: 21}, (_, i) => new Date().getFullYear() - 10 + i).map(year => (
                        <option key={year} value={year}>{year}年</option>
                      ))}
                    </select>
                    <select 
                      value={currentDate.getMonth()} 
                      onChange={(e) => changeMonth(parseInt(e.target.value))}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      {Array.from({length: 12}, (_, i) => i).map(month => (
                        <option key={month} value={month}>{month + 1}月</option>
                      ))}
                    </select>
                    <Button variant="ghost" size="sm" onClick={() => setShowYearMonth(false)}>
                      确定
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => setShowYearMonth(true)} className="font-medium">
                      {currentMonth}
                    </Button>
                    {/* 回到今天按钮 - 仅在不是当前月份时显示 */}
                    {(currentDate.getFullYear() !== today.getFullYear() || 
                      currentDate.getMonth() !== today.getMonth()) && (
                      <Button variant="outline" size="sm" onClick={goToToday} className="text-xs px-2 py-1 h-7">
                        今天
                      </Button>
                    )}
                  </>
                )}
              </div>
              
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
              <div>日</div>
              <div>一</div>
              <div>二</div>
              <div>三</div>
              <div>四</div>
              <div>五</div>
              <div>六</div>
            </div>

            {/* 日历网格 */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const isSelected = selectedDate && 
                  date.isCurrentMonth &&
                  selectedDate.getFullYear() === currentDate.getFullYear() &&
                  selectedDate.getMonth() === currentDate.getMonth() &&
                  selectedDate.getDate() === date.day
                
                return (
                  <div
                    key={index}
                    onClick={() => selectDate(date.day, date.isCurrentMonth)}
                    className={`
                      h-8 w-8 flex items-center justify-center text-sm rounded-md cursor-pointer transition-colors
                      ${date.isCurrentMonth ? 'text-foreground hover:bg-muted' : 'text-muted-foreground hover:bg-muted/50'}
                      ${date.isToday ? 'bg-primary text-primary-foreground font-medium' : ''}
                      ${isSelected && !date.isToday ? 'bg-secondary text-secondary-foreground' : ''}
                    `}
                  >
                    {date.day}
                  </div>
                )
              })}
            </div>

            {/* 今日信息 */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">今日</div>
                <div className="text-xs text-muted-foreground">
                  {today.toLocaleDateString('zh-CN')}
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">
                  {selectedDate ? '已选择' : '星期'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedDate 
                    ? selectedDate.toLocaleDateString('zh-CN') 
                    : today.toLocaleDateString('zh-CN', { weekday: 'long' })
                  }
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
