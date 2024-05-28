import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL3
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY3
const supabaseClient = createClient(supabaseUrl, supabaseKey)

export default supabaseClient