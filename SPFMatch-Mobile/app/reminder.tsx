import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Location from 'expo-location'
import { LinearGradient } from 'expo-linear-gradient'
import { Stack, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomNav } from '../components/home/BottomNav'
import {
  DEFAULT_UV_REMINDER_SETTINGS,
  ensureNotificationPermission,
  getReminderIntervalMinutes,
  hasNotificationPermission,
  getUVReminderSettings,
  saveUVReminderSettings,
  syncUVReminderSchedule,
} from '../utils/uvReminders'
import {
  getThemeOverridePreference,
  isNightThemeActive,
  type ThemeOverrideMode,
} from '../utils/themePreference'
import type { ReminderActivityLevel } from '../types'

const ACTIVITY_OPTIONS: Array<{ id: ReminderActivityLevel; label: string; subtitle: string }> = [
  { id: 'mostly-indoors', label: 'Mostly indoors', subtitle: 'Office or home most of day' },
  { id: 'commute-errands', label: 'Commute / errands', subtitle: 'Short outdoor exposure' },
  { id: 'outdoor-exercise', label: 'Outdoor exercise', subtitle: 'Walk, run, sports' },
  { id: 'beach-pool', label: 'Beach / pool', subtitle: 'Longest sun exposure' },
]

const UV_LEVELS = Array.from({ length: 12 }, (_, i) => i)

function getUvBandLabel(uv: number): string {
  if (uv <= 2) return 'Low'
  if (uv <= 5) return 'Moderate'
  if (uv <= 7) return 'High'
  if (uv <= 10) return 'Very High'
  return 'Extreme'
}

