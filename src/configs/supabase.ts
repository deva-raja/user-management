import { createClient } from '@supabase/supabase-js'

const supabseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabseUrl as string, supabseAnonKey as string)

export default supabase
