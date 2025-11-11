'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface LogEntry {
  timestamp: string
  level: 'log' | 'error' | 'warn' | 'info'
  message: string
  data?: unknown
}

export function WalletLogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const logContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Intercept console.log, console.error, etc.
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn
    const originalInfo = console.info

    const addLog = (level: LogEntry['level'], ...args: unknown[]) => {
      const message = args
        .map(arg => {
          if (typeof arg === 'string') return arg
          if (typeof arg === 'object') return JSON.stringify(arg, null, 2)
          return String(arg)
        })
        .join(' ')

      setLogs(prev => {
        const newLog: LogEntry = {
          timestamp: new Date().toLocaleTimeString(),
          level,
          message,
          data: args.length > 1 ? args : args[0]
        }
        // Keep only last 50 logs
        return [...prev.slice(-49), newLog]
      })
    }

    console.log = (...args: unknown[]) => {
      originalLog(...args)
      // Only capture wallet-related logs
      const message = args[0]?.toString() || ''
      if (
        message.includes('🔧') ||
        message.includes('👻') ||
        message.includes('🔍') ||
        message.includes('🔘') ||
        message.includes('🔌') ||
        message.includes('📱') ||
        message.includes('🔄') ||
        message.includes('✅') ||
        message.includes('❌') ||
        message.includes('Wallet') ||
        message.includes('Phantom') ||
        message.includes('Solana')
      ) {
        addLog('log', ...args)
      }
    }

    console.error = (...args: unknown[]) => {
      originalError(...args)
      const message = args[0]?.toString() || ''
      if (
        message.includes('Wallet') ||
        message.includes('Phantom') ||
        message.includes('Solana') ||
        message.includes('adapter')
      ) {
        addLog('error', ...args)
      }
    }

    console.warn = (...args: unknown[]) => {
      originalWarn(...args)
      const message = args[0]?.toString() || ''
      if (
        message.includes('Wallet') ||
        message.includes('Phantom') ||
        message.includes('Solana')
      ) {
        addLog('warn', ...args)
      }
    }

    console.info = (...args: unknown[]) => {
      originalInfo(...args)
      const message = args[0]?.toString() || ''
      if (
        message.includes('Wallet') ||
        message.includes('Phantom') ||
        message.includes('Solana')
      ) {
        addLog('info', ...args)
      }
    }

    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
      console.info = originalInfo
    }
  }, [])

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white"
        size="sm"
      >
        📋 View Logs ({logs.length})
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-96 shadow-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Wallet Connection Logs</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => setLogs([])}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Clear
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              size="sm"
              variant="ghost"
              className="text-xs"
            >
              ✕
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div
          ref={logContainerRef}
          className="overflow-y-auto max-h-64 text-xs font-mono space-y-1"
        >
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No logs yet. Click &quot;Connect&quot; to see logs.
            </p>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded border-l-2 ${
                  log.level === 'error'
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : log.level === 'warn'
                    ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 text-[10px]">
                    {log.timestamp}
                  </span>
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap break-words">
                      {log.message}
                    </div>
                    {(() => {
                      if (log.data && typeof log.data === 'object') {
                        return (
                          <pre className="mt-1 text-[10px] opacity-75 overflow-x-auto">
                            {JSON.stringify(log.data as Record<string, unknown>, null, 2)}
                          </pre>
                        )
                      }
                      return null
                    })()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