export default function ReminderScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [isHydrated, setIsHydrated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isFetchingUV, setIsFetchingUV] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [pendingScheduleCount, setPendingScheduleCount] = useState(0)
  const [uvUpdatedAtLabel, setUvUpdatedAtLabel] = useState<string | null>(null)
  const [fetchedLocationLabel, setFetchedLocationLabel] = useState<string | null>(null)
  const [detectedUvLabel, setDetectedUvLabel] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())
  const [themeOverride, setThemeOverride] = useState<ThemeOverrideMode>('auto')

  const [enabled, setEnabled] = useState(DEFAULT_UV_REMINDER_SETTINGS.enabled)
  const [uvIndex, setUvIndex] = useState(DEFAULT_UV_REMINDER_SETTINGS.uvIndex)
  const [activityLevel, setActivityLevel] = useState<ReminderActivityLevel>(
    DEFAULT_UV_REMINDER_SETTINGS.activityLevel,
  )

  useEffect(() => {
    async function hydrate() {
      const settings = await getUVReminderSettings()
      setEnabled(settings.enabled)
      setUvIndex(settings.uvIndex)
      setActivityLevel(settings.activityLevel)

      const allowed = await hasNotificationPermission().catch(() => false)
      setPermissionGranted(allowed)
      const scheduled = await Notifications.getAllScheduledNotificationsAsync().catch(() => [])
      setPendingScheduleCount(scheduled.length)
      setIsHydrated(true)
    }

    hydrate()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    getThemeOverridePreference().then(setThemeOverride)
  }, [])

  const isNightTheme = isNightThemeActive(themeOverride, now)
  const theme = useMemo(
    () => (isNightTheme
      ? {
          gradientColors: ['#0B1022', '#131C3D', '#1B244A'],
          kickerColor: 'rgba(214,226,255,0.78)',
          subtitleColor: 'rgba(224,232,255,0.82)',
          cardBg: 'rgba(120,140,210,0.18)',
          cardBorder: 'rgba(176,198,255,0.36)',
          summaryBg: 'rgba(96,133,238,0.24)',
          summaryBorder: 'rgba(170,196,255,0.55)',
        }
      : {
          gradientColors: ['#8A2A1F', '#CF6A28', '#B3352B'],
          kickerColor: 'rgba(255,255,255,0.8)',
          subtitleColor: 'rgba(255,255,255,0.82)',
          cardBg: 'rgba(255,255,255,0.14)',
          cardBorder: 'rgba(255,255,255,0.3)',
          summaryBg: 'rgba(120,255,190,0.18)',
          summaryBorder: 'rgba(170,255,210,0.55)',
        }),
    [isNightTheme],
  )

  const recommendedInterval = useMemo(
    () => getReminderIntervalMinutes(uvIndex, activityLevel),
    [uvIndex, activityLevel],
  )

  const handleToggleEnabled = async (nextValue: boolean) => {
    if (!nextValue) {
      setEnabled(false)
      return
    }

    const allowed = await ensureNotificationPermission().catch(() => false)
    setPermissionGranted(allowed)
    if (!allowed) {
      setEnabled(false)
      return
    }

    setEnabled(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      let canNotify = permissionGranted
      if (enabled && !permissionGranted) {
        canNotify = await ensureNotificationPermission().catch(() => false)
        setPermissionGranted(canNotify)
      }

      const persisted = await saveUVReminderSettings({
        enabled: enabled && canNotify,
        uvIndex,
        activityLevel,
      })

      await syncUVReminderSchedule(persisted)
      const scheduled = await Notifications.getAllScheduledNotificationsAsync().catch(() => [])
      setPendingScheduleCount(scheduled.length)
      setEnabled(persisted.enabled)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendTestNotification = async () => {
    setIsTesting(true)
    try {
      const allowed = await ensureNotificationPermission().catch(() => false)
      setPermissionGranted(allowed)
      if (!allowed) {
        Alert.alert('Notifications disabled', 'Please allow notifications in iOS Settings to run the test.')
        return
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reapply sunscreen',
          body: `UV ${uvIndex} • ${recommendedInterval} min reminder based on your activity`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 10,
        },
      })

      Alert.alert('Preview scheduled', 'You should receive the regular reminder look in about 10 seconds.')
    } finally {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync().catch(() => [])
      setPendingScheduleCount(scheduled.length)
      setIsTesting(false)
    }
  }

  const handleAutoDetectUV = async () => {
    setIsFetchingUV(true)
    try {
      const locationPermission = await Location.requestForegroundPermissionsAsync()
      if (locationPermission.status !== 'granted') {
        Alert.alert('Location needed', 'Allow location permission so we can fetch your local UV index.')
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      const { latitude, longitude } = currentLocation.coords

      const places = await Location.reverseGeocodeAsync({ latitude, longitude }).catch(() => [])
      const place = places[0]
      const placeName = place
        ? [place.city ?? place.district, place.region].filter(Boolean).join(', ')
        : null

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=uv_index&timezone=auto`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Open-Meteo request failed: ${response.status}`)
      }

      const payload = await response.json() as {
        current?: { uv_index?: number }
      }

      const rawUv = payload.current?.uv_index
      if (typeof rawUv !== 'number' || Number.isNaN(rawUv)) {
        throw new Error('UV index missing in Open-Meteo response')
      }

      const rounded = Math.min(11, Math.max(0, Math.round(rawUv)))
      setUvIndex(rounded)
      setDetectedUvLabel(`Detected UV ${rawUv.toFixed(1)} (${getUvBandLabel(rawUv)})`)
      setFetchedLocationLabel(
        placeName
          ? `Location: ${placeName}`
          : `Location: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
      )
      setUvUpdatedAtLabel(`Live UV updated at ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`)
    } catch {
      Alert.alert('Could not fetch UV', 'Please try again or set UV manually.')
    } finally {
      setIsFetchingUV(false)
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <LinearGradient
        colors={theme.gradientColors as [string, string, string]}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back to home"
            style={styles.backButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>

          <Text style={[styles.kicker, { color: theme.kickerColor }]}>UV-Based Reminders</Text>
          <Text style={styles.title}>Smart sunscreen reminder widget</Text>
          <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>
            Opt in to notifications, set the current UV index, and tell us your activity level.
            We adjust reminder frequency automatically.
          </Text>

          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}> 
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Start reapplication reminders</Text>
                <Text style={styles.cardSub}>Enable timed sunscreen reminders on this device</Text>
              </View>
              <Switch
                value={enabled}
                onValueChange={handleToggleEnabled}
                trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#FF9A44' }}
                thumbColor={enabled ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>
            {!permissionGranted && enabled ? (
              <Text style={styles.warningText}>
                Notifications are blocked in system settings. Enable them in iOS Settings.
              </Text>
            ) : null}
          </View>

          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}> 
            <Text style={styles.cardTitle}>Current UV index</Text>
            <Text style={styles.cardSub}>Higher UV = more frequent reminders</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.secondaryButton, isFetchingUV && styles.primaryButtonDisabled]}
              onPress={handleAutoDetectUV}
              disabled={isFetchingUV}
            >
              <Text style={styles.secondaryButtonText}>
                {isFetchingUV ? 'Fetching live UV...' : 'Use my location (Open-Meteo)'}
              </Text>
            </TouchableOpacity>

            {uvUpdatedAtLabel ? (
              <Text style={styles.cardSub}>{uvUpdatedAtLabel}</Text>
            ) : null}

            {fetchedLocationLabel ? (
              <Text style={styles.cardSub}>{fetchedLocationLabel}</Text>
            ) : null}

            {detectedUvLabel ? (
              <Text style={styles.cardSub}>{detectedUvLabel}</Text>
            ) : null}

            <View style={styles.uvWrap}>
              {UV_LEVELS.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[styles.uvChip, uvIndex === value && styles.uvChipActive]}
                  onPress={() => setUvIndex(value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.uvChipText, uvIndex === value && styles.uvChipTextActive]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}> 
            <Text style={styles.cardTitle}>Reported activity</Text>
            <Text style={styles.cardSub}>Activity exposure changes reminder frequency</Text>

            <View style={styles.activityWrap}>
              {ACTIVITY_OPTIONS.map((option) => {
                const selected = activityLevel === option.id
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.activityItem, selected && styles.activityItemActive]}
                    onPress={() => setActivityLevel(option.id)}
                    activeOpacity={0.82}
                  >
                    <Text style={[styles.activityTitle, selected && styles.activityTitleActive]}>
                      {option.label}
                    </Text>
                    <Text style={styles.activitySub}>{option.subtitle}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: theme.summaryBg, borderColor: theme.summaryBorder }]}> 
            <Text style={styles.summaryLabel}>Recommended reminder interval</Text>
            <Text style={styles.summaryValue}>{recommendedInterval} minutes</Text>
            <Text style={styles.summaryFootnote}>
              Based on UV {uvIndex} and {activityLevel.replace('-', ' ')}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}> 
            <Text style={styles.cardTitle}>Notification timer test</Text>
            <Text style={styles.cardSub}>
              Pending scheduled notifications: {pendingScheduleCount}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.secondaryButton, isTesting && styles.primaryButtonDisabled]}
              onPress={handleSendTestNotification}
              disabled={isTesting || !isHydrated}
            >
              <Text style={styles.secondaryButtonText}>
                {isTesting ? 'Scheduling preview...' : 'Preview regular reminder (10s)'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.primaryButton, isSaving && styles.primaryButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving || !isHydrated}
          >
            <Text style={styles.primaryButtonText}>
              {isSaving ? 'Saving reminders...' : 'Save & update reminders'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: Math.max(insets.bottom + 96, 120) }} />
        </ScrollView>

        <BottomNav
          active="reminder"
          theme={isNightTheme ? 'night' : 'sunset'}
          bottomInset={insets.bottom}
          onNavigate={(id) => {
            if (id === 'home') router.replace('/')
            if (id === 'journal') router.push('/journal')
          }}
        />
      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 120,
    gap: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  kicker: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cardSub: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 12,
    marginTop: 2,
  },
  warningText: {
    color: '#FFE6B3',
    fontSize: 12,
  },
  uvWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  uvChip: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  uvChipActive: {
    backgroundColor: 'rgba(255,174,98,0.34)',
    borderColor: 'rgba(255,228,193,0.75)',
  },
  uvChipText: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 14,
    fontWeight: '700',
  },
  uvChipTextActive: {
    color: '#FFFFFF',
  },
  activityWrap: {
    gap: 8,
    marginTop: 4,
  },
  activityItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  activityItemActive: {
    backgroundColor: 'rgba(255,174,98,0.3)',
    borderColor: 'rgba(255,228,193,0.75)',
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  activityTitleActive: {
    color: '#FFFFFF',
  },
  activitySub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    marginTop: 2,
  },
  summaryCard: {
    marginTop: 6,
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(120,255,190,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(170,255,210,0.55)',
    gap: 4,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  summaryFootnote: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 12,
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    marginTop: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    marginTop: 6,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
})
