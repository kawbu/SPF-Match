import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, LayoutChangeEvent } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, {
  Path, Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg'
import { Sparkles, RefreshCw } from 'lucide-react-native'
import { supabase, UsageStats } from '../../utils/supabaseClient'

// ── Sample data seeded on first tap ───────────────────────────────
const SAMPLE_DAILY:   number[] = [1, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
const SAMPLE_WEEKLY:  number[] = [4, 5, 6, 5, 4, 2, 2]
const SAMPLE_MONTHLY: number[] = [
  2, 3, 2, 4, 5, 3, 4, 6, 5, 4, 3, 5, 6, 7, 6,
  5, 4, 6, 7, 8, 7, 6, 5, 4, 5, 6, 5, 4, 3, 4,
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
interface UsageChartProps {
  activePeriod: Period
}

export function UsageChart({ activePeriod }: UsageChartProps) {
  const [stats,      setStats]      = useState<UsageStats | null>(null)
  const [seeding,    setSeeding]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [chartWidth, setChartWidth] = useState(0)
  const CHART_H = 155

  // Fetch most-recent row on mount
  useEffect(() => {
    supabase
      .from('usage_stats')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data, error: e }) => {
        if (!e && data) setStats(data as UsageStats)
      })
  }, [])

  // Insert sample row, then display it by returned ID
  async function handleSeed() {
    setSeeding(true)
    setError(null)
    try {
      const { data, error: e } = await supabase
        .from('usage_stats')
        .insert({
          daily_usage:   SAMPLE_DAILY,
          weekly_usage:  SAMPLE_WEEKLY,
          monthly_usage: SAMPLE_MONTHLY,
        })
        .select('*')
        .single()
      if (e) throw e
      setStats(data as UsageStats)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Seed failed')
    } finally {
      setSeeding(false)
    }
  }

  // Pick the right array based on the active period
  const getData = useCallback((): number[] => {
    if (!stats) return []
    switch (activePeriod) {
      case 'Day':   return stats.daily_usage   ?? []
      case 'Week':  return stats.weekly_usage  ?? []
      case 'Month':
      case 'All':   return stats.monthly_usage ?? []
    }
  }, [stats, activePeriod])

  const data   = getData()
  const maxVal = data.length ? Math.max(...data) : 2
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
          {/* Background gradient — matches original */}
          <LinearGradient
            colors={['rgba(255,255,255,0.237)', 'rgba(183,183,183,0.1975)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* SVG smooth curve from Supabase data */}
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

          {/* Empty state */}
          {data.length === 0 && (
            <View style={styles.emptyOverlay}>
              <Text style={styles.emptyText}>Tap Seed to load data</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── X-axis + Seed button ── */}
      <View style={styles.belowChart}>
        <View style={styles.chartXContainer}>
          {xTicks.map((v, i) => (
            <Text key={i} style={styles.chartXLabel}>{v}</Text>
          ))}
        </View>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleSeed}
          disabled={seeding}
          style={styles.seedBtn}
        >
          {seeding
            ? <RefreshCw size={12} color="rgba(255,255,255,0.8)" />
            : <Sparkles  size={12} color="rgba(255,255,255,0.8)" />
          }
          <Text style={styles.seedLabel}>{seeding ? 'Seeding…' : 'Seed'}</Text>
        </TouchableOpacity>
      </View>

      {error !== null && (
        <Text style={styles.errorText}>{error}</Text>
      )}
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
  emptyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
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
  seedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,229,178,0.3)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,229,178,0.5)',
  },
  seedLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  errorText: {
    fontSize: 11,
    color: 'rgba(255,160,160,0.9)',
    marginHorizontal: 26,
    marginBottom: 8,
  },
})
