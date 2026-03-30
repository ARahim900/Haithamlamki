import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// Supabase client — Haithamlamki Drilling Operations project
// Project: ibsnzlcdtgsikuivryfh
// URL:     https://ibsnzlcdtgsikuivryfh.supabase.co
// ─────────────────────────────────────────────────────────────────────────────

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://ibsnzlcdtgsikuivryfh.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlic256bGNkdGdzaWt1aXZyeWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MTE4NzEsImV4cCI6MjA5MDQ4Nzg3MX0.WhEq55n9YRz5oDCAcRfPHSUb7zbkLL2vd6H307eVBxE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─────────────────────────────────────────────────────────────────────────────
// Database type helpers
// ─────────────────────────────────────────────────────────────────────────────

export type Tables =
  | 'rig_moves'
  | 'look_ahead_tasks'
  | 'ddor_reports'
  | 'billing_tickets'
  | 'billing_ticket_days'
  | 'npt_events'
  | 'utilization'
  | 'well_tracking'
  | 'npt_billing'
  | 'fuel_consumption'
  | 'revenue'
  | 'crm_scores'
  | 'billing_accruals';
