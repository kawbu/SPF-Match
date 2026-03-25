import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomNav } from '../components/home/BottomNav'
import { ChartCard } from '../components/home/ChartCard'
import { DAYS, METRICS, NAV_TABS, PERIODS } from '../components/home/constants'
import { DaySelector } from '../components/home/DaySelector'
import { MetricsGrid } from '../components/home/MetricsGrid'
import { PeriodSelector } from '../components/home/PeriodSelector'
import { StreakCard } from '../components/home/StreakCard'
import type { PeriodOption } from '../components/home/types'

export default function Index() {
  const [activePeriod, setActivePeriod] = useState<PeriodOption>('Week')
  const [activeNav, setActiveNav] = useState('home')
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const handleNavSelect = (tabId: string) => {
    setActiveNav(tabId)

    if (tabId === 'journal') {
      router.push('/journal')
    }
  }

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
          <DaySelector days={DAYS} />
          <StreakCard />
          <ChartCard />

          <PeriodSelector periods={PERIODS} activePeriod={activePeriod} onSelect={setActivePeriod} />

          <View style={styles.divider} />

          <MetricsGrid metrics={METRICS} />

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <BottomNav
          tabs={NAV_TABS}
          activeTab={activeNav}
          bottomInset={insets.bottom}
          onSelect={handleNavSelect}
        />
      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 100,
  },
  divider: {
    height: 2,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.48)',
    marginBottom: 16,
  },
  bottomSpacer: {
    height: 16,
  },
})
