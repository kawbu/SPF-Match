import type { CheckInMetricId } from '../types'

export const CHECK_IN_STORAGE_KEY = 'spfmatch-mobile:daily-check-ins:v1'

export const CHECK_IN_LEVELS = [
  { label: 'None', value: 0 },
  { label: 'Mild', value: 1 },
  { label: 'Moderate', value: 2 },
  { label: 'High', value: 3 },
  { label: 'Severe', value: 4 },
] as const

export const CHECK_IN_QUESTIONS: {
  id: CheckInMetricId
  title: string
  helper: string
}[] = [
  {
    id: 'irritation',
    title: 'How irritated did your skin feel today?',
    helper: 'Think about stinging, burning, or general sensitivity.',
  },
  {
    id: 'dryness',
    title: 'How dry or tight did your skin feel today?',
    helper: 'Consider flaking, rough texture, or tightness after cleansing.',
  },
  {
    id: 'oiliness',
    title: 'How oily did your skin feel today?',
    helper: 'Think about excess shine or feeling greasy throughout the day.',
  },
  {
    id: 'breakouts',
    title: 'How active were your breakouts today?',
    helper: 'Include clogged pores, inflamed bumps, or new blemishes.',
  },
] as const

export const CHECK_IN_LEVEL_LABELS = CHECK_IN_LEVELS.map((level) => level.label)

export const METRIC_LABELS: Record<CheckInMetricId, string> = {
  irritation: 'Irritation',
  dryness: 'Dryness',
  oiliness: 'Oiliness',
  breakouts: 'Breakouts',
}

export function getLevelValue(label: string): number {
  return CHECK_IN_LEVELS.find((level) => level.label === label)?.value ?? 0
}

export function getLevelLabel(value: number): string {
  return CHECK_IN_LEVELS.find((level) => level.value === value)?.label ?? 'None'
}