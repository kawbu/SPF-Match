import AsyncStorage from '@react-native-async-storage/async-storage'
import { CHECK_IN_STORAGE_KEY, METRIC_LABELS, getLevelLabel } from '../constants/checkIn'
import type { CheckInMetricId, DailyCheckInEntry } from '../types'

type Period = 'Day' | 'Week' | 'Month' | 'All'

const DAY_MS = 24 * 60 * 60 * 1000
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

type MetricSummary = {
  id: CheckInMetricId
  label: string
  value: number
  valueLabel: string
  subtitle: string
}

export type HomeCheckInSummary = {
  days: { label: string; active: boolean }[]
  streak: number
  record: number
  checkedInToday: boolean
  metricCards: MetricSummary[]
  chartData: number[]
  chartLabels: string[]
  latestEntry: DailyCheckInEntry | null
}

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function shiftDate(baseDate: Date, days: number): Date {
  const nextDate = new Date(baseDate)
  nextDate.setHours(12, 0, 0, 0)
  nextDate.setTime(nextDate.getTime() + days * DAY_MS)
  return nextDate
}

function startOfWeekMonday(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(12, 0, 0, 0)
  const day = copy.getDay()
  const delta = day === 0 ? -6 : 1 - day
  return shiftDate(copy, delta)
}

function generateMockHistory(): DailyCheckInEntry[] {
  const today = new Date()
  const samples = [
    { daysAgo: 12, irritation: 1, dryness: 2, oiliness: 1, breakouts: 1 },
    { daysAgo: 11, irritation: 1, dryness: 1, oiliness: 2, breakouts: 1 },
    { daysAgo: 10, irritation: 2, dryness: 1, oiliness: 2, breakouts: 2 },
    { daysAgo: 8, irritation: 2, dryness: 3, oiliness: 1, breakouts: 1 },
    { daysAgo: 7, irritation: 1, dryness: 2, oiliness: 2, breakouts: 1 },
    { daysAgo: 6, irritation: 1, dryness: 1, oiliness: 2, breakouts: 0 },
    { daysAgo: 5, irritation: 2, dryness: 2, oiliness: 3, breakouts: 1 },
    { daysAgo: 4, irritation: 1, dryness: 2, oiliness: 2, breakouts: 1 },
    { daysAgo: 3, irritation: 1, dryness: 1, oiliness: 1, breakouts: 1 },
    { daysAgo: 2, irritation: 0, dryness: 1, oiliness: 1, breakouts: 0 },
    { daysAgo: 1, irritation: 1, dryness: 1, oiliness: 2, breakouts: 1 },
  ]

  return samples
    .map((sample) => {
      const date = shiftDate(today, -sample.daysAgo)
      const isoStamp = date.toISOString()

      return {
        date: toLocalDateKey(date),
        irritation: sample.irritation,
        dryness: sample.dryness,
        oiliness: sample.oiliness,
        breakouts: sample.breakouts,
        createdAt: isoStamp,
        updatedAt: isoStamp,
      }
    })
    .sort((left, right) => left.date.localeCompare(right.date))
}

function sortEntries(entries: DailyCheckInEntry[]): DailyCheckInEntry[] {
  return [...entries].sort((left, right) => left.date.localeCompare(right.date))
}

export async function getCheckInHistory(): Promise<DailyCheckInEntry[]> {
  const rawHistory = await AsyncStorage.getItem(CHECK_IN_STORAGE_KEY)
  if (!rawHistory) {
    const mockHistory = generateMockHistory()
    await AsyncStorage.setItem(CHECK_IN_STORAGE_KEY, JSON.stringify(mockHistory))
    return mockHistory
  }

  try {
    const parsed = JSON.parse(rawHistory) as DailyCheckInEntry[]
    return sortEntries(parsed)
  } catch {
    const mockHistory = generateMockHistory()
    await AsyncStorage.setItem(CHECK_IN_STORAGE_KEY, JSON.stringify(mockHistory))
    return mockHistory
  }
}

export async function saveDailyCheckIn(
  input: Omit<DailyCheckInEntry, 'date' | 'createdAt' | 'updatedAt'>,
): Promise<DailyCheckInEntry[]> {
  const currentHistory = await getCheckInHistory()
  const today = new Date()
  const todayKey = toLocalDateKey(today)
  const timeStamp = today.toISOString()
  const existingEntry = currentHistory.find((entry) => entry.date === todayKey)

  const nextEntry: DailyCheckInEntry = {
    date: todayKey,
    irritation: input.irritation,
    dryness: input.dryness,
    oiliness: input.oiliness,
    breakouts: input.breakouts,
    notes: input.notes,
    createdAt: existingEntry?.createdAt ?? timeStamp,
    updatedAt: timeStamp,
  }

  const nextHistory = sortEntries([
    ...currentHistory.filter((entry) => entry.date !== todayKey),
    nextEntry,
  ])

  await AsyncStorage.setItem(CHECK_IN_STORAGE_KEY, JSON.stringify(nextHistory))
  return nextHistory
}

