/**
 * lib/db.ts — Typed CRUD helpers for haithamlamki-drilling-ops Supabase project
 *
 * Usage example:
 *   import { RigMoves, NptEvents } from '@/lib/db';
 *   const moves = await RigMoves.getAll();
 *   await RigMoves.insert({ rig: 'Rig 103', ... });
 */

import { supabase } from './supabase';

// ─────────────────────────────────────────────────────────────────────────────
// Generic helpers
// ─────────────────────────────────────────────────────────────────────────────

async function getAll<T>(table: string): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*').order('id');
  if (error) throw new Error(`[${table}] getAll: ${error.message}`);
  return (data ?? []) as T[];
}

async function getById<T>(table: string, id: number): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(`[${table}] getById(${id}): ${error.message}`);
  return (data ?? null) as T | null;
}

async function insert<T>(table: string, row: Omit<T, 'id'>): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .insert(row)
    .select()
    .single();
  if (error) throw new Error(`[${table}] insert: ${error.message}`);
  return data as T;
}

async function insertMany<T>(table: string, rows: Omit<T, 'id'>[]): Promise<T[]> {
  const { data, error } = await supabase.from(table).insert(rows).select();
  if (error) throw new Error(`[${table}] insertMany: ${error.message}`);
  return (data ?? []) as T[];
}

async function update<T>(table: string, id: number, patch: Partial<T>): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`[${table}] update(${id}): ${error.message}`);
  return data as T;
}

