import { ChevronRight } from 'lucide-react-native'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { Metric } from './types'

type MetricsGridProps = {
  metrics: Metric[]
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <View style={styles.metricsCard}>
      <View style={styles.metricsGrid}>
        {metrics.map(({ label, Icon, iconColor }) => (
          <TouchableOpacity
            key={label}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${label} details`}
            style={styles.metricItem}
          >
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
  )
}

const styles = StyleSheet.create({
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
    justifyContent: 'space-around',
    rowGap: 24,
  },
  metricItem: {
    width: '44%',
    alignItems: 'center',
    gap: 8,
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
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
})
