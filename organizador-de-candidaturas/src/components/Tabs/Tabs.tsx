import { useState } from 'react'
import type { TabsProps } from './Tabs.types'

export function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      setActive((index + 1) % tabs.length)
    } else if (e.key === 'ArrowLeft') {
      setActive((index - 1 + tabs.length) % tabs.length)
    }
  }

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist" aria-label="Abas do perfil">
        {tabs.map((tab, index) => {
          const selected = index === active
          return (
            <button
              key={tab.label}
              type="button"
              role="tab"
              id={`tab-${index}`}
              aria-selected={selected}
              aria-controls={`tabpanel-${index}`}
              tabIndex={selected ? 0 : -1}
              className={`tabs__tab ${selected ? 'is-active' : ''}`}
              onClick={() => setActive(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          className="tabs__panel"
          hidden={index !== active}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
