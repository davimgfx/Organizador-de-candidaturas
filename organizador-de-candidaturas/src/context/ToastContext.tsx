import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ToastContext,
  type ToastItem,
  type ToastType,
} from './toast-context'

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3500) => {
      const id = nextId++
      setToasts((prev) => [...prev, { id, type, message }])
      window.setTimeout(() => removeToast(id), duration)
    },
    [removeToast],
  )

  const value = useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
