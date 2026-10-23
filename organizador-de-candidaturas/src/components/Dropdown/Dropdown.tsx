import { useEffect, useRef, useState } from 'react'
import type { DropdownOption, DropdownProps } from './Dropdown.types'

export function Dropdown({
  placeholder = 'Selecione...',
  options,
  value,
  onSelect,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder

  const handleSelect = (option: DropdownOption) => {
    onSelect(option)
    setOpen(false)
  }

  return (
    <div className="dropdown" ref={containerRef}>
      <button
        type="button"
        className="dropdown__toggle"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{selectedLabel}</span>
        <span
          className={`dropdown__arrow ${open ? 'is-open' : ''}`}
          aria-hidden="true"
        >
          ⌄
        </span>
      </button>

      {open && (
        <ul className="dropdown__menu" role="menu">
          {options.map((option) => (
            <li key={option.value} role="none">
              <button
                type="button"
                role="menuitem"
                className={`dropdown__item ${
                  option.value === value ? 'is-selected' : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
