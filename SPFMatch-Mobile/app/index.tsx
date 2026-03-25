import React, { useState } from 'react'
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Flame, Check, CalendarDays, ChevronRight,
  TrendingUp, TrendingDown, Activity,
  AlarmClock, ShoppingCart, Sun, ClipboardPen,
} from 'lucide-react-native'

const DAYS = [
  { label: 'M', active: false },
  { label: 'T', active: true  },
  { label: 'W', active: false },
  { label: 'T', active: true  },
  { label: 'F', active: true  },
  { label: 'S', active: true  },
  { label: 'S', active: false },
]

const PERIODS = ['Day', 'Week', 'Month', 'All']

const METRICS = [
  { label: 'Irritation', Icon: TrendingDown, iconColor: '#FDF0E6' },
  { label: 'Breakouts',  Icon: Activity,     iconColor: '#FFFFFF' },
  { label: 'Redness',    Icon: TrendingDown, iconColor: '#FFFFFF' },
  { label: 'Oiliness',   Icon: TrendingUp,   iconColor: '#FFFFFF' },
]

const NAV_TABS = [
  { id: 'reminder', Icon: AlarmClock   },
  { id: 'shop',     Icon: ShoppingCart },
  { id: 'home',     Icon: Sun          },
  { id: 'journal',  Icon: ClipboardPen },
  { id: 'calendar', Icon: CalendarDays },
]

