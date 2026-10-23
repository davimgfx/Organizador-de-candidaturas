export interface DropdownOption {
  label: string
  value: string
}

export interface DropdownProps {
  placeholder?: string
  options: DropdownOption[]
  value?: string
  onSelect: (option: DropdownOption) => void
}