async function remove(table: string, id: number): Promise<void> {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(`[${table}] delete(${id}): ${error.message}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Rig Moves  (Sheet 1)
// ─────────────────────────────────────────────────────────────────────────────
export interface RigMove {
  id: number;
  rig: string;
  move_from: string | null;
  move_to: string | null;
  budget_days: number | null;
  actual_days: number | null;
  budget_cost: number | null;
  actual_cost: number | null;
  client_income: number | null;
  distance_km: string | null;
  mover_company: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  remarks: string | null;
  created_at?: string;
  updated_at?: string;
}

export const RigMoves = {
  getAll: () => getAll<RigMove>('rig_moves'),
  getById: (id: number) => getById<RigMove>('rig_moves', id),
  insert: (row: Omit<RigMove, 'id' | 'created_at' | 'updated_at'>) => insert<RigMove>('rig_moves', row),
  insertMany: (rows: Omit<RigMove, 'id' | 'created_at' | 'updated_at'>[]) => insertMany<RigMove>('rig_moves', rows),
  update: (id: number, patch: Partial<RigMove>) => update<RigMove>('rig_moves', id, patch),
  delete: (id: number) => remove('rig_moves', id),
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Look-Ahead Tasks  (Sheet 2)
// ─────────────────────────────────────────────────────────────────────────────
export interface LookAheadTask {
  id: number;
  rig: string | null;
  well: string | null;
  report_date: string | null;
  dept: string | null;
  task: string;
  sop_ref: string | null;
  day_slot: string | null;
  ptw: boolean;
  isolation: boolean;
  jsa_sop: boolean;
  lift_plan: boolean;
  moc: boolean;
  out_of_sight: boolean;
  self_verify: boolean;
  fall_protection: boolean;
  created_at?: string;
}

export const LookAheadTasks = {
  getAll: () => getAll<LookAheadTask>('look_ahead_tasks'),
  getById: (id: number) => getById<LookAheadTask>('look_ahead_tasks', id),
  insert: (row: Omit<LookAheadTask, 'id' | 'created_at'>) => insert<LookAheadTask>('look_ahead_tasks', row),
  insertMany: (rows: Omit<LookAheadTask, 'id' | 'created_at'>[]) => insertMany<LookAheadTask>('look_ahead_tasks', rows),
  update: (id: number, patch: Partial<LookAheadTask>) => update<LookAheadTask>('look_ahead_tasks', id, patch),
  delete: (id: number) => remove('look_ahead_tasks', id),
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. DDOR Reports  (Sheet 3)
// ─────────────────────────────────────────────────────────────────────────────
export interface DdorReport {
  id: number;
  rig: string;
  well_name: string | null;
  wbs: string | null;
  network: string | null;
  report_date: string;
  rig_status: string | null;
  current_depth: number | null;
  prev_depth: number | null;
  footage: number | null;
  days_on_well: number | null;
  current_phase: string | null;
  mud_weight: number | null;
  viscosity: number | null;
  wob: number | null;
  rop_avg: number | null;
  rop_max: number | null;
  spm: number | null;
  standpipe_psi: number | null;
  rotating_hrs: number | null;
  npt_hrs: number | null;
  npt_system: string | null;
  npt_description: string | null;
  created_at?: string;
}

export const DdorReports = {
  getAll: () => getAll<DdorReport>('ddor_reports'),
  getByRig: async (rig: string): Promise<DdorReport[]> => {
    const { data, error } = await supabase
      .from('ddor_reports')
      .select('*')
      .eq('rig', rig)
      .order('report_date');
    if (error) throw new Error(`[ddor_reports] getByRig: ${error.message}`);
    return (data ?? []) as DdorReport[];
  },
  insert: (row: Omit<DdorReport, 'id' | 'created_at'>) => insert<DdorReport>('ddor_reports', row),
  insertMany: (rows: Omit<DdorReport, 'id' | 'created_at'>[]) => insertMany<DdorReport>('ddor_reports', rows),
  update: (id: number, patch: Partial<DdorReport>) => update<DdorReport>('ddor_reports', id, patch),
  delete: (id: number) => remove('ddor_reports', id),
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Billing Tickets  (Sheet 4)
// ─────────────────────────────────────────────────────────────────────────────
export interface BillingTicket {
  id: number;
  rig: string;
  well_name: string | null;
  wbs: string | null;
  billing_period: string | null;
  rig_move_date: string | null;
  spud_date: string | null;
  release_date: string | null;
  created_at?: string;
}

export interface BillingTicketDay {
  id: number;
  ticket_id: number;
  day_number: number | null;
  entry_date: string | null;
  rate_type: string | null;
  hours: number | null;
  revenue: number | null;
  remarks: string | null;
  created_at?: string;
}

export const BillingTickets = {
  getAll: () => getAll<BillingTicket>('billing_tickets'),
  getById: (id: number) => getById<BillingTicket>('billing_tickets', id),
  insert: (row: Omit<BillingTicket, 'id' | 'created_at'>) => insert<BillingTicket>('billing_tickets', row),
  insertMany: (rows: Omit<BillingTicket, 'id' | 'created_at'>[]) => insertMany<BillingTicket>('billing_tickets', rows),
  update: (id: number, patch: Partial<BillingTicket>) => update<BillingTicket>('billing_tickets', id, patch),
  delete: (id: number) => remove('billing_tickets', id),
  getDays: async (ticketId: number): Promise<BillingTicketDay[]> => {
    const { data, error } = await supabase
      .from('billing_ticket_days')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('day_number');
    if (error) throw new Error(`[billing_ticket_days] getDays: ${error.message}`);
    return (data ?? []) as BillingTicketDay[];
  },
  insertDay: (row: Omit<BillingTicketDay, 'id' | 'created_at'>) =>
    insert<BillingTicketDay>('billing_ticket_days', row),
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. NPT Events  (Sheet 5 — YTD NPT Details)
// ─────────────────────────────────────────────────────────────────────────────
export interface NptEvent {
  id: number;
  rig: string;
  event_date: string;
  year: number | null;
  month: string | null;
  npt_type: string | null;
  hours: number | null;
  system_category: string | null;
  parent_equipment: string | null;
  part_equipment: string | null;
  contractual_process: string | null;
  dept_responsibility: string | null;
  immediate_cause: string | null;
  root_cause: string | null;
  corrective_action: string | null;
  future_action: string | null;
  action_party: string | null;
  notification_number: string | null;
  created_at?: string;
  updated_at?: string;
}

export const NptEvents = {
  getAll: () => getAll<NptEvent>('npt_events'),
  getByRig: async (rig: string): Promise<NptEvent[]> => {
    const { data, error } = await supabase
      .from('npt_events')
      .select('*')
      .eq('rig', rig)
      .order('event_date');
    if (error) throw new Error(`[npt_events] getByRig: ${error.message}`);
    return (data ?? []) as NptEvent[];
  },
  getByYear: async (year: number): Promise<NptEvent[]> => {
    const { data, error } = await supabase
      .from('npt_events')
      .select('*')
      .eq('year', year)
      .order('event_date');
    if (error) throw new Error(`[npt_events] getByYear: ${error.message}`);
    return (data ?? []) as NptEvent[];
  },
  insert: (row: Omit<NptEvent, 'id' | 'created_at' | 'updated_at'>) => insert<NptEvent>('npt_events', row),
  insertMany: (rows: Omit<NptEvent, 'id' | 'created_at' | 'updated_at'>[]) => insertMany<NptEvent>('npt_events', rows),
  update: (id: number, patch: Partial<NptEvent>) => update<NptEvent>('npt_events', id, patch),
  delete: (id: number) => remove('npt_events', id),
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. Utilization  (Sheet 6)
// ─────────────────────────────────────────────────────────────────────────────
export interface Utilization {
  id: number;
  rig: string;
  year: number;
  month: string;
  op_hours: number | null;
  npt_hours: number | null;
  npt_pct: number | null;
  npt_type: string | null;
  allowable_npt: string | null;
  working_days: number | null;
  comment: string | null;
  created_at?: string;
}

export const UtilizationData = {
  getAll: () => getAll<Utilization>('utilization'),
  getByYear: async (year: number): Promise<Utilization[]> => {
    const { data, error } = await supabase
      .from('utilization')
      .select('*')
      .eq('year', year)
      .order('id');
    if (error) throw new Error(`[utilization] getByYear: ${error.message}`);
    return (data ?? []) as Utilization[];
  },
  insert: (row: Omit<Utilization, 'id' | 'created_at'>) => insert<Utilization>('utilization', row),
  insertMany: (rows: Omit<Utilization, 'id' | 'created_at'>[]) => insertMany<Utilization>('utilization', rows),
  update: (id: number, patch: Partial<Utilization>) => update<Utilization>('utilization', id, patch),
  upsertByMonth: async (rig: string, year: number, month: string, data: Partial<Utilization>): Promise<void> => {
    const { error } = await supabase
      .from('utilization')
      .upsert({ rig, year, month, ...data }, { onConflict: 'rig,year,month' });
    if (error) throw new Error(`[utilization] upsert: ${error.message}`);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. Well Tracking  (Sheet 7)
// ─────────────────────────────────────────────────────────────────────────────
export interface WellTracking {
  id: number;
  rig: string;
  well_name: string;
  field: string | null;
  rig_move_date: string | null;
  spud_date: string | null;
  release_date: string | null;
  total_depth: number | null;
  current_depth: number | null;
  afe_days: number | null;
  actual_days: number | null;
  contracting_co: string | null;
  status: string | null;
  year: number | null;
  month: string | null;
  created_at?: string;
  updated_at?: string;
}

export const WellTrackingData = {
  getAll: () => getAll<WellTracking>('well_tracking'),
  getByRig: async (rig: string): Promise<WellTracking[]> => {
    const { data, error } = await supabase
      .from('well_tracking')
      .select('*')
      .eq('rig', rig)
      .order('spud_date');
    if (error) throw new Error(`[well_tracking] getByRig: ${error.message}`);
    return (data ?? []) as WellTracking[];
  },
  insert: (row: Omit<WellTracking, 'id' | 'created_at' | 'updated_at'>) => insert<WellTracking>('well_tracking', row),
  insertMany: (rows: Omit<WellTracking, 'id' | 'created_at' | 'updated_at'>[]) => insertMany<WellTracking>('well_tracking', rows),
  update: (id: number, patch: Partial<WellTracking>) => update<WellTracking>('well_tracking', id, patch),
  delete: (id: number) => remove('well_tracking', id),
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. NPT Billing  (Sheet 8)
// ─────────────────────────────────────────────────────────────────────────────
export interface NptBilling {
  id: number;
  rig: string;
  year: number;
  month: string;
  opr_rate_hrs: number | null;
  reduce_rate_hrs: number | null;
  repair_rate_hrs: number | null;
  zero_rate_hrs: number | null;
  special_rate_hrs: number | null;
  rig_move_reduce: number | null;
  rig_move_hrs: number | null;
  a_maint_hrs: number | null;
  a_maint_zero_hrs: number | null;
  eticket_total: number | null;
  mismatch: boolean | null;
  created_at?: string;
}

export const NptBillingData = {
  getAll: () => getAll<NptBilling>('npt_billing'),
  getByRig: async (rig: string): Promise<NptBilling[]> => {
    const { data, error } = await supabase
      .from('npt_billing')
      .select('*')
      .eq('rig', rig)
      .order('year,month');
    if (error) throw new Error(`[npt_billing] getByRig: ${error.message}`);
    return (data ?? []) as NptBilling[];
  },
  insert: (row: Omit<NptBilling, 'id' | 'created_at'>) => insert<NptBilling>('npt_billing', row),
  insertMany: (rows: Omit<NptBilling, 'id' | 'created_at'>[]) => insertMany<NptBilling>('npt_billing', rows),
  update: (id: number, patch: Partial<NptBilling>) => update<NptBilling>('npt_billing', id, patch),
  upsertByRigMonth: async (rig: string, year: number, month: string, patch: Partial<NptBilling>): Promise<void> => {
    const { error } = await supabase
      .from('npt_billing')
      .upsert({ rig, year, month, ...patch }, { onConflict: 'rig,year,month' });
    if (error) throw new Error(`[npt_billing] upsert: ${error.message}`);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. Fuel Consumption  (Sheet 9)
// ─────────────────────────────────────────────────────────────────────────────
export interface FuelConsumption {
  id: number;
  rig: string;
  year: number;
  month: string;
  opening_stock: number | null;
  received: number | null;
  rig_engine: number | null;
  camp_engine: number | null;
  invoice_client: number | null;
  other_site: number | null;
  vehicles: number | null;
  total_consumed: number | null;
  closing_balance: number | null;
  po1: string | null;
  po2: string | null;
  po3: string | null;
  created_at?: string;
}

export const FuelConsumptionData = {
  getAll: () => getAll<FuelConsumption>('fuel_consumption'),
  getByRig: async (rig: string): Promise<FuelConsumption[]> => {
    const { data, error } = await supabase
      .from('fuel_consumption')
      .select('*')
      .eq('rig', rig)
      .order('year,month');
    if (error) throw new Error(`[fuel_consumption] getByRig: ${error.message}`);
    return (data ?? []) as FuelConsumption[];
  },
  insert: (row: Omit<FuelConsumption, 'id' | 'created_at'>) => insert<FuelConsumption>('fuel_consumption', row),
  insertMany: (rows: Omit<FuelConsumption, 'id' | 'created_at'>[]) => insertMany<FuelConsumption>('fuel_consumption', rows),
  update: (id: number, patch: Partial<FuelConsumption>) => update<FuelConsumption>('fuel_consumption', id, patch),
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. Revenue  (Sheet 10)
// ─────────────────────────────────────────────────────────────────────────────
export interface Revenue {
  id: number;
  rig: string;
  year: number;
  month: string;
  actual: number | null;
  fuel: number | null;
  budgeted: number | null;
  npt_repair: number | null;
  npt_zero: number | null;
  comments: string | null;
  created_at?: string;
}

export const RevenueData = {
  getAll: () => getAll<Revenue>('revenue'),
  getByRig: async (rig: string): Promise<Revenue[]> => {
    const { data, error } = await supabase
      .from('revenue')
      .select('*')
      .eq('rig', rig)
      .order('year,month');
    if (error) throw new Error(`[revenue] getByRig: ${error.message}`);
    return (data ?? []) as Revenue[];
  },
  getByYear: async (year: number): Promise<Revenue[]> => {
    const { data, error } = await supabase
      .from('revenue')
      .select('*')
      .eq('year', year)
      .order('rig');
    if (error) throw new Error(`[revenue] getByYear: ${error.message}`);
    return (data ?? []) as Revenue[];
  },
  insert: (row: Omit<Revenue, 'id' | 'created_at'>) => insert<Revenue>('revenue', row),
  insertMany: (rows: Omit<Revenue, 'id' | 'created_at'>[]) => insertMany<Revenue>('revenue', rows),
  update: (id: number, patch: Partial<Revenue>) => update<Revenue>('revenue', id, patch),
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. CRM Scores  (Sheet 11)
// ─────────────────────────────────────────────────────────────────────────────
export interface CrmScore {
  id: number;
  rig: string;
  year: number;
  month: string;
  score: number | null;
  created_at?: string;
}

export const CrmScores = {
  getAll: () => getAll<CrmScore>('crm_scores'),
  getByRig: async (rig: string): Promise<CrmScore[]> => {
    const { data, error } = await supabase
      .from('crm_scores')
      .select('*')
      .eq('rig', rig)
      .order('year,month');
    if (error) throw new Error(`[crm_scores] getByRig: ${error.message}`);
    return (data ?? []) as CrmScore[];
  },
  insert: (row: Omit<CrmScore, 'id' | 'created_at'>) => insert<CrmScore>('crm_scores', row),
  insertMany: (rows: Omit<CrmScore, 'id' | 'created_at'>[]) => insertMany<CrmScore>('crm_scores', rows),
  update: (id: number, patch: Partial<CrmScore>) => update<CrmScore>('crm_scores', id, patch),
  upsertByRigMonth: async (rig: string, year: number, month: string, patch: Partial<CrmScore>): Promise<void> => {
    const { error } = await supabase
      .from('crm_scores')
      .upsert({ rig, year, month, ...patch }, { onConflict: 'rig,year,month' });
    if (error) throw new Error(`[crm_scores] upsert: ${error.message}`);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 12. Billing Accruals  (Sheet 12)
// ─────────────────────────────────────────────────────────────────────────────
export interface BillingAccrual {
  id: number;
  rig: string;
  wbs: string | null;
  well_name: string | null;
  network: string | null;
  opp_hrs: number | null;
  reduce_hrs: number | null;
  bkd_hrs: number | null;
  zero_hrs: number | null;
  special_rate: number | null;
  stacked_hrs: number | null;
  rig_move_hrs: number | null;
  total_hrs: number | null;
  rig_move_amt: number | null;
  field_name: string | null;
  area: string | null;
  billing_date: string | null;
  remarks: string | null;
  created_at?: string;
}

export const BillingAccruals = {
  getAll: () => getAll<BillingAccrual>('billing_accruals'),
  getByRig: async (rig: string): Promise<BillingAccrual[]> => {
    const { data, error } = await supabase
      .from('billing_accruals')
      .select('*')
      .eq('rig', rig)
      .order('id');
    if (error) throw new Error(`[billing_accruals] getByRig: ${error.message}`);
    return (data ?? []) as BillingAccrual[];
  },
  insert: (row: Omit<BillingAccrual, 'id' | 'created_at'>) => insert<BillingAccrual>('billing_accruals', row),
  insertMany: (rows: Omit<BillingAccrual, 'id' | 'created_at'>[]) => insertMany<BillingAccrual>('billing_accruals', rows),
  update: (id: number, patch: Partial<BillingAccrual>) => update<BillingAccrual>('billing_accruals', id, patch),
  delete: (id: number) => remove('billing_accruals', id),
};
