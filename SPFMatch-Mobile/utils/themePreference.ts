/**
 * Persists and resolves theme override behavior for day/night UI variants.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ThemeOverrideMode = 'auto' | 'day' | 'night'

const THEME_PREFERENCE_STORAGE_KEY = 'spfmatch-mobile:theme-override:v1'

export async function getThemeOverridePreference(): Promise<ThemeOverrideMode> {
  try {
    const stored = await AsyncStorage.getItem(THEME_PREFERENCE_STORAGE_KEY)
    if (stored === 'auto' || stored === 'day' || stored === 'night') {
      return stored
    }
  } catch {
    // Missing storage should not block rendering; default to auto mode.
  }

  return 'auto'
}

export async function setThemeOverridePreference(mode: ThemeOverrideMode): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, mode)
  } catch {
    // Preference write failures are safe to ignore and retry later.
  }
}

export function isNightThemeActive(mode: ThemeOverrideMode, now: Date): boolean {
  if (mode === 'day') return false
  if (mode === 'night') return true

  const hour = now.getHours()
  return hour >= 19 || hour < 6
}
