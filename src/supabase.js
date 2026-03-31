import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tnsegdbswyqnndvbxlaq.supabase.co'
const supabaseKey = 'sb_publishable_TTugSHZ6xF9RIW2DVz527w_AJqottJa'

export const supabase = createClient(supabaseUrl, supabaseKey)