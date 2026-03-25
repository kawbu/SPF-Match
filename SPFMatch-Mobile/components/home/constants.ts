import {
  Activity,
  AlarmClock,
  CalendarDays,
  ClipboardPen,
  ShoppingCart,
  Sun,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native'
import type { DayOption, Metric, NavTab, PeriodOption } from './types'

export const DAYS: DayOption[] = [
  { id: 'mon', label: 'M', active: false },
  { id: 'tue', label: 'T', active: true },
  { id: 'wed', label: 'W', active: false },
  { id: 'thu', label: 'T', active: true },
  { id: 'fri', label: 'F', active: true },
  { id: 'sat', label: 'S', active: true },
  { id: 'sun', label: 'S', active: false },
]

export const PERIODS: PeriodOption[] = ['Day', 'Week', 'Month', 'All']

export const METRICS: Metric[] = [
  { label: 'Irritation', Icon: TrendingDown, iconColor: '#FDF0E6' },
  { label: 'Breakouts', Icon: Activity, iconColor: '#FFFFFF' },
  { label: 'Redness', Icon: TrendingDown, iconColor: '#FFFFFF' },
  { label: 'Oiliness', Icon: TrendingUp, iconColor: '#FFFFFF' },
]

export const NAV_TABS: NavTab[] = [
  { id: 'reminder', Icon: AlarmClock },
  { id: 'shop', Icon: ShoppingCart },
  { id: 'home', Icon: Sun },
  { id: 'journal', Icon: ClipboardPen },
  { id: 'calendar', Icon: CalendarDays },
]
