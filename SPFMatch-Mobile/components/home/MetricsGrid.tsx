import React, { useState, useCallback } from 'react'
import {
  StyleSheet, Text, View, TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, {
  Path, Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg'
import {
  ChevronRight, TrendingUp, TrendingDown, Activity, LucideIcon,
} from 'lucide-react-native'

// ── Mock data (max ~4 applications) ──────────────────────────────
const MOCK_DAILY:   number[] = [1, 2, 2, 3, 4, 3, 2, 3, 4, 3, 2, 1]
const MOCK_WEEKLY:  number[] = [2, 3, 4, 3, 4, 2, 3]
const MOCK_MONTHLY: number[] = [
  2, 1, 3, 2, 4, 3, 2, 3, 4, 3,
  2, 3, 1, 2, 3, 4, 3, 2, 3, 4,
  2, 3, 2, 1, 3, 2, 4, 3, 2, 2,
]


const METRICS: { label: string; Icon: LucideIcon; iconColor: string }[] = [
  { label: 'Irritation', Icon: TrendingDown, iconColor: '#FDF0E6' },
  { label: 'Breakouts',  Icon: Activity,     iconColor: '#FFFFFF' },
  { label: 'Redness',    Icon: TrendingDown, iconColor: '#FFFFFF' },
  { label: 'Oiliness',   Icon: TrendingUp,   iconColor: '#FFFFFF' },
]

type Period = 'Day' | 'Week' | 'Month' | 'All'

// ── Catmull-Rom spline → SVG cubic bezier path ────────────────────
function buildPaths(
  data: number[],
  width: number,
  height: number,
): { line: string; area: string } {
  if (data.length < 2 || width === 0) return { line: '', area: '' }

  const max = Math.max(...data, 1)
  const pad = height * 0.08
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - pad - (v / max) * (height - pad * 2),
  }))

  let line = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    line += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  const last = pts[pts.length - 1]
  const area  = `${line} L ${last.x} ${height} L ${pts[0].x} ${height} Z`
  return { line, area }
}

// ── Component ─────────────────────────────────────────────────────
interface MetricsGridProps {
  activePeriod: Period
}

export function MetricsGrid({ activePeriod }: MetricsGridProps) {
  const [chartWidth, setChartWidth] = useState(0)
  const CHART_H = 155

  const getData = useCallback((): number[] => {
    switch (activePeriod) {
      case 'Day':   return MOCK_DAILY
      case 'Week':  return MOCK_WEEKLY
      case 'Month':
      case 'All':   return MOCK_MONTHLY
    }
  }, [activePeriod])

  const data   = getData()
  const maxVal = Math.max(...data)
  const { line: linePath, area: areaPath } = buildPaths(data, chartWidth, CHART_H)

  const NUM_Y_TICKS = 5
  const yTicks = Array.from({ length: NUM_Y_TICKS }, (_, i) =>
    Math.round((maxVal * (NUM_Y_TICKS - 1 - i)) / (NUM_Y_TICKS - 1))
  )

  const NUM_X_TICKS = Math.min(data.length, 8)
  const xTicks = data.length > 1
    ? Array.from({ length: NUM_X_TICKS }, (_, i) =>
        Math.round(1 + (i / (NUM_X_TICKS - 1)) * (data.length - 1))
      )
    : data.length === 1 ? [1] : []

  const onLayout = (e: LayoutChangeEvent) =>
    setChartWidth(e.nativeEvent.layout.width)

  return (
    <View>
      {/* ── Chart ── */}
      <View style={styles.chartWrapper}>
        <View style={styles.chartYContainer}>
          {yTicks.map((v, i) => (
            <Text key={i} style={styles.chartYLabel}>{v}</Text>
          ))}
        </View>

        <View style={styles.chartBox} onLayout={onLayout}>
          <LinearGradient
            colors={['rgba(255,255,255,0.237)', 'rgba(183,183,183,0.1975)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {chartWidth > 0 && data.length >= 2 && (
            <Svg width={chartWidth} height={CHART_H} style={StyleSheet.absoluteFill}>
              <Defs>
                <SvgLinearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%"   stopColor="#FFFFFF" stopOpacity={0.4} />
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.02} />
                </SvgLinearGradient>
              </Defs>
              <Path d={areaPath} fill="url(#areaFill)" />
              <Path d={linePath} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
            </Svg>
          )}

        </View>
      </View>

      {/* ── X-axis label ── */}
      <View style={styles.belowChart}>
        <View style={styles.chartXContainer}>
          {xTicks.map((v, i) => (
            <Text key={i} style={styles.chartXLabel}>{v}</Text>
          ))}
        </View>
      </View>

      {/* ── 2×2 Metrics grid ── */}
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
    </View>
  )
}

const styles = StyleSheet.create({
  // ── Chart ─────────────────────────────────────────────────────────
  chartWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    height: 165,
    marginBottom: 4,
  },
  chartYContainer: {
    width: 20,
    marginRight: 6,
    height: 165,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 2,
  },
  chartYLabel: {
    fontSize: 10, fontWeight: '700',
    color: 'rgba(255,199,199,0.57)',
    textAlign: 'right',
  },
  chartBox: {
    flex: 1, height: 165,
    borderWidth: 2, borderColor: '#FACB7A',
    overflow: 'hidden',
  },
  belowChart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 26,
    marginRight: 16,
    marginBottom: 10,
  },
  chartXContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartXLabel: {
    fontSize: 10, fontWeight: '700',
    color: 'rgba(255,199,199,0.57)',
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
})
