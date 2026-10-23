import { useToast } from '../../context/toast-context'
import type { ToastVisualMap } from './Toast.types'

const ICONS: ToastVisualMap = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
}

const LABELS: ToastVisualMap = {
  success: 'Sucesso',
  error: 'Erro',
  info: 'Informação',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          role={toast.type === 'error' ? 'alert' : 'status'}
        >
          <span className="toast__icon" aria-hidden="true">
            {ICONS[toast.type]}
          </span>
          <div className="toast__body">
            <strong className="toast__title">{LABELS[toast.type]}</strong>
            <p className="toast__message">{toast.message}</p>
          </div>
          <button
            type="button"
            className="toast__close"
            aria-label="Fechar notificação"
            onClick={() => removeToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
