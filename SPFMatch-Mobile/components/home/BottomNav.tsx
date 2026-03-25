import { StyleSheet, TouchableOpacity, View } from 'react-native'
import type { NavTab } from './types'

type BottomNavProps = {
  tabs: NavTab[]
  activeTab: string
  bottomInset: number
  onSelect: (tabId: string) => void
}

export function BottomNav({ tabs, activeTab, bottomInset, onSelect }: BottomNavProps) {
  return (
    <View style={[styles.bottomNav, { bottom: Math.max(bottomInset - 16, 4) }]}>
      {tabs.map(({ id, Icon }) => (
        <TouchableOpacity
          key={id}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`${id} tab`}
          style={[styles.navItem, activeTab === id && styles.navItemActive]}
          onPress={() => onSelect(id)}
        >
          <Icon
            size={activeTab === id ? 35 : 29}
            color={activeTab === id ? '#FFFFFF' : 'rgba(255,255,255,0.65)'}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    left: 28,
    right: 28,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,239,239,0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,248,248,0.37)',
    borderRadius: 32,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    padding: 6,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: 'rgba(255,239,239,0.31)',
  },
})
