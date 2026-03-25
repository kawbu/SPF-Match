import { StyleSheet, Text, View } from 'react-native'
import { Activity, Check, Flame } from 'lucide-react-native'

export function StreakCard() {
  return (
    <View style={styles.streakCard}>
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

      <View style={styles.streakCol}>
        <View style={styles.streakCircle}>
          <Check size={32} color="rgba(255,255,255,0.88)" strokeWidth={3} />
        </View>
        <Text style={styles.circleSubLabel}>Checked In!</Text>
      </View>

      <View style={styles.streakCol}>
        <View style={styles.streakCircle}>
          <Activity size={30} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <Text style={styles.circleSubLabel}>Tracker</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 5,
    borderColor: 'rgba(254,254,254,0.76)',
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
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
  },
  streakValue: {
    fontSize: 30,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 34,
  },
  circleSubLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
})
