import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { DayOption } from './types'

type DaySelectorProps = {
  days: DayOption[]
}

export function DaySelector({ days }: DaySelectorProps) {
  return (
    <View style={styles.daysRow}>
      {days.map((day) => (
        <TouchableOpacity
          key={day.id}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`${day.label} day`}
          style={[styles.dayCircle, day.active ? styles.dayOn : styles.dayOff]}
        >
          <Text style={[styles.dayText, day.active ? styles.dayTextOn : styles.dayTextOff]}>
            {day.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  dayOn: {
    backgroundColor: 'rgba(255,240,240,0.2)',
    borderColor: 'rgba(255,255,255,0.78)',
  },
  dayOff: {
    backgroundColor: 'rgba(255,240,240,0.14)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
  },
  dayTextOn: {
    color: '#FFFFFF',
  },
  dayTextOff: {
    color: 'rgba(255,255,255,0.45)',
  },
})
