'use client';
import React, { useState } from 'react';
import { FM, FD, FieldLegend, KPI, Bdg } from '@/components/Shared';
import { useCrmScores } from '@/hooks/useDb';
import { RIGS, MONTHS } from '@/lib/data';

export function CRM() {
  const { data: crmData, loading, error, refetch } = useCrmScores();
  const [selectedYear, setSelectedYear] = useState('2025');

  // Guard against undefined data
  const safeData = crmData ?? [];

  // Filter by year and group by rig
  const yearData = safeData.filter(r => r.year === Number(selectedYear));

  // Build grid: rig -> month -> score
  const rigMap = new Map<string, Map<string, number>>();
  yearData.forEach(r => {
    if (!rigMap.has(r.rig)) rigMap.set(r.rig, new Map());
    rigMap.get(r.rig)!.set(r.month, r.score ?? 0);
  });

  // Convert to array for rendering
  const crmGrid = RIGS.map(rig => {
    const monthScores = rigMap.get(rig) || new Map();
    const scores = MONTHS.map(m => monthScores.get(m) ?? 0);
    const filledScores = scores.filter(s => s > 0);
    const avg = filledScores.length > 0 ? Math.round(filledScores.reduce((a, b) => a + b, 0) / filledScores.length) : 0;
    return { rig, scores, avg };
  }).filter(r => r.avg > 0 || yearData.some(d => d.rig === r.rig));

  const monthAvgs = MONTHS.map((_, mi) => {
    const monthScores = crmGrid.map(r => r.scores[mi]).filter(s => s > 0);
    return monthScores.length > 0 ? Math.round(monthScores.reduce((a, b) => a + b, 0) / monthScores.length) : 0;
  });

  const fleetAvg = crmGrid.length > 0 ? Math.round(crmGrid.reduce((s, r) => s + r.avg, 0) / crmGrid.length) : 0;
  const best = crmGrid.length > 0 ? crmGrid.reduce((a, b) => a.avg > b.avg ? a : b) : { rig: '-', avg: 0 };
  const worst = crmGrid.length > 0 ? crmGrid.reduce((a, b) => a.avg < b.avg ? a : b) : { rig: '-', avg: 0 };
  const above90 = crmGrid.filter(r => r.avg >= 90).length;

  if (loading) return <div className="p-8 text-center">Loading CRM data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Customer Satisfaction (CRM)</span>
            <span className="bdg p">Sheet 11</span>
          </div>
          <div className="flex items-center gap-2">
            <FD v={selectedYear} opts={['2024', '2025']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)} />
            <button className="btn btn-o btn-xs">Export</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>
      </div>

      <div className="kpi-row">
        <KPI l="Fleet Average" v={fleetAvg + '%'} s={'PDO target: 90%'} cls={fleetAvg >= 90 ? 'g' : 'w'} />
        <KPI l="Best Performer" v={best.avg + '%'} s={best.rig} cls="g" trend="up" />
        <KPI l="Needs Attention" v={worst.avg + '%'} s={worst.rig} cls="r" trend="dn" />
        <KPI l="Above 90% Target" v={above90 + '/' + crmGrid.length} s={crmGrid.length > 0 ? `${Math.round((above90 / crmGrid.length) * 100)}% of fleet` : '-'} cls="b" />
      </div>

      <div className="card">
        <div className="card-hdr">
          CSAT by Rig — {selectedYear} (0-100%)
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            {crmGrid.length} units tracked across 12 months
          </span>
        </div>
        <div className="tw" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th scope="col" className="th" style={{ position: 'sticky', left: 0, background: 'var(--color-card-header)', zIndex: 2 }}>Rig / Hoist</th>
                {MONTHS.map(m => <th key={m} scope="col" className="th" style={{ textAlign: 'center', minWidth: 55 }}>{m}</th>)}
                <th scope="col" className="th" style={{ textAlign: 'center', minWidth: 70, background: 'var(--color-chart-bg-blue)' }}>AVG</th>
              </tr>
            </thead>
            <tbody>
              {crmGrid.map((r, ri) => (
                <tr key={ri}>
                  <td style={{ position: 'sticky', left: 0, background: 'var(--color-card)', zIndex: 1, fontWeight: 700, fontSize: 13 }}>{r.rig}</td>
                  {r.scores.map((s, si) => (
                    <td key={si} style={{ textAlign: 'center', padding: '8px 4px' }}>
                      <span style={{
                        fontWeight: 700,
                        color: s >= 90 ? 'var(--color-positive)' : s >= 80 ? 'var(--color-warning)' : s > 0 ? 'var(--color-negative)' : 'var(--color-border)'
                      }}>
                        {s > 0 ? `${s}%` : '-'}
                      </span>
                    </td>
                  ))}
                  <td style={{
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: 14,
                    background: 'var(--color-chart-bg-blue)',
                    color: r.avg >= 90 ? 'var(--color-positive)' : r.avg >= 80 ? 'var(--color-warning)' : 'var(--color-negative)'
                  }}>
                    {r.avg > 0 ? `${r.avg}%` : '-'}
                  </td>
                </tr>
              ))}
              {crmGrid.length === 0 && (
                <tr><td colSpan={14} className="text-center text-gray-400 py-8">No CRM data for {selectedYear}</td></tr>
              )}
              {crmGrid.length > 0 && (
                <tr style={{ background: 'var(--color-card-header)', fontWeight: 600 }}>
                  <td style={{ position: 'sticky', left: 0, background: 'var(--color-card-header)', fontWeight: 600, zIndex: 1 }}>MONTHLY AVG</td>
                  {monthAvgs.map((a, i) => (
                    <td key={i} style={{
                      textAlign: 'center',
                      fontWeight: 600,
                      color: a >= 90 ? 'var(--color-positive)' : a >= 80 ? 'var(--color-warning)' : a > 0 ? 'var(--color-negative)' : 'var(--color-border)',
                      padding: '12px 4px'
                    }}>
                      {a > 0 ? `${a}%` : '-'}
                    </td>
                  ))}
                  <td style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, background: 'var(--color-chart-bg-blue)', color: 'var(--color-info)' }}>
                    {fleetAvg}%
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Performance Bands</div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div style={{ padding: 20, borderRadius: 16, background: 'var(--color-positive-bg)', border: '1px solid var(--color-positive)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-positive)', marginBottom: 8 }}>Excellent (90-100%)</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--color-positive)' }}>{crmGrid.filter(r => r.avg >= 90).length} rigs</div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {crmGrid.filter(r => r.avg >= 90).map(r => r.rig).join(', ') || 'None'}
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 16, background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-warning)', marginBottom: 8 }}>Acceptable (80-89%)</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--color-warning)' }}>{crmGrid.filter(r => r.avg >= 80 && r.avg < 90).length} rigs</div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {crmGrid.filter(r => r.avg >= 80 && r.avg < 90).map(r => r.rig).join(', ') || 'None'}
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 16, background: 'var(--color-negative-bg)', border: '1px solid var(--color-negative)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-negative)', marginBottom: 8 }}>Below Target (&lt;80%)</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--color-negative)' }}>{crmGrid.filter(r => r.avg > 0 && r.avg < 80).length} rigs</div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {crmGrid.filter(r => r.avg > 0 && r.avg < 80).map(r => r.rig).join(', ') || 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
