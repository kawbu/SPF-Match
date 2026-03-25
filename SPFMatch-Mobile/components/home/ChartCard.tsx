import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, View } from 'react-native'

export function ChartCard() {
  return (
    <>
      <View style={styles.chartWrapper}>
        <Text style={styles.chartY}>{'2\n \n1\n \n0'}</Text>
        <View style={styles.chartBox}>
          <LinearGradient
            colors={['rgba(255,255,255,0.237)', 'rgba(183,183,183,0.1975)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </View>
      <Text style={styles.chartX}>1   4   8   12   16   20   24   28</Text>
    </>
  )
}

const styles = StyleSheet.create({
  chartWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    height: 165,
    marginBottom: 4,
  },
  chartY: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,199,199,0.57)',
    lineHeight: 16,
    width: 16,
    textAlign: 'right',
    marginRight: 6,
    paddingTop: 2,
  },
  chartBox: {
    flex: 1,
    height: 165,
    borderWidth: 2,
    borderColor: '#FACB7A',
    overflow: 'hidden',
  },
  chartX: {
    marginLeft: 38,
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,199,199,0.57)',
    letterSpacing: 2,
    marginBottom: 10,
  },
})
