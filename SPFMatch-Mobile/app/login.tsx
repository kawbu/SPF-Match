/**
 * SPFMatch Mobile email/password authentication screen.
 */
import React, { useEffect, useMemo, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Stack, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../utils/supabaseClient'
import {
  getThemeOverridePreference,
  isNightThemeActive,
  type ThemeOverrideMode,
} from '../utils/themePreference'

export default function LoginScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
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
          kickerColor: 'rgba(214,226,255,0.78)',
          subtitleColor: 'rgba(224,232,255,0.82)',
          cardBg: 'rgba(120,140,210,0.18)',
          cardBorder: 'rgba(176,198,255,0.36)',
          inputBg: 'rgba(14,26,62,0.55)',
          inputBorder: 'rgba(191,206,255,0.45)',
          buttonBg: 'rgba(88,132,255,0.5)',
          buttonBorder: 'rgba(198,218,255,0.78)',
          helperTextColor: 'rgba(224,232,255,0.86)',
          placeholderColor: 'rgba(215,225,255,0.5)',
        }
      : {
          gradientColors: ['#CC2B2B', '#D97B22', '#C80000'],
          kickerColor: 'rgba(255,255,255,0.72)',
          subtitleColor: 'rgba(255,255,255,0.8)',
          cardBg: 'rgba(255,255,255,0.16)',
          cardBorder: 'rgba(255,255,255,0.34)',
          inputBg: 'rgba(255,255,255,0.18)',
          inputBorder: 'rgba(255,255,255,0.42)',
          buttonBg: 'rgba(255,255,255,0.24)',
          buttonBorder: 'rgba(255,255,255,0.65)',
          helperTextColor: 'rgba(255,255,255,0.88)',
          placeholderColor: 'rgba(255,255,255,0.66)',
        }),
    [isNightTheme],
  )

  const handleLogin = async () => {
    if (!email.trim() || password.length === 0) return

    setIsSubmitting(true)
    setAuthError(null)
    try {
      const normalizedEmail = email.trim()

      if (isSignUpMode) {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
        })

        if (error) throw error

        if (!data.session) {
          const { error: signInAfterSignUpError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          })

          if (signInAfterSignUpError) {
            if (signInAfterSignUpError.message.toLowerCase().includes('invalid login credentials')) {
              setAuthError('That email already exists with a different password. Use the original password or reset it in Supabase Auth.')
              return
            }

            throw signInAfterSignUpError
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        })

        if (error) throw error
      }

      router.replace('/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed.'

      if (message.toLowerCase().includes('invalid login credentials')) {
        setAuthError('Invalid email or password. This usually means the account already exists with a different password, or this app is pointed at a different Supabase project.')
      } else {
        setAuthError(message)
      }
    } finally {
      setIsSubmitting(false)
    }
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
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}
          >
            <View style={styles.header}>
              <Text style={[styles.kicker, { color: theme.kickerColor }]}>Welcome back</Text>
              <Text style={styles.title}>{isSignUpMode ? 'Create your SPFMatch account' : 'Log in to SPFMatch'}</Text>
              <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>
                {isSignUpMode
                  ? 'Create an account to save check-ins and reminders to your Supabase profile.'
                  : 'Sign in to sync your check-ins and reminders across sessions.'}
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={theme.placeholderColor}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
              />

              <Text style={[styles.label, { marginTop: 10 }]}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={theme.placeholderColor}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
              />

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.loginButton,
                  { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder },
                  (!email.trim() || password.length === 0 || isSubmitting) && styles.loginButtonDisabled,
                ]}
                disabled={!email.trim() || password.length === 0 || isSubmitting}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>
                  {isSubmitting
                    ? (isSignUpMode ? 'Creating account...' : 'Signing in...')
                    : (isSignUpMode ? 'Create account' : 'Sign in')}
                </Text>
              </TouchableOpacity>

              {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.toggleButton}
                onPress={() => {
                  setIsSignUpMode((current) => !current)
                  setAuthError(null)
                }}
              >
                <Text style={[styles.toggleButtonText, { color: theme.helperTextColor }]}>
                  {isSignUpMode ? 'Already have an account? Sign in' : 'Need an account? Create one'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    gap: 4,
  },
  kicker: {
    color: 'rgba(214,226,255,0.78)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(224,232,255,0.82)',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(120,140,210,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(176,198,255,0.36)',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(191,206,255,0.45)',
    backgroundColor: 'rgba(14,26,62,0.55)',
    color: '#FFFFFF',
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(88,132,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(198,218,255,0.78)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.55,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  errorText: {
    marginTop: 12,
    color: '#FFD7D7',
    fontSize: 13,
    lineHeight: 18,
  },
  toggleButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'rgba(224,232,255,0.86)',
    fontSize: 13,
    fontWeight: '600',
  },
})
