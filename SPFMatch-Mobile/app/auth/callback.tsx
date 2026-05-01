/**
 * Handles deep-link auth callbacks and exchanges provider tokens for a session.
 */
import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Stack, useRouter } from 'expo-router'
import * as Linking from 'expo-linking'
import { supabase } from '../../utils/supabaseClient'

function parseHashOrQuery(url: string): Record<string, string> {
  const hashIndex = url.indexOf('#')
  const queryIndex = url.indexOf('?')

  const raw = hashIndex >= 0
    ? url.slice(hashIndex + 1)
    : queryIndex >= 0
      ? url.slice(queryIndex + 1)
      : ''

  const params = new URLSearchParams(raw)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

export default function AuthCallbackScreen() {
  const router = useRouter()
  const [message, setMessage] = useState('Finalizing sign-in...')

  useEffect(() => {
    async function finalizeAuth() {
      try {
        const url = await Linking.getInitialURL()
        if (!url) {
          setMessage('Missing auth callback URL.')
          return
        }

        const params = parseHashOrQuery(url)

        if (params.error_description || params.error) {
          setMessage(params.error_description ?? params.error ?? 'Authentication failed.')
          return
        }

        if (params.access_token && params.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          })

          if (error) {
            setMessage(error.message)
            return
          }

          router.replace('/')
          return
        }

        if (params.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(params.code)
          if (error) {
            setMessage(error.message)
            return
          }

          router.replace('/')
          return
        }

        setMessage('No auth token found in callback URL.')
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Unable to complete sign-in.')
      }
    }

    finalizeAuth()
  }, [router])

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <LinearGradient
        colors={['#0B1022', '#131C3D', '#1B244A']}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>SPFMatch</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  message: {
    color: 'rgba(224,232,255,0.86)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
})
