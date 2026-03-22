/**
 * scripts/seed.ts — One-time seed script for haithamlamki-drilling-ops Supabase project
 *
 * Reads data from lib/data.ts and inserts it into all 13 Supabase tables.
 *
 * Run with:
 *   npx tsx scripts/seed.ts
 *
 * Prerequisites:
 *   npm install tsx @supabase/supabase-js
 *   Copy .env.example to .env.local and fill in Supabase credentials.
 *
 * WARNING: This script will INSERT new rows. If run twice it will create duplicates.
 *          Clear tables first if re-seeding: use Supabase dashboard → SQL editor:
 *          TRUNCATE rig_moves, look_ahead_tasks, ddor_reports, billing_tickets,
 *                   billing_ticket_days, npt_events, utilization, well_tracking,
 *                   npt_billing, fuel_consumption, revenue, crm_scores, billing_accruals
 *                   RESTART IDENTITY CASCADE;
 */

import { createClient } from '@supabase/supabase-js';
import {
  rigMoveData,
  lookAheadTasks,
  billingTickets,
  nptEvents,
  utilData,
  wellTracking,
  nptBillingData,
  fuelData,
  revenueData,
  crmMonthlyData,
  billingAccrualsData,
  MONTHS,
} from '../lib/data';

// ─── Helper: convert month number (01-12) or date string to month name ───────
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function getMonthName(dateStr: string | undefined): string {
  if (!dateStr) return 'Jun'; // fallback
  // If it's a date like "05-Jun-2025" or "15-Jun-2025", extract month name directly
  const parts = dateStr.split('-');
  if (parts.length >= 2) {
    const monthPart = parts[1];
    // Check if it's already a month name
    if (MONTH_NAMES.includes(monthPart)) return monthPart;
    // Otherwise it's a number
    const monthNum = parseInt(monthPart, 10);
    if (monthNum >= 1 && monthNum <= 12) return MONTH_NAMES[monthNum - 1];
  }
  return 'Jun';
}

// ─── Helper: normalize rig name to avoid "Rig Rig 103" ───────────────────────
function normalizeRigName(rig: string | undefined | null): string {
  if (!rig) return 'Rig 103';
  const trimmed = rig.trim();
  if (/^\s*rig\b/i.test(trimmed)) return trimmed;
  return `Rig ${trimmed}`;
}

// ─── Supabase client ─────────────────────────────────────────────────────────
// Load environment variables - require dotenv for local dev
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set. Add it to .env.local');
  process.exit(1);
}
if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local');
  process.exit(1);
}

const sb = createClient(supabaseUrl, supabaseKey);

