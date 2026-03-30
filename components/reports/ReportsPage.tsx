'use client';
import React, { useState, useCallback } from 'react';
import { KPI } from '@/components/Shared';
import { supabase } from '@/lib/supabase';
import { RIGS, MONTHS } from '@/lib/data';

type ReportSource =
  | 'rig_moves'
  | 'look_ahead_tasks'
  | 'ddor_reports'
  | 'billing_tickets'
  | 'npt_events'
  | 'utilization'
  | 'well_tracking'
  | 'npt_billing'
  | 'fuel_consumption'
  | 'revenue'
  | 'crm_scores'
  | 'billing_accruals';

const REPORT_SOURCES: { id: ReportSource; label: string; sheet: string }[] = [
  { id: 'rig_moves', label: 'Rig Moves', sheet: 'Sheet 1' },
  { id: 'look_ahead_tasks', label: '72hr Ahead Plan', sheet: 'Sheet 2' },
  { id: 'ddor_reports', label: 'DDOR Reports', sheet: 'Sheet 3' },
  { id: 'billing_tickets', label: 'Billing Tickets', sheet: 'Sheet 4' },
  { id: 'npt_events', label: 'NPT Events (YTD)', sheet: 'Sheet 5' },
  { id: 'utilization', label: 'Utilization', sheet: 'Sheet 6' },
  { id: 'well_tracking', label: 'Well Tracking', sheet: 'Sheet 7' },
  { id: 'npt_billing', label: 'NPT Billing', sheet: 'Sheet 8' },
  { id: 'fuel_consumption', label: 'Fuel Tracking', sheet: 'Sheet 9' },
  { id: 'revenue', label: 'Revenue', sheet: 'Sheet 10' },
  { id: 'crm_scores', label: 'Customer Satisfaction', sheet: 'Sheet 11' },
  { id: 'billing_accruals', label: 'Billing Accruals', sheet: 'Sheet 12' },
];

