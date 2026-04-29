import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  AlarmClock, Sun, ClipboardPen, CalendarDays, LucideIcon,
} from 'lucide-react-native'

const NAV_TABS: { id: string; Icon: LucideIcon }[] = [
  { id: 'reminder', Icon: AlarmClock   },
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
            color={active === id ? '#FFFFFF' : 'rgba(255,255,255,0.88)'}
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
    backgroundColor: 'rgba(155,22,22,0.44)',
    borderWidth: 1.8, borderColor: 'rgba(255,210,210,0.62)',
    borderRadius: 32,
    paddingVertical: 6, paddingHorizontal: 6,
    alignItems: 'center', justifyContent: 'space-around',
    shadowColor: '#000000',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  navItem:       { padding: 6, borderRadius: 20 },
  navItemActive: {
    backgroundColor: 'rgba(255,102,40,0.46)',
    borderWidth: 1,
    borderColor: 'rgba(255,226,200,0.72)',
  },
})
