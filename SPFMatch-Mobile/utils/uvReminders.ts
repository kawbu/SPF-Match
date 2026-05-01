/**
 * UV reminder settings persistence and local notification scheduling.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import type { ReminderActivityLevel, UVReminderSettings } from '../types'

const UV_REMINDER_SETTINGS_STORAGE_KEY = 'spfmatch-mobile:uv-reminder-settings:v1'

export const DEFAULT_UV_REMINDER_SETTINGS: UVReminderSettings = {
  enabled: false,
  uvIndex: 6,
  activityLevel: 'commute-errands',
  lastUpdatedAt: new Date().toISOString(),
}

const ACTIVITY_MULTIPLIER: Record<ReminderActivityLevel, number> = {
  'mostly-indoors': 1.25,
  'commute-errands': 1,
  'outdoor-exercise': 0.75,
  'beach-pool': 0.6,
}

function uvBaseIntervalMinutes(uvIndex: number): number {
  if (uvIndex <= 2) return 240
  if (uvIndex <= 5) return 120
  if (uvIndex <= 7) return 90
  if (uvIndex <= 10) return 60
  return 45
}

function roundTo15(value: number): number {
  return Math.round(value / 15) * 15
}

export function getReminderIntervalMinutes(uvIndex: number, activity: ReminderActivityLevel): number {
  const base = uvBaseIntervalMinutes(uvIndex)
  const adjusted = base * ACTIVITY_MULTIPLIER[activity]
  const rounded = roundTo15(adjusted)
  return Math.min(240, Math.max(30, rounded))
}

export async function getUVReminderSettings(): Promise<UVReminderSettings> {
  const raw = await AsyncStorage.getItem(UV_REMINDER_SETTINGS_STORAGE_KEY)
  if (!raw) return DEFAULT_UV_REMINDER_SETTINGS

  try {
    const parsed = JSON.parse(raw) as Partial<UVReminderSettings>
    if (
      typeof parsed.enabled !== 'boolean'
      || typeof parsed.uvIndex !== 'number'
      || typeof parsed.activityLevel !== 'string'
    ) {
      return DEFAULT_UV_REMINDER_SETTINGS
    }

    return {
      enabled: parsed.enabled,
      uvIndex: Math.min(11, Math.max(0, Math.round(parsed.uvIndex))),
      activityLevel: parsed.activityLevel as ReminderActivityLevel,
      lastUpdatedAt: typeof parsed.lastUpdatedAt === 'string'
        ? parsed.lastUpdatedAt
        : DEFAULT_UV_REMINDER_SETTINGS.lastUpdatedAt,
    }
  } catch {
    return DEFAULT_UV_REMINDER_SETTINGS
  }
}

export async function saveUVReminderSettings(input: Omit<UVReminderSettings, 'lastUpdatedAt'>): Promise<UVReminderSettings> {
  const next: UVReminderSettings = {
    ...input,
    uvIndex: Math.min(11, Math.max(0, Math.round(input.uvIndex))),
    lastUpdatedAt: new Date().toISOString(),
  }

  await AsyncStorage.setItem(UV_REMINDER_SETTINGS_STORAGE_KEY, JSON.stringify(next))
  return next
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync()
  if (current.granted) return true

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  })

  return requested.granted
}

export async function hasNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync()
  return current.granted
}

export async function syncUVReminderSchedule(settings: UVReminderSettings): Promise<number | null> {
  await Notifications.cancelAllScheduledNotificationsAsync()

  if (!settings.enabled) return null

  const minutes = getReminderIntervalMinutes(settings.uvIndex, settings.activityLevel)
  const seconds = Math.max(60, minutes * 60)

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Reapply sunscreen',
      body: `UV ${settings.uvIndex} • ${minutes} min reminder based on your activity`,
      sound: true,
    },
    trigger: Platform.OS === 'android'
      ? {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          channelId: 'uv-reminders',
          repeats: true,
          seconds,
        }
      : {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          repeats: true,
          seconds,
        },
  })

  return minutes
}
