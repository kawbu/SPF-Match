import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react-native'

export type IconComponent = ComponentType<LucideProps>

export type DayOption = {
  id: string
  label: string
  active: boolean
}

export type PeriodOption = 'Day' | 'Week' | 'Month' | 'All'

export type Metric = {
  label: string
  Icon: IconComponent
  iconColor: string
}

export type NavTab = {
  id: string
  Icon: IconComponent
}
