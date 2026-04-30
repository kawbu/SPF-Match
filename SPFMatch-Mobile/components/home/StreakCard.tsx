import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Flame, Check, Activity } from 'lucide-react-native'

interface StreakCardProps {
  streak: number
  record: number
  checkedIn: boolean
  trackerLabel?: string
  onCheckInPress?: () => void
}

export function StreakCard({
  streak,
  record,
  checkedIn,
  trackerLabel = 'Skin Log',
  onCheckInPress,
}: StreakCardProps) {
  return (
    <View style={styles.streakCard}>

      {/* Left — Streak */}
      <View style={styles.streakCol}>
        <View style={styles.streakCircle}>
          <View style={styles.streakTopRow}>
            <Flame size={13} color="#FFFFFF" />
            <Text style={styles.streakLabelInside}> Streak</Text>
          </View>
          <Text style={styles.streakValue}>{streak}</Text>
        </View>
        <Text style={styles.circleSubLabel}>Record: {record}</Text>
      </View>

      {/* Center — Check In (tappable) */}
      <View style={styles.streakCol}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onCheckInPress}
          style={[styles.streakCircle, !checkedIn && styles.streakCircleActive]}
          accessibilityRole="button"
          accessibilityLabel="Open daily check-in"
        >
          <Check size={32} color="rgba(255,255,255,0.88)" strokeWidth={3} />
        </TouchableOpacity>
        <Text style={styles.circleSubLabel}>{checkedIn ? 'Checked In!' : 'Due Today'}</Text>
      </View>

      {/* Right — Tracker */}
      <View style={styles.streakCol}>
        <View style={styles.streakCircle}>
          <Activity size={30} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <Text style={styles.circleSubLabel}>{trackerLabel}</Text>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
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
  streakCircleActive: {
    borderColor: 'rgba(255,200,100,0.85)',
    backgroundColor: 'rgba(255,200,100,0.12)',
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
    paddingHorizontal: 2,
  },
})
