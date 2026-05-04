import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  display_name: string | null
  created_at: string
}

export type Tweet = {
  id: string
  user_id: string
  content: string
  created_at: string
  profiles?: Profile
}
