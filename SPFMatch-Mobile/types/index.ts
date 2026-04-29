export interface SunscreenProduct {
  name: string
  filterType: string
  spf: number
  vehicle: string
  tint: string
  price: number
  size: number
  description: string
  link: string
  unitPrice: number
  fitzpatrickScale: string
  skinTypes: string[]
  image?: string
}

export type SkinType = 'normal' | 'oily' | 'dry' | 'combination' | 'sensitive'
export type FitzpatrickType = 1 | 2 | 3 | 4 | 5 | 6

export interface QuizAnswers {
  [key: string]: string | string[]
}

export type CheckInMetricId = 'irritation' | 'dryness' | 'oiliness' | 'breakouts'

export interface DailyCheckInEntry {
  date: string
  irritation: number
  dryness: number
  oiliness: number
  breakouts: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export type DailyCheckInDraft = Partial<Record<CheckInMetricId, string>>

export type ReminderActivityLevel =
  | 'mostly-indoors'
  | 'commute-errands'
  | 'outdoor-exercise'
  | 'beach-pool'

export interface UVReminderSettings {
  enabled: boolean
  uvIndex: number
  activityLevel: ReminderActivityLevel
  lastUpdatedAt: string
}
