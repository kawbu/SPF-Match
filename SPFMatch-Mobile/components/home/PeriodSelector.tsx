/**
 * Segmented control for selecting chart aggregation period.
 */
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

const PERIODS = ['Day', 'Week', 'Month', 'All'] as const
type Period = typeof PERIODS[number]

interface PeriodSelectorProps {
  active: Period
  onChange: (period: Period) => void
}

export function PeriodSelector({ active, onChange }: PeriodSelectorProps) {
  return (
    <View style={styles.periodRow}>
      {PERIODS.map((p) => (
        <TouchableOpacity
          key={p}
          activeOpacity={0.7}
          style={[styles.periodBtn, active === p && styles.periodBtnActive]}
          onPress={() => onChange(p)}
        >
          <Text style={[styles.periodText, active === p && styles.periodTextActive]}>
            {p}
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
})
