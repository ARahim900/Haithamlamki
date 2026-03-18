'use client';
import React, { useMemo } from 'react';
import { FM, FieldLegend, KPI, Bdg } from '@/components/Shared';
import { RIGS, MONTHS } from '@/lib/data';

// Deterministic seeded RNG to avoid hydration mismatches
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateCrmGrid(rigs: string[]) {
  const rng = seededRandom(42);
  return rigs.map((rig, ri) => {
    const scores = MONTHS.map((_, mi) => {
      const base = 85 - ri * 0.5 + mi * 0.3;
      return Math.min(100, Math.max(60, Math.round(base + (rng() - 0.5) * 10)));
    });
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return { rig, scores, avg };
  });
}

export function CRM() {
  const crmGrid = useMemo(() => generateCrmGrid(RIGS), []);

  const monthAvgs = MONTHS.map((_, mi) =>
    Math.round(crmGrid.reduce((s, r) => s + r.scores[mi], 0) / crmGrid.length)
  );

  const fleetAvg = Math.round(crmGrid.reduce((s, r) => s + r.avg, 0) / crmGrid.length);
  const best = crmGrid.reduce((a, b) => a.avg > b.avg ? a : b);
  const worst = crmGrid.reduce((a, b) => a.avg < b.avg ? a : b);
  const above90 = crmGrid.filter(r => r.avg >= 90).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Customer Satisfaction (CRM)</span>
            <span className="bdg p">Sheet 11</span>
          </div>
          <div className="flex items-center gap-2">
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
        <KPI l="Above 90% Target" v={above90 + '/' + crmGrid.length} s={`${Math.round((above90 / crmGrid.length) * 100)}% of fleet`} cls="b" />
      </div>

      <div className="card">
        <div className="card-hdr">
          CSAT by Rig — 2025 (0-100%)
          <span style={{ fontSize: 12, color: '#64748B' }}>
            {RIGS.length} units tracked across 12 months
          </span>
        </div>
        <div className="tw" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th className="th" style={{ position: 'sticky', left: 0, background: '#F8FAFC', zIndex: 2 }}>Rig / Hoist</th>
                {MONTHS.map(m => <th key={m} className="th" style={{ textAlign: 'center', minWidth: 55 }}>{m}</th>)}
                <th className="th" style={{ textAlign: 'center', minWidth: 70, background: '#F0F9FF' }}>AVG</th>
              </tr>
            </thead>
            <tbody>
              {crmGrid.map((r, ri) => (
                <tr key={ri}>
                  <td style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1, fontWeight: 700, fontSize: 13 }}>{r.rig}</td>
                  {r.scores.map((s, si) => (
                    <td key={si} style={{ textAlign: 'center', padding: '8px 4px' }}>
                      <FM
                        v={String(s)}
                        onChange={() => {}}
                      />
                    </td>
                  ))}
                  <td style={{
                    textAlign: 'center',
                    fontWeight: 900,
                    fontSize: 14,
                    background: '#F0F9FF',
                    color: r.avg >= 90 ? '#047857' : r.avg >= 80 ? '#D97706' : '#DC2626'
                  }}>
                    {r.avg}%
                  </td>
                </tr>
              ))}
              <tr style={{ background: '#F8FAFC', fontWeight: 800 }}>
                <td style={{ position: 'sticky', left: 0, background: '#F8FAFC', fontWeight: 900, zIndex: 1 }}>MONTHLY AVG</td>
                {monthAvgs.map((a, i) => (
                  <td key={i} style={{
                    textAlign: 'center',
                    fontWeight: 900,
                    color: a >= 90 ? '#047857' : a >= 80 ? '#D97706' : '#DC2626',
                    padding: '12px 4px'
                  }}>
                    {a}%
                  </td>
                ))}
                <td style={{ textAlign: 'center', fontWeight: 900, fontSize: 16, background: '#EFF6FF', color: '#1D4ED8' }}>
                  {fleetAvg}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Performance Bands</div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div style={{ padding: 20, borderRadius: 16, background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#047857', marginBottom: 8 }}>Excellent (90-100%)</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#047857' }}>{crmGrid.filter(r => r.avg >= 90).length} rigs</div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#64748B' }}>
              {crmGrid.filter(r => r.avg >= 90).map(r => r.rig).join(', ')}
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 16, background: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#B45309', marginBottom: 8 }}>Acceptable (80-89%)</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#B45309' }}>{crmGrid.filter(r => r.avg >= 80 && r.avg < 90).length} rigs</div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#64748B' }}>
              {crmGrid.filter(r => r.avg >= 80 && r.avg < 90).map(r => r.rig).join(', ')}
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 16, background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', marginBottom: 8 }}>Below Target (&lt;80%)</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#DC2626' }}>{crmGrid.filter(r => r.avg < 80).length} rigs</div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#64748B' }}>
              {crmGrid.filter(r => r.avg < 80).map(r => r.rig).join(', ') || 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
