export interface AccordionItem {
  title: string
  content: string
}

export interface AccordionProps {
  items: AccordionItem[]
  singleOpen?: boolean
}
