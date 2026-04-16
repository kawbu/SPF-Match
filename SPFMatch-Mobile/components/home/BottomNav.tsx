import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  AlarmClock, ShoppingCart, Sun, ClipboardPen, CalendarDays, LucideIcon,
} from 'lucide-react-native'

const NAV_TABS: { id: string; Icon: LucideIcon }[] = [
  { id: 'reminder', Icon: AlarmClock   },
  { id: 'shop',     Icon: ShoppingCart },
  { id: 'home',     Icon: Sun          },
  { id: 'journal',  Icon: ClipboardPen },
  { id: 'calendar', Icon: CalendarDays },
]

interface BottomNavProps {
  active: string
  onNavigate: (id: string) => void
  bottomInset: number
}

export function BottomNav({ active, onNavigate, bottomInset }: BottomNavProps) {
  return (
    <View style={[styles.bottomNav, { bottom: Math.max(bottomInset - 16, 4) }]}>
      {NAV_TABS.map(({ id, Icon }) => (
        <TouchableOpacity
          key={id}
          activeOpacity={0.7}
          style={[styles.navItem, active === id && styles.navItemActive]}
          onPress={() => onNavigate(id)}
        >
          <Icon
            size={active === id ? 35 : 29}
            color={active === id ? '#FFFFFF' : 'rgba(255,255,255,0.65)'}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  // ── Bottom nav ────────────────────────────────────────────────────
  bottomNav: {
    position: 'absolute',
    left: 28, right: 28, bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,239,239,0.16)',
    borderWidth: 1.5, borderColor: 'rgba(255,248,248,0.37)',
    borderRadius: 32,
    paddingVertical: 6, paddingHorizontal: 6,
    alignItems: 'center', justifyContent: 'space-around',
  },
  navItem:       { padding: 6, borderRadius: 20 },
  navItemActive: { backgroundColor: 'rgba(255,239,239,0.31)' },
})
