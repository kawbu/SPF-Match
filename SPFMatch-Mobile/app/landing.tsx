import React, { useEffect, useMemo, useState } from 'react'
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Stack, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../utils/supabaseClient'
import {
  getThemeOverridePreference,
  isNightThemeActive,
  type ThemeOverrideMode,
} from '../utils/themePreference'

export default function LandingScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [themeOverride, setThemeOverride] = useState<ThemeOverrideMode>('auto')
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    getThemeOverridePreference().then(setThemeOverride)
  }, [])

  const isNightTheme = isNightThemeActive(themeOverride, now)
  const theme = useMemo(
    () => (isNightTheme
      ? {
          gradientColors: ['#0B1022', '#131C3D', '#1B244A'],
          kickerColor: 'rgba(214,226,255,0.82)',
          subtitleColor: 'rgba(224,232,255,0.82)',
          helperTextColor: 'rgba(224,232,255,0.72)',
          buttonBg: 'rgba(88,132,255,0.5)',
          buttonBorder: 'rgba(198,218,255,0.78)',
        }
      : {
          gradientColors: ['#CC2B2B', '#D97B22', '#C80000'],
          kickerColor: 'rgba(255,255,255,0.8)',
          subtitleColor: 'rgba(255,255,255,0.84)',
          helperTextColor: 'rgba(255,255,255,0.76)',
          buttonBg: 'rgba(255,255,255,0.24)',
          buttonBorder: 'rgba(255,255,255,0.65)',
        }),
    [isNightTheme],
  )

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data }) => {
        if (data.session) {
          router.replace('/')
          return
        }
        setCheckingAuth(false)
      })
      .catch(() => setCheckingAuth(false))
  }, [router])

  if (checkingAuth) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
        <LinearGradient
          colors={theme.gradientColors as [string, string, string]}
          start={{ x: 0.08, y: 0 }}
          end={{ x: 0.95, y: 1 }}
          style={[styles.container, styles.center]}
        >
          <Text style={styles.loadingText}>Loading...</Text>
        </LinearGradient>
      </>
    )
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <LinearGradient
        colors={theme.gradientColors as [string, string, string]}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={styles.container}
      >
        <View style={[styles.content, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 28 }]}>
          <View style={styles.copyWrap}>
            <Text style={[styles.kicker, { color: theme.kickerColor }]}>SPFMatch</Text>
            <Text style={styles.title}>Daily sunscreen support, personalized for your skin.</Text>
            <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>
              Track skin check-ins, get UV-smart reapplication reminders, and stay consistent every day.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.primaryButton, { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder }]}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.primaryButtonText}>Log in</Text>
          </TouchableOpacity>

          <Text style={[styles.helperText, { color: theme.helperTextColor }]}>No guest mode — sign in or create an account to continue.</Text>
        </View>
      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  copyWrap: {
    marginTop: 48,
    gap: 8,
  },
  kicker: {
    color: 'rgba(214,226,255,0.82)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(224,232,255,0.82)',
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(88,132,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(198,218,255,0.78)',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  helperText: {
    color: 'rgba(224,232,255,0.72)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
})
