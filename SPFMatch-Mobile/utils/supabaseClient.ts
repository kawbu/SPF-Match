import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface UsageStats {
  id: string
  user_id: string | null
  daily_usage: number[]
  weekly_usage: number[]
  monthly_usage: number[]
  updated_at: string
}
