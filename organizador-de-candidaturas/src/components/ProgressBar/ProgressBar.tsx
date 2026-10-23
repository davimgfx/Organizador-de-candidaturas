import type { ProgressBarProps } from './ProgressBar.types'

export function ProgressBar({
  value,
  label = 'Progresso',
  showPercentage = true,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))

  return (
    <div className="progress">
      <div className="progress__meta">
        <span className="progress__label">{label}</span>
        {showPercentage && (
          <span className="progress__value">{clamped}%</span>
        )}
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className="progress__fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
