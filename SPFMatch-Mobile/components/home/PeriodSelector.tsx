import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { PeriodOption } from './types'

type PeriodSelectorProps = {
  periods: PeriodOption[]
  activePeriod: PeriodOption
  onSelect: (period: PeriodOption) => void
}

export function PeriodSelector({ periods, activePeriod, onSelect }: PeriodSelectorProps) {
  return (
    <View style={styles.periodRow}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Show ${period} data`}
          style={[styles.periodBtn, activePeriod === period && styles.periodBtnActive]}
          onPress={() => onSelect(period)}
        >
          <Text style={[styles.periodText, activePeriod === period && styles.periodTextActive]}>
            {period}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  periodRow: {
    flexDirection: 'row',
    marginHorizontal: 22,
    backgroundColor: 'rgba(255,229,178,0.25)',
    borderRadius: 55,
    padding: 4,
    marginBottom: 14,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 55,
  },
  periodBtnActive: {
    backgroundColor: 'rgba(255,229,178,0.55)',
  },
  periodText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
  periodTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
})