async function run(name: string, fn: () => Promise<void>) {
  process.stdout.write(`  ▸ Seeding ${name}...`);
  try {
    await fn();
    console.log(' ✓');
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : JSON.stringify(e, null, 2);
    console.log(` ✗  ${msg}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Rig Moves
// ─────────────────────────────────────────────────────────────────────────────
async function seedRigMoves() {
  const rows = rigMoveData.map((r) => ({
    rig: r.rig,
    move_from: r.from,
    move_to: r.to,
    budget_days: r.budgetDays,
    actual_days: r.actualDays,
    budget_cost: r.budgetCost,
    actual_cost: r.actualCost,
    client_income: r.clientIncome,
    distance_km: r.distance,
    mover_company: r.moverCompany,
    start_date: r.startDate,
    end_date: r.endDate,
    status: r.status,
    remarks: r.remarks ?? null,
  }));
  const { error } = await sb.from('rig_moves').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Look-Ahead Tasks
// ─────────────────────────────────────────────────────────────────────────────
async function seedLookAheadTasks() {
  const rows = lookAheadTasks.map((t) => ({
    rig: t.rig ?? 'Rig 103',
    well: t.well ?? null,
    report_date: t.reportDate ?? new Date().toISOString().slice(0, 10),
    dept: t.dept,
    task: t.task,
    sop_ref: t.sop ?? null,
    day_slot: t.day ?? null,
    ptw: t.checks?.[0] ?? false,
    isolation: t.checks?.[1] ?? false,
    jsa_sop: t.checks?.[2] ?? false,
    lift_plan: t.checks?.[3] ?? false,
    moc: t.checks?.[4] ?? false,
    out_of_sight: t.checks?.[5] ?? false,
    self_verify: t.checks?.[6] ?? false,
    fall_protection: t.checks?.[7] ?? false,
  }));
  const { error } = await sb.from('look_ahead_tasks').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Billing Tickets + Days
// ─────────────────────────────────────────────────────────────────────────────
async function seedBillingTickets() {
  for (const ticket of billingTickets) {
    // Insert header
    const { data: headerData, error: headerErr } = await sb
      .from('billing_tickets')
      .insert({
        rig: ticket.rig,
        well_name: ticket.well ?? null,
        wbs: ticket.wbs ?? null,
        billing_period: ticket.billingPeriod ?? null,
        rig_move_date: ticket.rigMoveDate ?? null,
        spud_date: ticket.spudDate ?? null,
        release_date: ticket.releaseDate || null,
      })
      .select('id')
      .single();
    if (headerErr) throw headerErr;
    const ticketId = headerData.id;

    // Insert days
    const days = ticket.days?.map((d: { day: number; date: string; rate: string; hrs: number; remarks?: string }) => ({
      ticket_id: ticketId,
      day_number: d.day,
      entry_date: d.date,
      rate_type: d.rate,
      hours: d.hrs,
      revenue: null,
      remarks: d.remarks || null,
    })) ?? [];

    if (days.length > 0) {
      const { error: daysErr } = await sb.from('billing_ticket_days').insert(days);
      if (daysErr) throw daysErr;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. NPT Events
// ─────────────────────────────────────────────────────────────────────────────
async function seedNptEvents() {
  const rows = nptEvents.map((e: { rig: string; date: string; type: string; hrs: number; system: string; parentEquip?: string; partEquip?: string; deptResp?: string; immCause?: string; rootCause?: string; corrective?: string; futureAction?: string; actionParty?: string; contractualProcess?: string }) => ({
    rig: e.rig,
    event_date: e.date ?? new Date().toISOString().slice(0, 10),
    year: 2025,
    month: getMonthName(e.date),
    hours: e.hrs,
    npt_type: e.type ?? 'Abraj',
    system_category: e.system ?? null,
    parent_equipment: e.parentEquip ?? null,
    part_equipment: e.partEquip ?? null,
    contractual_process: e.contractualProcess ?? null,
    dept_responsibility: e.deptResp ?? null,
    immediate_cause: e.immCause ?? null,
    root_cause: e.rootCause ?? null,
    corrective_action: e.corrective ?? null,
    future_action: e.futureAction ?? null,
    action_party: e.actionParty ?? null,
    notification_number: null,
  }));
  const { error } = await sb.from('npt_events').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Utilization
// ─────────────────────────────────────────────────────────────────────────────
async function seedUtilization() {
  const rows = utilData.map((u: { m: string; op: number; rd: number; bkd: number; zero: number; sp: number }) => {
    const opHours = u.op ?? 0;
    const nptHours = (u.rd ?? 0) + (u.bkd ?? 0) + (u.zero ?? 0);
    const totalHours = opHours + nptHours;
    const nptPct = totalHours > 0 ? (nptHours / totalHours) * 100 : 0;
    return {
      rig: 'Fleet',
      month: u.m,
      year: 2025,
      op_hours: opHours,
      npt_hours: nptHours,
      npt_pct: Math.round(nptPct * 100) / 100, // round to 2 decimals
      npt_type: null,
      allowable_npt: null,
      working_days: null,
      comment: null,
    };
  });
  const { error } = await sb.from('utilization').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Well Tracking
// ─────────────────────────────────────────────────────────────────────────────
async function seedWellTracking() {
  const rows = wellTracking.map((w: { rig: string; well: string; field?: string; rigMoveDate?: string; spud?: string; releaseDate?: string; tTD?: number; cTD?: number; afeD?: number; actD?: number; contractingCo?: string; status?: string; year?: number; month?: string }) => ({
    rig: normalizeRigName(w.rig),
    well_name: w.well,
    field: w.field || null,
    rig_move_date: w.rigMoveDate || null,
    spud_date: w.spud || null,
    release_date: w.releaseDate || null,
    total_depth: w.tTD ?? null,
    current_depth: w.cTD ?? null,
    afe_days: w.afeD ?? null,
    actual_days: w.actD ?? null,
    contracting_co: w.contractingCo || null,
    status: w.status || null,
    year: w.year ?? 2025,
    month: w.month || null,
  }));
  const { error } = await sb.from('well_tracking').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. NPT Billing (per rig, per month)
// ─────────────────────────────────────────────────────────────────────────────
async function seedNptBilling() {
  const rows = nptBillingData.map((entry: { rig: string; month: string; year: number; oprRate: number; reduceRate: number; repairRate: number; zeroRate: number; specialRate: number; rigMoveReduce: number; rigMove: number; aMaint: number; aMaintZero: number }) => ({
    rig: entry.rig,
    month: entry.month,
    year: entry.year ?? 2025,
    opr_rate_hrs: entry.oprRate ?? null,
    reduce_rate_hrs: entry.reduceRate ?? null,
    repair_rate_hrs: entry.repairRate ?? null,
    zero_rate_hrs: entry.zeroRate ?? null,
    special_rate_hrs: entry.specialRate ?? null,
    rig_move_reduce: entry.rigMoveReduce ?? null,
    rig_move_hrs: entry.rigMove ?? null,
    a_maint_hrs: entry.aMaint ?? null,
    a_maint_zero_hrs: entry.aMaintZero ?? null,
  }));
  const { error } = await sb.from('npt_billing').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Fuel Consumption (per rig, per month)
// ─────────────────────────────────────────────────────────────────────────────
async function seedFuelConsumption() {
  const rows = fuelData.map((entry: { rig: string; year: number; month: string; openingStock: number; received: number; rigEngine: number; campEngine: number; invoiceClient: number; otherSite: number; vehicles: number; consumed: number; closingBalance: number; po1: string; po2: string; po3: string }) => ({
    rig: entry.rig,
    month: entry.month,
    year: entry.year ?? 2025,
    opening_stock: entry.openingStock ?? 0,
    received: entry.received ?? 0,
    rig_engine: entry.rigEngine ?? 0,
    camp_engine: entry.campEngine ?? 0,
    invoice_client: entry.invoiceClient ?? 0,
    other_site: entry.otherSite ?? 0,
    vehicles: entry.vehicles ?? 0,
    total_consumed: entry.consumed ?? 0,
    closing_balance: entry.closingBalance ?? 0,
    po1: entry.po1 || null,
    po2: entry.po2 || null,
    po3: entry.po3 || null,
  }));
  const { error } = await sb.from('fuel_consumption').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. Revenue (per rig, per month)
// ─────────────────────────────────────────────────────────────────────────────
async function seedRevenue() {
  const rows = revenueData.map((entry: { rig: string; month: string; year: number; actual: number; fuel: number; budgeted: number; nptRepair: number; nptZero: number; comments?: string }) => ({
    rig: entry.rig,
    month: entry.month,
    year: entry.year ?? 2025,
    actual: entry.actual ?? null,
    fuel: entry.fuel ?? null,
    budgeted: entry.budgeted ?? null,
    npt_repair: entry.nptRepair ?? 0,
    npt_zero: entry.nptZero ?? 0,
    comments: entry.comments ?? null,
  }));
  const { error } = await sb.from('revenue').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CRM Scores (per rig, per month)
// ─────────────────────────────────────────────────────────────────────────────
async function seedCrmScores() {
  const rows: object[] = [];
  for (const entry of crmMonthlyData) {
    // scores is an object like { Jan: 100, Feb: 100, ... }
    const scores = entry.scores as Record<string, number>;
    for (const month of MONTHS) {
      rows.push({
        rig: entry.rig,
        month,
        year: entry.year ?? 2025,
        score: scores?.[month] ?? null,
      });
    }
  }
  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await sb.from('crm_scores').insert(rows.slice(i, i + 100));
    if (error) throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. Billing Accruals
// ─────────────────────────────────────────────────────────────────────────────
async function seedBillingAccruals() {
  const rows = billingAccrualsData.map((b: { rig: string; wbs?: string; well?: string; network?: number; oppHrs?: number; reduceHrs?: number; bkdHrs?: number; zeroHrs?: number; specialRate?: number; stacked?: number; rigMove?: number; totalHrs?: number; rigMoveAmt?: number; fieldName?: string; area?: string; date?: string; remarks?: string }) => ({
    rig: b.rig,
    wbs: b.wbs ?? null,
    well_name: b.well ?? null,
    network: b.network?.toString() ?? null,
    opp_hrs: b.oppHrs ?? 0,
    reduce_hrs: b.reduceHrs ?? 0,
    bkd_hrs: b.bkdHrs ?? 0,
    zero_hrs: b.zeroHrs ?? 0,
    special_rate: b.specialRate ?? 0,
    stacked_hrs: b.stacked ?? 0,
    rig_move_hrs: b.rigMove ?? 0,
    total_hrs: b.totalHrs ?? ((b.oppHrs ?? 0) + (b.reduceHrs ?? 0) + (b.bkdHrs ?? 0) + (b.zeroHrs ?? 0) + (b.stacked ?? 0) + (b.rigMove ?? 0)),
    rig_move_amt: b.rigMoveAmt ?? 0,
    field_name: b.fieldName ?? null,
    area: b.area ?? null,
    billing_date: b.date ?? null,
    remarks: b.remarks ?? null,
  }));
  const { error } = await sb.from('billing_accruals').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🛢  Seeding haithamlamki-drilling-ops Supabase project...\n');

  await run('rig_moves', seedRigMoves);
  await run('look_ahead_tasks', seedLookAheadTasks);
  await run('billing_tickets + days', seedBillingTickets);
  await run('npt_events', seedNptEvents);
  await run('utilization', seedUtilization);
  await run('well_tracking', seedWellTracking);
  await run('npt_billing', seedNptBilling);
  await run('fuel_consumption', seedFuelConsumption);
  await run('revenue', seedRevenue);
  await run('crm_scores', seedCrmScores);
  await run('billing_accruals', seedBillingAccruals);

  console.log('\n✅  Seed complete.\n');
}

main().catch((e) => {
  console.error('\n❌  Seed failed:', e);
  process.exit(1);
});
