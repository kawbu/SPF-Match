import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View, ScrollView, StatusBar, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { DaysRow }        from '../components/home/DaysRow'
import { StreakCard }     from '../components/home/StreakCard'
import { PeriodSelector } from '../components/home/PeriodSelector'
import { MetricsGrid }   from '../components/home/MetricsGrid'
import { BottomNav }     from '../components/home/BottomNav'
import { CheckInModal }  from '../components/home/CheckInModal'
import { buildHomeCheckInSummary, getCheckInHistory } from '../utils/checkInStorage'
import { supabase } from '../utils/supabaseClient'
import {
  getThemeOverridePreference,
  isNightThemeActive,
  setThemeOverridePreference,
  type ThemeOverrideMode,
} from '../utils/themePreference'
import type { DailyCheckInEntry } from '../types'

export default function Index() {
  const [activePeriod, setActivePeriod] = useState<'Day' | 'Week' | 'Month' | 'All'>('Week')
  const [checkIns, setCheckIns] = useState<DailyCheckInEntry[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [checkInModalVisible, setCheckInModalVisible] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [themeOverride, setThemeOverride] = useState<ThemeOverrideMode>('auto')
  const [now, setNow] = useState(() => new Date())
  const insets = useSafeAreaInsets()
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data }) => {
        if (!data.session) {
          router.replace('/landing')
          return
        }
        setAuthChecked(true)
      })
      .catch(() => {
        router.replace('/landing')
      })
  }, [router])

  const loadCheckIns = useCallback(async () => {
    const history = await getCheckInHistory()
    setCheckIns(history)
    setIsHydrated(true)
  }, [])

  const loadThemePreference = useCallback(async () => {
    const stored = await getThemeOverridePreference()
    setThemeOverride(stored)
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadCheckIns()
      loadThemePreference()
    }, [loadCheckIns, loadThemePreference]),
  )

  useEffect(() => {
    setThemeOverridePreference(themeOverride)
  }, [themeOverride])

  const homeSummary = useMemo(
    () => buildHomeCheckInSummary(checkIns, activePeriod),
    [checkIns, activePeriod],
  )

  const trackerLabel = homeSummary.latestEntry
    ? `Last ${homeSummary.latestEntry.date.slice(5)}`
    : 'Start logging'

  const isNightTheme = isNightThemeActive(themeOverride, now)

  const theme = useMemo(
    () => (isNightTheme
      ? {
          gradientColors: ['#0B1022', '#131C3D', '#1B244A'],
          kickerColor: 'rgba(214,226,255,0.78)',
          subtitleColor: 'rgba(224,232,255,0.82)',
          dividerColor: 'rgba(180,198,255,0.48)',
          loadingTextColor: 'rgba(205,216,250,0.66)',
          checkInBannerBg: 'rgba(125,145,214,0.2)',
          checkInBannerBorder: 'rgba(191,206,255,0.5)',
          checkInBannerDoneBg: 'rgba(72,179,148,0.24)',
          checkInBannerDoneBorder: 'rgba(138,238,209,0.54)',
          checkInBannerSubColor: 'rgba(225,233,255,0.78)',
          checkInBannerArrowColor: 'rgba(225,233,255,0.82)',
        }
      : {
          gradientColors: ['#CC2B2B', '#D97B22', '#C80000'],
          kickerColor: 'rgba(255,255,255,0.72)',
          subtitleColor: 'rgba(255,255,255,0.78)',
          dividerColor: 'rgba(255,255,255,0.48)',
          loadingTextColor: 'rgba(255,255,255,0.62)',
          checkInBannerBg: 'rgba(255,255,255,0.18)',
          checkInBannerBorder: 'rgba(255,255,255,0.45)',
          checkInBannerDoneBg: 'rgba(80,200,100,0.18)',
          checkInBannerDoneBorder: 'rgba(120,230,130,0.5)',
          checkInBannerSubColor: 'rgba(255,255,255,0.72)',
          checkInBannerArrowColor: 'rgba(255,255,255,0.7)',
        }),
    [isNightTheme],
  )

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.replace('/landing')
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!authChecked) {
    return (
      <>
        <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
        <LinearGradient
          colors={theme.gradientColors as [string, string, string]}
          start={{ x: 0.08, y: 0 }}
          end={{ x: 0.95, y: 1 }}
          style={[styles.container, styles.loadingContainer]}
        >
          <Text style={[styles.loadingText, { color: theme.loadingTextColor }]}>Loading...</Text>
        </LinearGradient>
      </>
    )
  }

  return (
    <>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <LinearGradient
        colors={theme.gradientColors as [string, string, string]}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}
        >

          <View style={styles.headerCopy}>
            <Text style={[styles.kicker, { color: theme.kickerColor }]}>Daily skin log</Text>
            <Text style={styles.title}>Check in on irritation, dryness, oiliness, and breakouts.</Text>
            <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>
              {homeSummary.checkedInToday
                ? "Today's entry is saved. Tap the check-in circle below to update it anytime."
                : "Tap the check-in circle below — or the button — to log today's skin status."}
            </Text>

            {__DEV__ ? (
              <View style={styles.themeDebugRow}>
                {(['auto', 'day', 'night'] as const).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    activeOpacity={0.8}
                    onPress={() => setThemeOverride(mode)}
                    style={[
                      styles.themeDebugChip,
                      themeOverride === mode && styles.themeDebugChipActive,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Set theme preview to ${mode}`}
                  >
                    <Text style={styles.themeDebugChipText}>{mode.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>

          {/* ── Check-in CTA banner ── */}
          {!homeSummary.checkedInToday ? (
            <TouchableOpacity
              activeOpacity={0.82}
              style={[
                styles.checkInBanner,
                {
                  backgroundColor: theme.checkInBannerBg,
                  borderColor: theme.checkInBannerBorder,
                },
              ]}
              onPress={() => setCheckInModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Open daily skin check-in"
            >
              <Text style={styles.checkInBannerEmoji}>📋</Text>
              <View style={styles.checkInBannerText}>
                <Text style={styles.checkInBannerTitle}>Log today's skin check-in</Text>
                <Text style={[styles.checkInBannerSub, { color: theme.checkInBannerSubColor }]}>Takes about 30 seconds</Text>
              </View>
              <Text style={[styles.checkInBannerArrow, { color: theme.checkInBannerArrowColor }]}>›</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.82}
              style={[
                styles.checkInBanner,
                {
                  backgroundColor: theme.checkInBannerBg,
                  borderColor: theme.checkInBannerBorder,
                },
                styles.checkInBannerDone,
                {
                  backgroundColor: theme.checkInBannerDoneBg,
                  borderColor: theme.checkInBannerDoneBorder,
                },
              ]}
              onPress={() => setCheckInModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Update today's check-in"
            >
              <Text style={styles.checkInBannerEmoji}>✅</Text>
              <View style={styles.checkInBannerText}>
                <Text style={styles.checkInBannerTitle}>Checked in today</Text>
                <Text style={[styles.checkInBannerSub, { color: theme.checkInBannerSubColor }]}>Tap to review or update</Text>
              </View>
              <Text style={[styles.checkInBannerArrow, { color: theme.checkInBannerArrowColor }]}>›</Text>
            </TouchableOpacity>
          )}

          {/* ── Day-of-week row (just below notch) ── */}
          <DaysRow days={homeSummary.days} />

          {/* ── Streak card: 3 equal circles ── */}
          <StreakCard
            streak={homeSummary.streak}
            record={homeSummary.record}
            checkedIn={homeSummary.checkedInToday}
            trackerLabel={trackerLabel}
            onCheckInPress={() => setCheckInModalVisible(true)}
          />

          {/* ── Period selector ── */}
          <PeriodSelector active={activePeriod} onChange={setActivePeriod} />

          {/* ── Divider (below period selector) ── */}
          <View style={[styles.divider, { backgroundColor: theme.dividerColor }]} />

          {/* ── Chart + Metrics 2×2 grid ── */}
          <MetricsGrid
            chartData={homeSummary.chartData}
            chartLabels={homeSummary.chartLabels}
            metricCards={homeSummary.metricCards}
          />

          {!isHydrated ? <Text style={[styles.loadingText, { color: theme.loadingTextColor }]}>Loading check-in history…</Text> : null}

          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.logoutButtonBottom}
            onPress={handleLogout}
            disabled={isLoggingOut}
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Text style={styles.logoutButtonBottomText}>{isLoggingOut ? 'Logging out...' : 'Log out'}</Text>
          </TouchableOpacity>

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* ── Bottom navigation (5 tabs) ── */}
        <BottomNav
          active="home"
          theme={isNightTheme ? 'night' : 'sunset'}
          onNavigate={(id) => {
            if (id === 'home') return

            if (id === 'reminder') {
              router.push('/reminder')
              return
            }

            if (id === 'journal') {
              router.push('/journal')
              return
            }
          }}
          bottomInset={insets.bottom}
        />

        <CheckInModal
          visible={checkInModalVisible}
          onClose={() => setCheckInModalVisible(false)}
          onSaved={() => loadCheckIns()}
        />

      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { paddingBottom: 100 },
  headerCopy: {
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 4,
  },
  kicker: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    lineHeight: 19,
  },
  divider: {
    height: 2,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.48)',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.62)',
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.45)',
    gap: 12,
  },
  checkInBannerDone: {
    backgroundColor: 'rgba(80,200,100,0.18)',
    borderColor: 'rgba(120,230,130,0.5)',
  },
  checkInBannerEmoji: {
    fontSize: 28,
  },
  checkInBannerText: {
    flex: 1,
    gap: 2,
  },
  checkInBannerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  checkInBannerSub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
  },
  checkInBannerArrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 24,
    fontWeight: '300',
  },
  themeDebugRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  themeDebugChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  themeDebugChipActive: {
    backgroundColor: 'rgba(255,255,255,0.26)',
    borderColor: 'rgba(255,255,255,0.72)',
  },
  themeDebugChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  logoutButtonBottom: {
    marginTop: 14,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingVertical: 13,
    alignItems: 'center',
  },
  logoutButtonBottomText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
})
