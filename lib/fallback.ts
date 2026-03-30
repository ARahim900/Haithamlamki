/**
 * lib/fallback.ts — Offline mock data mapped to DB schema
 * Used when Supabase is unreachable (project paused/offline)
 */

import {
  rigMoveData, lookAheadTasks, ddorReports, billingTickets,
  nptEvents, utilData, wellTracking, nptBillingData,
  fuelData, revenueData, crmMonthlyData, billingAccrualsData,
} from './data';
import { MONTHS } from './data';

// Transform mock data to match Supabase DB column names

const rigMoves = rigMoveData.map(r => ({
  id: r.id, rig: r.rig, move_from: r.from, move_to: r.to,
  budget_days: r.budgetDays, actual_days: r.actualDays,
  budget_cost: r.budgetCost, actual_cost: r.actualCost,
  client_income: r.clientIncome, distance_km: r.distance,
  mover_company: r.moverCompany, start_date: r.startDate,
  end_date: r.endDate, status: r.status, remarks: r.remarks,
}));

const lookAhead = lookAheadTasks.map(t => ({
  id: t.id, rig: 'Rig 106', well: 'Yibal-612', report_date: '2025-06-15',
  dept: t.dept, task: t.task, sop_ref: t.sop, day_slot: t.day,
  ptw: t.checks[0], isolation: t.checks[1], jsa_sop: t.checks[2],
  lift_plan: t.checks[3], moc: t.checks[4], out_of_sight: t.checks[5],
  self_verify: t.checks[6], fall_protection: t.checks[7],
}));

const ddor = ddorReports.map((r, i) => ({
  id: r.id ?? i + 1, rig: r.rig, well_name: r.well, wbs: r.wbs,
  network: r.network, report_date: r.date, rig_status: r.status,
  current_depth: r.currentDepth, prev_depth: r.prevDepth,
  footage: r.footage, days_on_well: r.daysOnWell,
  current_phase: r.phase, mud_weight: null, viscosity: null,
  wob: null, rop_avg: null, rop_max: null, spm: null,
  standpipe_psi: null, rotating_hrs: null, npt_hrs: null,
  npt_system: null, npt_description: null,
}));

const billing = billingTickets.map(t => ({
  id: t.id, rig: t.rig, well_name: t.well, wbs: t.wbs,
  billing_period: t.billingPeriod, rig_move_date: t.rigMoveDate,
  spud_date: t.spudDate, release_date: t.releaseDate,
}));

const npt = nptEvents.map(e => ({
  id: e.id, rig: e.rig, event_date: e.date, year: 2025,
  month: 'Jun', npt_type: e.type, hours: e.hrs,
  system_category: e.system, parent_equipment: e.parentEquip,
  part_equipment: e.partEquip, contractual_process: e.contractualProcess ?? null,
  dept_responsibility: e.deptResp, immediate_cause: e.immCause,
  root_cause: e.rootCause, corrective_action: e.corrective,
  future_action: e.futureAction, action_party: e.actionParty,
  notification_number: null,
}));

const utilization = utilData.flatMap((u, i) => {
  const rigs = ['Rig 106', 'Rig 109', 'Rig 203'];
  return rigs.map((rig, ri) => ({
    id: i * 3 + ri + 1, rig, year: 2025, month: u.m,
    op_hours: u.op + (ri * 10), npt_hours: Math.round(720 - u.op - (ri * 10)),
    npt_pct: Math.round(((720 - u.op - (ri * 10)) / 720) * 100),
    npt_type: null, allowable_npt: null, working_days: 30, comment: null,
  }));
});

const wells = wellTracking.map((w, i) => ({
  id: i + 1, rig: w.rig, well_name: w.well, field: w.field,
  rig_move_date: w.rigMoveDate, spud_date: w.spud,
  release_date: w.releaseDate, total_depth: w.tTD,
  current_depth: w.cTD, afe_days: w.afeD, actual_days: w.actD,
  contracting_co: w.contractingCo, status: w.status,
  year: w.year, month: w.month,
}));

const nptBilling = nptBillingData.map((n, i) => ({
  id: i + 1, rig: n.rig, year: n.year, month: n.month,
  opr_rate_hrs: n.oprRate, reduce_rate_hrs: n.reduceRate,
  repair_rate_hrs: n.repairRate, zero_rate_hrs: n.zeroRate,
  special_rate_hrs: n.specialRate, rig_move_reduce: n.rigMoveReduce,
  rig_move_hrs: n.rigMove, a_maint_hrs: n.aMaint,
  a_maint_zero_hrs: n.aMaintZero, eticket_total: null, mismatch: false,
}));

const fuel = fuelData.map(f => ({
  id: f.id, rig: f.rig, year: f.year, month: f.month,
  opening_stock: f.openingStock, received: f.received,
  rig_engine: f.rigEngine, camp_engine: f.campEngine,
  invoice_client: f.invoiceClient, other_site: f.otherSite,
  vehicles: f.vehicles, total_consumed: f.consumed,
  closing_balance: f.closingBalance, po1: f.po1, po2: f.po2, po3: f.po3,
}));

const revenue = revenueData.map((r, i) => ({
  id: i + 1, rig: r.rig, year: r.year, month: r.month,
  actual: r.actual, fuel: r.fuel, budgeted: r.budgeted,
  npt_repair: r.nptRepair, npt_zero: r.nptZero, comments: r.comments,
}));

const crm: { id: number; rig: string; year: number; month: string; score: number }[] = [];
let crmId = 1;
for (const row of crmMonthlyData) {
  for (const m of MONTHS) {
    const score = (row.scores as Record<string, number>)[m];
    if (score != null && score > 0) {
      crm.push({ id: crmId++, rig: row.rig, year: row.year, month: m, score });
    }
  }
}

const accruals = billingAccrualsData.map((a, i) => ({
  id: i + 1, rig: a.rig, wbs: a.wbs, well_name: a.well,
  network: a.network, opp_hrs: a.oppHrs, reduce_hrs: a.reduceHrs,
  bkd_hrs: a.bkdHrs, zero_hrs: a.zeroHrs, special_rate: a.specialRate,
  stacked_hrs: a.stacked, rig_move_hrs: a.rigMove,
  total_hrs: a.totalHrs, rig_move_amt: a.rigMoveAmt,
  field_name: a.fieldName, area: a.area, billing_date: a.date,
  remarks: a.remarks,
}));

// Registry: table name → mock data array
export const FALLBACK_DATA: Record<string, unknown[]> = {
  rig_moves: rigMoves,
  look_ahead_tasks: lookAhead,
  ddor_reports: ddor,
  billing_tickets: billing,
  billing_ticket_days: [],
  npt_events: npt,
  utilization,
  well_tracking: wells,
  npt_billing: nptBilling,
  fuel_consumption: fuel,
  revenue,
  crm_scores: crm,
  billing_accruals: accruals,
};
