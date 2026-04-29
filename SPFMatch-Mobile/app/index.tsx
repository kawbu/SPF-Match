import React, { useCallback, useMemo, useState } from 'react'
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
import type { DailyCheckInEntry } from '../types'

export default function Index() {
  const [activePeriod, setActivePeriod] = useState<'Day' | 'Week' | 'Month' | 'All'>('Week')
  const [activeNav,    setActiveNav]    = useState('home')
  const [checkIns, setCheckIns] = useState<DailyCheckInEntry[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [checkInModalVisible, setCheckInModalVisible] = useState(false)
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const loadCheckIns = useCallback(async () => {
    const history = await getCheckInHistory()
    setCheckIns(history)
    setIsHydrated(true)
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadCheckIns()
    }, [loadCheckIns]),
  )

  const homeSummary = useMemo(
    () => buildHomeCheckInSummary(checkIns, activePeriod),
    [checkIns, activePeriod],
  )

  const trackerLabel = homeSummary.latestEntry
    ? `Last ${homeSummary.latestEntry.date.slice(5)}`
    : 'Start logging'

  return (
    <>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <LinearGradient
        colors={['#CC2B2B', '#D97B22', '#C80000']}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}
        >

          <View style={styles.headerCopy}>
            <Text style={styles.kicker}>Daily skin log</Text>
            <Text style={styles.title}>Check in on irritation, dryness, oiliness, and breakouts.</Text>
            <Text style={styles.subtitle}>
              {homeSummary.checkedInToday
                ? "Today's entry is saved. Tap the check-in circle below to update it anytime."
                : "Tap the check-in circle below — or the button — to log today's skin status."}
            </Text>
          </View>

          {/* ── Check-in CTA banner ── */}
          {!homeSummary.checkedInToday ? (
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.checkInBanner}
              onPress={() => setCheckInModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Open daily skin check-in"
            >
              <Text style={styles.checkInBannerEmoji}>📋</Text>
              <View style={styles.checkInBannerText}>
                <Text style={styles.checkInBannerTitle}>Log today's skin check-in</Text>
                <Text style={styles.checkInBannerSub}>Takes about 30 seconds</Text>
              </View>
              <Text style={styles.checkInBannerArrow}>›</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.82}
              style={[styles.checkInBanner, styles.checkInBannerDone]}
              onPress={() => setCheckInModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Update today's check-in"
            >
              <Text style={styles.checkInBannerEmoji}>✅</Text>
              <View style={styles.checkInBannerText}>
                <Text style={styles.checkInBannerTitle}>Checked in today</Text>
                <Text style={styles.checkInBannerSub}>Tap to review or update</Text>
              </View>
              <Text style={styles.checkInBannerArrow}>›</Text>
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
          <View style={styles.divider} />

          {/* ── Chart + Metrics 2×2 grid ── */}
          <MetricsGrid
            chartData={homeSummary.chartData}
            chartLabels={homeSummary.chartLabels}
            metricCards={homeSummary.metricCards}
          />

          {!isHydrated ? <Text style={styles.loadingText}>Loading check-in history…</Text> : null}

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* ── Bottom navigation (5 tabs) ── */}
        <BottomNav
          active={activeNav}
          onNavigate={(id) => {
            if (id === 'journal') {
              router.push('/journal')
              return
            }

            setActiveNav(id)
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
})
