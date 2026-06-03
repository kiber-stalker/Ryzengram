import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jeenilltcaesrkesnngh.supabase.co';
const supabaseAnonKey = 'sb_publishable_zlhkys8T8cAfAR51uuUNWg_vdsddkYI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);