/**
 * hooks/useDb.ts — React hooks for haithamlamki-drilling-ops Supabase tables
 *
 * Each hook provides: { data, loading, error, refetch, insert, update, remove }
 *
 * Example usage in a component:
 *   import { useRigMoves } from '@/hooks/useDb';
 *
 *   function RigMoveTable() {
 *     const { data, loading, error, insert, update, remove } = useRigMoves();
 *
 *     if (loading) return <Spinner />;
 *     if (error)   return <Error message={error} />;
 *
 *     return (
 *       <table>
 *         {data.map(row => <tr key={row.id}>{row.rig}</tr>)}
 *       </table>
 *     );
 *   }
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  RigMoves,      RigMove,
  LookAheadTasks, LookAheadTask,
  DdorReports,   DdorReport,
  BillingTickets, BillingTicket, BillingTicketDay,
  NptEvents,     NptEvent,
  UtilizationData, Utilization,
  WellTrackingData, WellTracking,
  NptBillingData, NptBilling,
  FuelConsumptionData, FuelConsumption,
  RevenueData,   Revenue,
  CrmScores,     CrmScore,
  BillingAccruals, BillingAccrual,
} from '@/lib/db';

// ─────────────────────────────────────────────────────────────────────────────
// Generic hook factory
// ─────────────────────────────────────────────────────────────────────────────

interface UseTableReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  insert: (row: Omit<T, 'id' | 'created_at'>) => Promise<T | null>;
  update: (id: number, patch: Partial<T>) => Promise<T | null>;
  remove: (id: number) => Promise<boolean>;
}

function makeUseTable<T extends { id: number }>(
  fetchFn: () => Promise<T[]>,
  insertFn: (row: Omit<T, 'id' | 'created_at'>) => Promise<T>,
  updateFn: (id: number, patch: Partial<T>) => Promise<T>,
  removeFn: (id: number) => Promise<void>,
): () => UseTableReturn<T> {
  return function useTable(): UseTableReturn<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await fetchFn();
        setData(rows);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const insert = useCallback(async (row: Omit<T, 'id' | 'created_at'>) => {
      try {
        const created = await insertFn(row);
        setData((prev) => [...prev, created]);
        return created;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Insert failed');
        return null;
      }
    }, []);

    const update = useCallback(async (id: number, patch: Partial<T>) => {
      try {
        const updated = await updateFn(id, patch);
        setData((prev) => prev.map((r) => (r.id === id ? updated : r)));
        return updated;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Update failed');
        return null;
      }
    }, []);

    const remove = useCallback(async (id: number) => {
      try {
        await removeFn(id);
        setData((prev) => prev.filter((r) => r.id !== id));
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Delete failed');
        return false;
      }
    }, []);

    return { data, loading, error, refetch: fetch, insert, update, remove };
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Rig Moves
// ─────────────────────────────────────────────────────────────────────────────
export const useRigMoves = makeUseTable<RigMove>(
  RigMoves.getAll,
  RigMoves.insert,
  RigMoves.update,
  RigMoves.delete,
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Look-Ahead Tasks
// ─────────────────────────────────────────────────────────────────────────────
export const useLookAheadTasks = makeUseTable<LookAheadTask>(
  LookAheadTasks.getAll,
  LookAheadTasks.insert,
  LookAheadTasks.update,
  LookAheadTasks.delete,
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. DDOR Reports
// ─────────────────────────────────────────────────────────────────────────────
export const useDdorReports = makeUseTable<DdorReport>(
  DdorReports.getAll,
  DdorReports.insert,
  DdorReports.update,
  DdorReports.delete,
);

/** Filter DDOR reports by rig */
export function useDdorByRig(rig: string) {
  const [data, setData] = useState<DdorReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      setData(await DdorReports.getByRig(rig));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally { setLoading(false); }
  }, [rig]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Billing Tickets
