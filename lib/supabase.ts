import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// Supabase client — Haithamlamki Drilling Operations project
// Project: haithamlamki-drilling-ops  (separate from Muscat Bay)
// URL:     https://ydvccqwtpofygzxveckj.supabase.co
// ─────────────────────────────────────────────────────────────────────────────

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://ydvccqwtpofygzxveckj.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdmNjcXd0cG9meWd6eHZlY2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0ODI1MDAsImV4cCI6MjA1ODA1ODUwMH0.GM7LpHmbWUy0yr06hrsQ6d-CBmpbZWYAB-BH_-Zujh8';

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
