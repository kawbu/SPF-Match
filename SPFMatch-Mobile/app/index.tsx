import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, StatusBar } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { DaysRow }        from '../components/home/DaysRow'
import { StreakCard }     from '../components/home/StreakCard'
import { PeriodSelector } from '../components/home/PeriodSelector'
import { MetricsGrid }   from '../components/home/MetricsGrid'
import { BottomNav }     from '../components/home/BottomNav'

const DAYS = [
  { label: 'M', active: false },
  { label: 'T', active: true  },
  { label: 'W', active: false },
  { label: 'T', active: true  },
  { label: 'F', active: true  },
  { label: 'S', active: true  },
  { label: 'S', active: false },
]

export default function Index() {
  const [activePeriod, setActivePeriod] = useState<'Day' | 'Week' | 'Month' | 'All'>('Week')
  const [activeNav,    setActiveNav]    = useState('home')
  const insets = useSafeAreaInsets()

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

          {/* ── Day-of-week row (just below notch) ── */}
          <DaysRow days={DAYS} />

          {/* ── Streak card: 3 equal circles ── */}
          <StreakCard streak={3} record={22} checkedIn={true} />

          {/* ── Period selector ── */}
          <PeriodSelector active={activePeriod} onChange={setActivePeriod} />

          {/* ── Divider (below period selector) ── */}
          <View style={styles.divider} />

          {/* ── Chart + Metrics 2×2 grid ── */}
          <MetricsGrid activePeriod={activePeriod} />

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* ── Bottom navigation (5 tabs) ── */}
        <BottomNav
          active={activeNav}
          onNavigate={setActiveNav}
          bottomInset={insets.bottom}
        />

      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { paddingBottom: 100 },
  divider: {
    height: 2,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.48)',
    marginBottom: 16,
  },
})
