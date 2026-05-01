/**
 * SPFMatch Mobile router layout and global notification channel setup.
 */
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
      // Channel registration should never block screen rendering.
    })
  }, [])

  return (
    <Stack
      initialRouteName="landing"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}
    />
  )
}