function escapeCSV(val: unknown): string {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.map(escapeCSV).join(',')];
  for (const row of rows) {
    lines.push(headers.map(h => escapeCSV(row[h])).join(','));
  }
  return lines.join('\n');
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ReportsPage() {
  const [selectedSource, setSelectedSource] = useState<ReportSource>('rig_moves');
  const [filterRig, setFilterRig] = useState('');
  const [filterYear, setFilterYear] = useState(String(new Date().getFullYear()));
  const [preview, setPreview] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rowCount, setRowCount] = useState(0);

  const fetchData = useCallback(async (): Promise<Record<string, unknown>[]> => {
    let query = supabase.from(selectedSource).select('*').order('id');

    // Apply rig filter if supported and selected
    const rigTables: ReportSource[] = ['rig_moves', 'ddor_reports', 'billing_tickets', 'npt_events', 'utilization', 'well_tracking', 'npt_billing', 'fuel_consumption', 'revenue', 'crm_scores', 'billing_accruals'];
    if (filterRig && rigTables.includes(selectedSource)) {
      query = query.eq('rig', filterRig);
    }

    // Apply year filter for tables that have a year column
    const yearTables: ReportSource[] = ['utilization', 'npt_billing', 'revenue', 'crm_scores', 'billing_accruals'];
    if (filterYear && yearTables.includes(selectedSource)) {
      query = query.eq('year', Number(filterYear));
    }

    const { data, error: fetchError } = await query;
    if (fetchError) throw new Error(fetchError.message);
    return (data ?? []) as Record<string, unknown>[];
  }, [selectedSource, filterRig, filterYear]);

  const handlePreview = async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await fetchData();
      setPreview(rows);
      setRowCount(rows.length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setLoading(true);
    setError('');
    try {
      const rows = preview ?? await fetchData();
      if (rows.length === 0) {
        setError('No data to export');
        return;
      }
      const csv = toCSV(rows);
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadFile(csv, `${selectedSource}_${timestamp}.csv`, 'text/csv;charset=utf-8;');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = async () => {
    setLoading(true);
    setError('');
    try {
      const rows = preview ?? await fetchData();
      if (rows.length === 0) {
        setError('No data to export');
        return;
      }
      const json = JSON.stringify(rows, null, 2);
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadFile(json, `${selectedSource}_${timestamp}.json`, 'application/json');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const currentLabel = REPORT_SOURCES.find(s => s.id === selectedSource)?.label ?? '';
  const headers = preview && preview.length > 0 ? Object.keys(preview[0]) : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Reports &amp; Export</span>
            <span className="bdg p">Data Export</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-o btn-xs" onClick={handlePrintReport}>Print</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-row">
        <KPI l="Data Source" v={currentLabel} cls="b" />
        <KPI l="Available Tables" v={REPORT_SOURCES.length} cls="g" />
        <KPI l="Rows Loaded" v={rowCount} cls="b" />
        <KPI l="Export Formats" v="CSV / JSON / Print" cls="b" />
      </div>

      {/* Controls */}
      <div className="card">
        <div className="card-hdr">Select Data Source &amp; Filters</div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="f-lbl" htmlFor="report-source">Data Source</label>
              <select
                id="report-source"
                className="f-dd"
                value={selectedSource}
                onChange={e => { setSelectedSource(e.target.value as ReportSource); setPreview(null); setRowCount(0); }}
              >
                {REPORT_SOURCES.map(s => (
                  <option key={s.id} value={s.id}>{s.label} ({s.sheet})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="f-lbl" htmlFor="report-rig">Filter by Rig</label>
              <select
                id="report-rig"
                className="f-dd"
                value={filterRig}
                onChange={e => { setFilterRig(e.target.value); setPreview(null); }}
              >
                <option value="">All Rigs</option>
                {RIGS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="f-lbl" htmlFor="report-year">Filter by Year</label>
              <select
                id="report-year"
                className="f-dd"
                value={filterYear}
                onChange={e => { setFilterYear(e.target.value); setPreview(null); }}
              >
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button className="btn btn-p" onClick={handlePreview} disabled={loading}>
                {loading ? 'Loading...' : 'Preview Data'}
              </button>
            </div>
          </div>

          {error && (
            <div className="settings-msg settings-msg-err" style={{ marginTop: 12 }}>{error}</div>
          )}
        </div>
      </div>

      {/* Export buttons */}
      {preview && preview.length > 0 && (
        <div className="card">
          <div className="card-hdr">
            <span>Export {currentLabel} — {rowCount} rows</span>
            <div className="flex items-center gap-2">
              <button className="btn btn-p btn-xs" onClick={handleExportCSV} disabled={loading}>
                Export CSV
              </button>
              <button className="btn btn-o btn-xs" onClick={handleExportJSON} disabled={loading}>
                Export JSON
              </button>
              <button className="btn btn-o btn-xs" onClick={handlePrintReport}>
                Print / PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview table */}
      {preview && (
        <div className="card report-print-area">
          <div className="card-hdr">
            <span>Data Preview — {currentLabel}</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {rowCount} records
            </span>
          </div>
          {preview.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
              No data found for the selected filters.
            </div>
          ) : (
            <div className="tw" style={{ overflowX: 'auto', maxHeight: 500 }}>
              <table>
                <thead>
                  <tr>
                    {headers.map(h => (
                      <th key={h} scope="col" className="th" style={{ whiteSpace: 'nowrap' }}>
                        {h.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 100).map((row, ri) => (
                    <tr key={ri}>
                      {headers.map(h => (
                        <td key={h} style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row[h] != null ? String(row[h]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 100 && (
                <div className="p-3 text-center" style={{ fontSize: 12, color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)' }}>
                  Showing first 100 of {preview.length} rows. Export to see all data.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick export cards */}
      {!preview && (
        <div className="card">
          <div className="card-hdr">Quick Export</div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {REPORT_SOURCES.map(src => (
              <button
                key={src.id}
                type="button"
                className="report-quick-card"
                onClick={() => { setSelectedSource(src.id); setPreview(null); setRowCount(0); }}
              >
                <div className="report-quick-sheet">{src.sheet}</div>
                <div className="report-quick-label">{src.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