export default function Index() {
  const [activePeriod, setActivePeriod] = useState('Week')
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
          <View style={styles.daysRow}>
            {DAYS.map((d, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                style={[styles.dayCircle, d.active ? styles.dayOn : styles.dayOff]}
              >
                <Text style={[styles.dayText, d.active ? styles.dayTextOn : styles.dayTextOff]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Streak card: 3 equal circles ── */}
          <View style={styles.streakCard}>

            {/* Left — Streak */}
            <View style={styles.streakCol}>
              <View style={styles.streakCircle}>
                <View style={styles.streakTopRow}>
                  <Flame size={13} color="rgba(255,93,0,0.85)" />
                  <Text style={styles.streakLabelInside}> Streak</Text>
                </View>
                <Text style={styles.streakValue}>3</Text>
              </View>
              <Text style={styles.circleSubLabel}>Record: 22</Text>
            </View>

            {/* Center — Checked In */}
            <View style={styles.streakCol}>
              <View style={styles.streakCircle}>
                <Check size={32} color="rgba(255,255,255,0.88)" strokeWidth={3} />
              </View>
              <Text style={styles.circleSubLabel}>Checked In!</Text>
            </View>

            {/* Right — Tracker */}
            <View style={styles.streakCol}>
              <View style={styles.streakCircle}>
                <Activity size={30} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <Text style={styles.circleSubLabel}>Tracker</Text>
            </View>

          </View>

          {/* ── Chart ── */}
          <View style={styles.chartWrapper}>
            <Text style={styles.chartY}>{'2\n \n1\n \n0'}</Text>
            <View style={styles.chartBox}>
              <LinearGradient
                colors={['rgba(255,255,255,0.237)', 'rgba(183,183,183,0.1975)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </View>
          </View>
          <Text style={styles.chartX}>1   4   8   12   16   20   24   28</Text>

          {/* ── Period selector ── */}
          <View style={styles.periodRow}>
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p}
                activeOpacity={0.7}
                style={[styles.periodBtn, activePeriod === p && styles.periodBtnActive]}
                onPress={() => setActivePeriod(p)}
              >
                <Text style={[styles.periodText, activePeriod === p && styles.periodTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Divider (below period selector) ── */}
          <View style={styles.divider} />

          {/* ── Metrics 2×2 grid ── */}
          <View style={styles.metricsCard}>
            <View style={styles.metricsGrid}>
              {METRICS.map(({ label, Icon, iconColor }) => (
                <TouchableOpacity key={label} activeOpacity={0.7} style={styles.metricItem}>
                  <View style={styles.metricCircle}>
                    <Icon size={20} color={iconColor} strokeWidth={3} />
                  </View>
                  <View style={styles.metricLabelRow}>
                    <Text style={styles.metricLabel}>{label}</Text>
                    <ChevronRight size={11} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* ── Bottom navigation (5 tabs) ── */}
        <View style={[styles.bottomNav, { bottom: Math.max(insets.bottom - 16, 4) }]}>
          {NAV_TABS.map(({ id, Icon }) => (
            <TouchableOpacity
              key={id}
              activeOpacity={0.7}
              style={[styles.navItem, activeNav === id && styles.navItemActive]}
              onPress={() => setActiveNav(id)}
            >
              <Icon
                size={activeNav === id ? 35 : 29}
                color={activeNav === id ? '#FFFFFF' : 'rgba(255,255,255,0.65)'}
              />
            </TouchableOpacity>
          ))}
        </View>

      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { paddingBottom: 100 },

  // ── Days ──────────────────────────────────────────────────────────
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  dayCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3,
  },
  dayOn:  { backgroundColor: 'rgba(255,240,240,0.2)',  borderColor: 'rgba(255,255,255,0.78)' },
  dayOff: { backgroundColor: 'rgba(255,240,240,0.14)', borderColor: 'rgba(255,255,255,0.25)' },
  dayText:    { fontSize: 15, fontWeight: '600' },
  dayTextOn:  { color: '#FFFFFF' },
  dayTextOff: { color: 'rgba(255,255,255,0.45)' },

  // ── Streak card ───────────────────────────────────────────────────
  streakCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 22,
    backgroundColor: 'rgba(255,239,239,0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,248,248,0.37)',
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  streakCol: {
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  streakCircle: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 5, borderColor: 'rgba(254,254,254,0.76)',
    backgroundColor: 'rgba(255,239,239,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  streakTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakLabelInside: {
    fontSize: 11, fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
  },
  streakValue: {
    fontSize: 30, fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 34,
  },
  circleSubLabel: {
    fontSize: 13, fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },

  // ── Chart ─────────────────────────────────────────────────────────
  chartWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    height: 165,
    marginBottom: 4,
  },
  chartY: {
    fontSize: 12, fontWeight: '700',
    color: 'rgba(255,199,199,0.57)',
    lineHeight: 16,
    width: 16, textAlign: 'right',
    marginRight: 6, paddingTop: 2,
  },
  chartBox: {
    flex: 1, height: 165,
    borderWidth: 2, borderColor: '#FACB7A',
    overflow: 'hidden',
  },
  chartX: {
    marginLeft: 38,
    fontSize: 11, fontWeight: '700',
    color: 'rgba(255,199,199,0.57)',
    letterSpacing: 2,
    marginBottom: 10,
  },

  // ── Period selector ───────────────────────────────────────────────
  periodRow: {
    flexDirection: 'row',
    marginHorizontal: 22,
    backgroundColor: 'rgba(255,229,178,0.25)',
    borderRadius: 55,
    padding: 4,
    marginBottom: 14,
  },
  periodBtn: {
    flex: 1, paddingVertical: 7,
    alignItems: 'center', borderRadius: 55,
  },
  periodBtnActive: { backgroundColor: 'rgba(255,229,178,0.55)' },
  periodText: {
    fontSize: 15, fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
  periodTextActive: {
    color: '#FFFFFF', fontWeight: '700',
  },

  // ── Divider ───────────────────────────────────────────────────────
  divider: {
    height: 2,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.48)',
    marginBottom: 16,
  },

  // ── Metrics ───────────────────────────────────────────────────────
  metricsCard: {
    marginHorizontal: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14, padding: 20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1, shadowRadius: 24,
  },
  metricsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-around', rowGap: 24,
  },
  metricItem: {
    width: '44%', alignItems: 'center', gap: 8,
  },
  metricCircle: {
    width: 57, height: 57, borderRadius: 28.5,
    borderWidth: 5, borderColor: 'rgba(254,254,254,0.76)',
    alignItems: 'center', justifyContent: 'center',
  },
  metricLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricLabel:    { fontSize: 14, color: '#FFFFFF' },

  // ── Bottom nav ────────────────────────────────────────────────────
  bottomNav: {
    position: 'absolute',
    left: 28, right: 28, bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,239,239,0.16)',
    borderWidth: 1.5, borderColor: 'rgba(255,248,248,0.37)',
    borderRadius: 32,
    paddingVertical: 6, paddingHorizontal: 6,
    alignItems: 'center', justifyContent: 'space-around',
  },
  navItem:       { padding: 6, borderRadius: 20 },
  navItemActive: { backgroundColor: 'rgba(255,239,239,0.31)' },
})
