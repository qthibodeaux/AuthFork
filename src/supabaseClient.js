import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL2
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY2
const supabaseClient = createClient(supabaseUrl, supabaseKey)

export default supabaseClient