// ─────────────────────────────────────────────────────────────────────────────
export const useBillingTickets = makeUseTable<BillingTicket>(
  BillingTickets.getAll,
  BillingTickets.insert,
  BillingTickets.update,
  BillingTickets.delete,
);

export function useBillingTicketDays(ticketId: number | null) {
  const [days, setDays] = useState<BillingTicketDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ticketId == null) return;
    setLoading(true);
    BillingTickets.getDays(ticketId)
      .then(setDays)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [ticketId]);

  return { days, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. NPT Events
// ─────────────────────────────────────────────────────────────────────────────
export const useNptEvents = makeUseTable<NptEvent>(
  NptEvents.getAll,
  NptEvents.insert,
  NptEvents.update,
  NptEvents.delete,
);

export function useNptByYear(year: number) {
  const [data, setData] = useState<NptEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true);
    try { setData(await NptEvents.getByYear(year)); setError(null); }
    catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setLoading(false); }
  }, [year]);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Utilization
// ─────────────────────────────────────────────────────────────────────────────
export const useUtilization = makeUseTable<Utilization>(
  UtilizationData.getAll,
  UtilizationData.insert,
  UtilizationData.update,
  // utilization has no delete — provide a no-op
  async () => { throw new Error('Utilization rows are not deletable'); },
);

export function useUtilizationByYear(year: number) {
  const [data, setData] = useState<Utilization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true);
    try { setData(await UtilizationData.getByYear(year)); setError(null); }
    catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setLoading(false); }
  }, [year]);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Well Tracking
// ─────────────────────────────────────────────────────────────────────────────
export const useWellTracking = makeUseTable<WellTracking>(
  WellTrackingData.getAll,
  WellTrackingData.insert,
  WellTrackingData.update,
  WellTrackingData.delete,
);

export function useWellsByRig(rig: string) {
  const [data, setData] = useState<WellTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true);
    try { setData(await WellTrackingData.getByRig(rig)); setError(null); }
    catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setLoading(false); }
  }, [rig]);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. NPT Billing
// ─────────────────────────────────────────────────────────────────────────────
export const useNptBilling = makeUseTable<NptBilling>(
  NptBillingData.getAll,
  NptBillingData.insert,
  NptBillingData.update,
  async () => { throw new Error('NPT Billing rows are not deletable'); },
);

// ─────────────────────────────────────────────────────────────────────────────
// 9. Fuel Consumption
// ─────────────────────────────────────────────────────────────────────────────
export const useFuelConsumption = makeUseTable<FuelConsumption>(
  FuelConsumptionData.getAll,
  FuelConsumptionData.insert,
  FuelConsumptionData.update,
  async () => { throw new Error('Fuel rows are not deletable'); },
);

export function useFuelByRig(rig: string) {
  const [data, setData] = useState<FuelConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true);
    try { setData(await FuelConsumptionData.getByRig(rig)); setError(null); }
    catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setLoading(false); }
  }, [rig]);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. Revenue
// ─────────────────────────────────────────────────────────────────────────────
export const useRevenue = makeUseTable<Revenue>(
  RevenueData.getAll,
  RevenueData.insert,
  RevenueData.update,
  async () => { throw new Error('Revenue rows are not deletable'); },
);

export function useRevenueByYear(year: number) {
  const [data, setData] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true);
    try { setData(await RevenueData.getByYear(year)); setError(null); }
    catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setLoading(false); }
  }, [year]);
  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. CRM Scores
// ─────────────────────────────────────────────────────────────────────────────
export const useCrmScores = makeUseTable<CrmScore>(
  CrmScores.getAll,
  CrmScores.insert,
  CrmScores.update,
  async () => { throw new Error('CRM rows are not deletable'); },
);

// ─────────────────────────────────────────────────────────────────────────────
// 12. Billing Accruals
// ─────────────────────────────────────────────────────────────────────────────
export const useBillingAccruals = makeUseTable<BillingAccrual>(
  BillingAccruals.getAll,
  BillingAccruals.insert,
  BillingAccruals.update,
  BillingAccruals.delete,
);
