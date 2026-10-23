import { useState } from 'react'
import type { AccordionProps } from './Accordion.types'

export function Accordion({ items, singleOpen = true }: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const toggle = (index: number) => {
    setOpenIndexes((prev) => {
      const isOpen = prev.includes(index)
      if (singleOpen) {
        return isOpen ? [] : [index]
      }
      return isOpen ? prev.filter((i) => i !== index) : [...prev, index]
    })
  }

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index)
        const panelId = `accordion-panel-${index}`
        const headerId = `accordion-header-${index}`
        return (
          <div
            key={item.title}
            className={`accordion__item ${isOpen ? 'is-open' : ''}`}
          >
            <h3 className="accordion__heading">
              <button
                type="button"
                id={headerId}
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
              >
                <span>{item.title}</span>
                <span className="accordion__chevron" aria-hidden="true">
                  ⌄
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className="accordion__panel"
              hidden={!isOpen}
            >
              <div className="accordion__panel-inner">{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