export function getTodayCheckIn(entries: DailyCheckInEntry[]): DailyCheckInEntry | null {
  const todayKey = toLocalDateKey(new Date())
  return entries.find((entry) => entry.date === todayKey) ?? null
}

function getMostRecentEntry(entries: DailyCheckInEntry[]): DailyCheckInEntry | null {
  return entries.length > 0 ? entries[entries.length - 1] : null
}

function getEntryTotal(entry: DailyCheckInEntry): number {
  return entry.irritation + entry.dryness + entry.oiliness + entry.breakouts
}

function getStreaks(entries: DailyCheckInEntry[]): { streak: number; record: number } {
  const sortedEntries = sortEntries(entries)
  const entryDates = new Set(sortedEntries.map((entry) => entry.date))
  const latestEntry = getMostRecentEntry(sortedEntries)

  let streak = 0
  if (latestEntry) {
    let pointer = new Date(`${latestEntry.date}T12:00:00`)
    while (entryDates.has(toLocalDateKey(pointer))) {
      streak += 1
      pointer = shiftDate(pointer, -1)
    }
  }

  let record = 0
  let running = 0
  let previousDate: string | null = null
  for (const entry of sortedEntries) {
    if (!previousDate) {
      running = 1
    } else {
      const previous = new Date(`${previousDate}T12:00:00`)
      const expected = toLocalDateKey(shiftDate(previous, 1))
      running = entry.date === expected ? running + 1 : 1
    }
    previousDate = entry.date
    record = Math.max(record, running)
  }

  return { streak, record }
}

function getWeekDayStates(entries: DailyCheckInEntry[]): { label: string; active: boolean }[] {
  const weekStart = startOfWeekMonday(new Date())
  const entryDates = new Set(entries.map((entry) => entry.date))

  return DAY_LABELS.map((label, index) => {
    const date = shiftDate(weekStart, index)
    return {
      label,
      active: entryDates.has(toLocalDateKey(date)),
    }
  })
}

function buildRangeLabels(startDate: Date, length: number): string[] {
  return Array.from({ length }, (_, index) => {
    const date = shiftDate(startDate, index)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })
}

function buildWeekdayLabels(startDate: Date, length: number): string[] {
  return Array.from({ length }, (_, index) => {
    const date = shiftDate(startDate, index)
    return DAY_LABELS[(date.getDay() + 6) % 7]
  })
}

function buildChart(entries: DailyCheckInEntry[], period: Period): { data: number[]; labels: string[] } {
  const entryMap = new Map(entries.map((entry) => [entry.date, entry]))

  if (period === 'All') {
    return {
      data: entries.map(getEntryTotal),
      labels: entries.map((entry) => {
        const date = new Date(`${entry.date}T12:00:00`)
        return `${date.getMonth() + 1}/${date.getDate()}`
      }),
    }
  }

  const today = new Date()
  const rangeLength = period === 'Month' ? 30 : period === 'Week' ? 7 : 1
  const rangeStart = shiftDate(today, -(rangeLength - 1))
  const labels = period === 'Week'
    ? buildWeekdayLabels(rangeStart, rangeLength)
    : buildRangeLabels(rangeStart, rangeLength)

  const data = Array.from({ length: rangeLength }, (_, index) => {
    const dateKey = toLocalDateKey(shiftDate(rangeStart, index))
    const entry = entryMap.get(dateKey)
    return entry ? getEntryTotal(entry) : 0
  })

  return { data, labels }
}

function formatMetricSubtitle(value: number, average: number): string {
  if (average === 0) {
    return value === 0 ? 'Steady baseline' : 'First data point logged'
  }

  if (value === average) return 'Matching recent average'
  return value > average ? 'Above 7-day average' : 'Below 7-day average'
}

function buildMetricCards(entries: DailyCheckInEntry[]): MetricSummary[] {
  const latestEntry = getMostRecentEntry(entries)
  const recentEntries = entries.slice(-7)

  return (Object.keys(METRIC_LABELS) as CheckInMetricId[]).map((metricId) => {
    const value = latestEntry?.[metricId] ?? 0
    const average = recentEntries.length > 0
      ? Math.round(
          recentEntries.reduce((sum, entry) => sum + entry[metricId], 0) / recentEntries.length,
        )
      : 0

    return {
      id: metricId,
      label: METRIC_LABELS[metricId],
      value,
      valueLabel: getLevelLabel(value),
      subtitle: formatMetricSubtitle(value, average),
    }
  })
}

export function buildHomeCheckInSummary(
  entries: DailyCheckInEntry[],
  period: Period,
): HomeCheckInSummary {
  const sortedEntries = sortEntries(entries)
  const latestEntry = getMostRecentEntry(sortedEntries)
  const { streak, record } = getStreaks(sortedEntries)
  const chart = buildChart(sortedEntries, period)

  return {
    days: getWeekDayStates(sortedEntries),
    streak,
    record,
    checkedInToday: getTodayCheckIn(sortedEntries) !== null,
    metricCards: buildMetricCards(sortedEntries),
    chartData: chart.data,
    chartLabels: chart.labels,
    latestEntry,
  }
}