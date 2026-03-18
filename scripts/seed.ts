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

// ─── Supabase client (reads from env or falls back to hardcoded) ───────────
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://ydvccqwtpofygzxveckj.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdmNjcXd0cG9meWd6eHZlY2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0ODI1MDAsImV4cCI6MjA1ODA1ODUwMH0.GM7LpHmbWUy0yr06hrsQ6d-CBmpbZWYAB-BH_-Zujh8';

const sb = createClient(supabaseUrl, supabaseKey);

async function run(name: string, fn: () => Promise<void>) {
  process.stdout.write(`  ▸ Seeding ${name}...`);
  try {
    await fn();
    console.log(' ✓');
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(` ✗  ${msg}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Rig Moves
// ─────────────────────────────────────────────────────────────────────────────
async function seedRigMoves() {
  const rows = rigMoveData.map((r) => ({
    rig: r.rig,
    from_location: r.from,
    to_location: r.to,
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
    dept: t.dept,
    task: t.task,
    sop: t.sop ?? null,
    day: t.day,
    check_d1: t.checks[0] ?? false,
    check_d2: t.checks[1] ?? false,
    check_d3: t.checks[2] ?? false,
    check_d4: t.checks[3] ?? false,
    check_d5: t.checks[4] ?? false,
    check_d6: t.checks[5] ?? false,
    check_d7: t.checks[6] ?? false,
    check_d8: t.checks[7] ?? false,
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
        month: ticket.month,
        year: ticket.year ?? 2025,
        daily_rate: ticket.dailyRate ?? null,
      })
      .select('id')
      .single();
    if (headerErr) throw headerErr;
    const ticketId = headerData.id;

    // Insert days
    const days = ticket.days?.map((d: { day: number; rateType: string; hours: number }) => ({
      ticket_id: ticketId,
      day_number: d.day,
      rate_type: d.rateType,
      hours: d.hours,
      amount: null,
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
  const rows = nptEvents.map((e) => ({
    rig: e.rig,
    event_date: e.eventDate ?? e.date ?? new Date().toISOString().slice(0, 10),
    year: e.year ?? 2025,
    month: e.month ?? 'Jan',
    hours: e.hours,
    npt_system: e.nptSystem,
    parent_equip: e.parentEquip ?? null,
    part_equip: e.partEquip ?? null,
    contractual_process: e.contractualProcess ?? null,
    dept_resp: e.deptResp ?? null,
    imm_cause: e.immCause ?? null,
    root_cause: e.rootCause ?? null,
    corrective: e.corrective ?? null,
    future_action: e.futureAction ?? null,
    action_party: e.actionParty ?? null,
    field: e.field ?? null,
    well_name: e.wellName ?? null,
    remarks: e.remarks ?? null,
  }));
  const { error } = await sb.from('npt_events').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Utilization
// ─────────────────────────────────────────────────────────────────────────────
async function seedUtilization() {
  const rows = utilData.map((u) => ({
    month: u.month,
    year: u.year ?? 2025,
    op_hours: u.op ?? 0,
    rd_hours: u.rd ?? 0,
    bkd_hours: u.bkd ?? 0,
    sp_hours: u.sp ?? 0,
    zr_hours: u.zr ?? 0,
    sk_hours: u.sk ?? 0,
    total_hours: (u.op ?? 0) + (u.rd ?? 0) + (u.bkd ?? 0) + (u.sp ?? 0) + (u.zr ?? 0) + (u.sk ?? 0),
    utilization_pct: u.utilPct ?? null,
  }));
  const { error } = await sb.from('utilization').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Well Tracking
// ─────────────────────────────────────────────────────────────────────────────
async function seedWellTracking() {
  const rows = wellTracking.map((w) => ({
    rig: w.rig,
    well_name: w.wellName,
    field: w.field ?? null,
    spud_date: w.spudDate ?? null,
    td_date: w.tdDate ?? null,
    budget_days: w.budgetDays ?? null,
    actual_days: w.actualDays ?? null,
    depth_target: w.depthTarget ?? null,
    depth_actual: w.depthActual ?? null,
    status: w.status ?? null,
    rig_move_date: w.rigMoveDate ?? null,
    contracting_co: w.contractingCo ?? null,
    remarks: w.remarks ?? null,
  }));
  const { error } = await sb.from('well_tracking').insert(rows);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. NPT Billing (per rig, per month)
// ─────────────────────────────────────────────────────────────────────────────
async function seedNptBilling() {
  const rows: object[] = [];
  for (const entry of nptBillingData) {
    MONTHS.forEach((month, idx) => {
      rows.push({
        rig: entry.rig,
        month,
        year: 2025,
        opr_rate: entry.oprRate?.[idx] ?? null,
        reduce_rate: entry.reduceRate?.[idx] ?? null,
        repair_rate: entry.repairRate?.[idx] ?? null,
        zero_rate: entry.zeroRate?.[idx] ?? null,
        special_rate: entry.specialRate?.[idx] ?? null,
        rig_move_reduce: entry.rigMoveReduce?.[idx] ?? null,
        rig_move: entry.rigMove?.[idx] ?? null,
        a_maint: entry.aMaint?.[idx] ?? null,
        a_maint_zero: entry.aMaintZero?.[idx] ?? null,
      });
    });
  }
  // Insert in batches of 100
  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await sb.from('npt_billing').insert(rows.slice(i, i + 100));
    if (error) throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Fuel Consumption (per rig, per month)
// ─────────────────────────────────────────────────────────────────────────────
async function seedFuelConsumption() {
  const rows: object[] = [];
  for (const entry of fuelData) {
    MONTHS.forEach((month, idx) => {
      const rigEngine = entry.rigEngine?.[idx] ?? 0;
      const campEngine = entry.campEngine?.[idx] ?? 0;
      const invoiceClient = entry.invoiceClient?.[idx] ?? 0;
      const otherSite = entry.otherSite?.[idx] ?? 0;
      const vehicles = entry.vehicles?.[idx] ?? 0;
      const totalConsumed = rigEngine + campEngine + invoiceClient + otherSite + vehicles;
      const openingStock = entry.openingStock?.[idx] ?? 0;
      const received = entry.received?.[idx] ?? 0;

      rows.push({
        rig: entry.rig,
        month,
        year: 2025,
        opening_stock: openingStock,
        received,
        rig_engine: rigEngine,
        camp_engine: campEngine,
        invoice_client: invoiceClient,
        other_site: otherSite,
        vehicles,
        total_consumed: totalConsumed,
        closing_balance: openingStock + received - totalConsumed,
        po1: entry.po1 ?? null,
        po2: entry.po2 ?? null,
        po3: entry.po3 ?? null,
      });
    });
  }
  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await sb.from('fuel_consumption').insert(rows.slice(i, i + 100));
    if (error) throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. Revenue (per rig, per month)
// ─────────────────────────────────────────────────────────────────────────────
async function seedRevenue() {
  const rows: object[] = [];
  for (const entry of revenueData) {
    MONTHS.forEach((month, idx) => {
      const opRev = entry.opRevenue?.[idx] ?? 0;
      const rdRev = entry.rdRevenue?.[idx] ?? 0;
      const spRev = entry.spRevenue?.[idx] ?? 0;
      const rmRev = entry.rigMoveRevenue?.[idx] ?? 0;
      const otherRev = entry.otherRevenue?.[idx] ?? 0;

      rows.push({
        rig: entry.rig,
        month,
        year: 2025,
        op_revenue: opRev,
        rd_revenue: rdRev,
        sp_revenue: spRev,
        rig_move_revenue: rmRev,
        other_revenue: otherRev,
        total_revenue: opRev + rdRev + spRev + rmRev + otherRev,
      });
    });
  }
  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await sb.from('revenue').insert(rows.slice(i, i + 100));
    if (error) throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CRM Scores (per rig, per month)
// ─────────────────────────────────────────────────────────────────────────────
async function seedCrmScores() {
  const rows: object[] = [];
  for (const entry of crmMonthlyData) {
    MONTHS.forEach((month, idx) => {
      rows.push({
        rig: entry.rig,
        month,
        year: 2025,
        score: entry.scores?.[idx] ?? null,
        category: entry.category ?? null,
        client: entry.client ?? null,
        notes: null,
      });
    });
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
  const rows = billingAccrualsData.map((b) => ({
    rig: b.rig,
    month: b.month ?? 'Jan',
    year: b.year ?? 2025,
    wbs: b.wbs ?? null,
    network: b.network ?? null,
    op_hours: b.opHours ?? null,
    rd_hours: b.rdHours ?? null,
    sp_hours: b.spHours ?? null,
    sk_hours: b.skHours ?? null,
    zr_hours: b.zrHours ?? null,
    bkd_hours: b.bkdHours ?? null,
    rig_move_amt: b.rigMoveAmt ?? null,
    field_name: b.fieldName ?? null,
    area: b.area ?? null,
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
