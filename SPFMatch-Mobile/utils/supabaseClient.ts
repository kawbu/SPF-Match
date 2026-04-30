import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl) && Boolean(supabaseAnonKey)

const fallbackUrl = 'https://example.supabase.co'
const fallbackAnonKey = 'public-anon-key-not-configured'

export const supabase = createClient(
  isSupabaseConfigured ? (supabaseUrl as string) : fallbackUrl,
  isSupabaseConfigured ? (supabaseAnonKey as string) : fallbackAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
)

export interface UsageStats {
  id: string
  user_id: string | null
  daily_usage: number[]
  weekly_usage: number[]
  monthly_usage: number[]
  updated_at: string
}
