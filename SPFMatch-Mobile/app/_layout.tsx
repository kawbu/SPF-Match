import { Stack } from 'expo-router'
import { useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'android') return

    Notifications.setNotificationChannelAsync('uv-reminders', {
      name: 'UV Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: '#FF7A33',
    }).catch(() => {
      // non-blocking
    })
  }, [])

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
  )
}
