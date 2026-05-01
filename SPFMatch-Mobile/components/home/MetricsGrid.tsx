/**
 * Home dashboard chart and metric cards derived from check-in history.
 */
import React, { useMemo, useState } from 'react'
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from 'react-native-svg'
import {
  Activity,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react-native'
import type { CheckInMetricId } from '../../types'

type MetricCard = {
  id: CheckInMetricId
  label: string
  value: number
  valueLabel: string
  subtitle: string
}

interface MetricsGridProps {
  chartData: number[]
  chartLabels: string[]
  metricCards: MetricCard[]
}

const ICONS: Record<CheckInMetricId, { Icon: LucideIcon; iconColor: string }> = {
  irritation: { Icon: TrendingDown, iconColor: '#FDF0E6' },
  dryness: { Icon: TrendingDown, iconColor: '#FFFFFF' },
  oiliness: { Icon: TrendingUp, iconColor: '#FFFFFF' },
  breakouts: { Icon: Activity, iconColor: '#FFFFFF' },
}

function buildPaths(
  data: number[],
  width: number,
  height: number,
): { line: string; area: string; dot?: { x: number; y: number } } {
  if (data.length === 0 || width === 0) return { line: '', area: '' }

  const max = Math.max(...data, 1)
  const pad = height * 0.08
  const pts = data.map((value, index) => ({
    x: data.length === 1 ? width / 2 : (index / (data.length - 1)) * width,
    y: height - pad - (value / max) * (height - pad * 2),
  }))

  if (pts.length === 1) {
    return {
      line: '',
      area: '',
      dot: pts[0],
    }
  }

  let line = `M ${pts[0].x} ${pts[0].y}`
  for (let index = 0; index < pts.length - 1; index += 1) {
    const p0 = pts[Math.max(index - 1, 0)]
    const p1 = pts[index]
    const p2 = pts[index + 1]
    const p3 = pts[Math.min(index + 2, pts.length - 1)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    line += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  const last = pts[pts.length - 1]
  const area = `${line} L ${last.x} ${height} L ${pts[0].x} ${height} Z`
  return { line, area }
}

function buildDisplayedLabels(labels: string[]): string[] {
  if (labels.length <= 6) return labels

  const lastIndex = labels.length - 1
  const visibleIndexes = new Set([
    0,
    Math.floor(lastIndex / 3),
    Math.floor((lastIndex * 2) / 3),
    lastIndex,
  ])

  return labels.map((label, index) => (visibleIndexes.has(index) ? label : ''))
}

export function MetricsGrid({ chartData, chartLabels, metricCards }: MetricsGridProps) {
  const [chartWidth, setChartWidth] = useState(0)
  const chartHeight = 155

  const maxVal = Math.max(...chartData, 4)
  const yTicks = useMemo(
    () => Array.from({ length: 5 }, (_, index) => Math.round((maxVal * (4 - index)) / 4)),
    [maxVal],
  )

  const { line: linePath, area: areaPath, dot } = useMemo(
    () => buildPaths(chartData, chartWidth, chartHeight),
    [chartData, chartWidth],
  )

  const displayedLabels = useMemo(() => buildDisplayedLabels(chartLabels), [chartLabels])

  const onLayout = (event: LayoutChangeEvent) => {
    setChartWidth(event.nativeEvent.layout.width)
  }

  const hasAnyValue = chartData.some((value) => value > 0)

  return (
    <View>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Skin stress trend</Text>
        <Text style={styles.chartSubtitle}>Combined score from daily check-ins</Text>
      </View>

      <View style={styles.chartWrapper}>
        <View style={styles.chartYContainer}>
          {yTicks.map((value, index) => (
            <Text key={index} style={styles.chartYLabel}>{value}</Text>
          ))}
        </View>

        <View style={styles.chartBox} onLayout={onLayout}>
          <LinearGradient
            colors={['rgba(255,255,255,0.237)', 'rgba(183,183,183,0.1975)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {chartWidth > 0 && hasAnyValue && chartData.length > 0 && (
            <Svg width={chartWidth} height={chartHeight} style={StyleSheet.absoluteFill}>
              <Defs>
                <SvgLinearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.4} />
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.02} />
                </SvgLinearGradient>
              </Defs>

              {areaPath ? <Path d={areaPath} fill="url(#areaFill)" /> : null}
              {linePath ? <Path d={linePath} fill="none" stroke="#FFFFFF" strokeWidth={2.5} /> : null}
              {dot ? <Circle cx={dot.x} cy={dot.y} r={5} fill="#FFFFFF" /> : null}
            </Svg>
          )}

          {!hasAnyValue && (
            <View style={styles.emptyOverlay}>
              <Text style={styles.emptyTitle}>No check-ins yet</Text>
              <Text style={styles.emptyText}>Complete today’s questionnaire to start tracking trends.</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.belowChart}>
        <View style={styles.chartXContainer}>
          {displayedLabels.map((label, index) => (
            <Text key={`${label}-${index}`} style={styles.chartXLabel}>{label}</Text>
          ))}
        </View>
      </View>

      <View style={styles.metricsCard}>
        <View style={styles.metricsGrid}>
          {metricCards.map(({ id, label, value, valueLabel, subtitle }) => {
            const { Icon, iconColor } = ICONS[id]

            return (
              <View key={label} style={styles.metricItem}>
                <View style={styles.metricCircle}>
                  <Icon size={20} color={iconColor} strokeWidth={3} />
                </View>
                <Text style={styles.metricLabel}>{label}</Text>
                <Text style={styles.metricValue}>{valueLabel}</Text>
                <Text style={styles.metricSubtitle}>Score {value} · {subtitle}</Text>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  chartHeader: {
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chartSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
  },
  chartWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    height: 165,
    marginBottom: 4,
  },
  chartYContainer: {
    width: 24,
    marginRight: 6,
    height: 165,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 2,
  },
  chartYLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,199,199,0.57)',
    textAlign: 'right',
  },
  chartBox: {
    flex: 1,
    height: 165,
    borderWidth: 2,
    borderColor: '#FACB7A',
    overflow: 'hidden',
    borderRadius: 4,
  },
  emptyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
  },
  belowChart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 30,
    marginRight: 16,
    marginBottom: 14,
  },
  chartXContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartXLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,199,199,0.57)',
  },
  metricsCard: {
    marginHorizontal: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 22,
  },
  metricItem: {
    width: '47%',
    alignItems: 'center',
    gap: 6,
  },
  metricCircle: {
    width: 57,
    height: 57,
    borderRadius: 28.5,
    borderWidth: 5,
    borderColor: 'rgba(254,254,254,0.76)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  metricSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
  },
})
