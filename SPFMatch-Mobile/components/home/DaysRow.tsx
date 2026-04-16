import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

interface Day { label: string; active: boolean }

interface DaysRowProps {
  days: Day[]
  onToggle?: (index: number) => void
}

export function DaysRow({ days, onToggle }: DaysRowProps) {
  return (
    <View style={styles.daysRow}>
      {days.map((d, i) => (
        <TouchableOpacity
          key={i}
          activeOpacity={0.7}
          style={[styles.dayCircle, d.active ? styles.dayOn : styles.dayOff]}
          onPress={() => onToggle?.(i)}
        >
          <Text style={[styles.dayText, d.active ? styles.dayTextOn : styles.dayTextOff]}>
            {d.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
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
})
