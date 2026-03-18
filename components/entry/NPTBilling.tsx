'use client';
import React from 'react';
import { FA, FD, FM, FieldLegend, Bdg } from '@/components/Shared';
import { RIGS, MONTHS } from '@/lib/data';

const nptBillingRows = RIGS.slice(0, 12).map((rig, i) => {
  const op = 700 - i * 6;
  const rd = i % 3 === 0 ? 24 : i % 3 === 1 ? 0 : 12;
  const repair = Math.floor(Math.random() * 16) + 2;
  const zero = i % 4 === 0 ? 8 : 0;
  const sp = i % 5 === 0 ? 24 : 0;
  const total = op + rd + repair + zero + sp;
  const eTicket = total + (i % 3 === 2 ? 4 : 0); // mismatch for some rows
  const mismatch = total !== eTicket;
  return { rig, month: 'Jun', year: '2025', op, rd, repair, zero, sp, total, eTicket, mismatch };
});

export function NPTBilling() {
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">NPT Billing Report</span>
            <span className="bdg r">Sheet 8</span>
          </div>
          <div className="flex items-center gap-2">
            <FD v="Jun" opts={MONTHS} />
            <FD v="2025" opts={['2024', '2025']} />
            <button className="btn btn-o btn-xs">Export</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>
      </div>

      <div className="alert-warn">
        <span>⚠</span>
        <div>
          <strong>Validation Rule:</strong> Rows where manual input hours do not match E-TICKET hours are highlighted.
          Currently <strong>{nptBillingRows.filter(r => r.mismatch).length} mismatches</strong> detected.
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi g">
          <div className="kpi-l">Total Op Hours</div>
          <div className="kpi-v">{nptBillingRows.reduce((s, r) => s + r.op, 0).toLocaleString()}h</div>
        </div>
        <div className="kpi w">
          <div className="kpi-l">Total Reduced</div>
          <div className="kpi-v">{nptBillingRows.reduce((s, r) => s + r.rd, 0)}h</div>
        </div>
        <div className="kpi r">
          <div className="kpi-l">Total Repair/NPT</div>
          <div className="kpi-v">{nptBillingRows.reduce((s, r) => s + r.repair, 0)}h</div>
        </div>
        <div className="kpi b">
          <div className="kpi-l">Mismatches</div>
          <div className="kpi-v">{nptBillingRows.filter(r => r.mismatch).length}</div>
          <div className="kpi-s dn">Needs review</div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Monthly Rate Breakdown — Jun 2025</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                {['Rig', 'Op (h)', 'Reduced (h)', 'Repair (h)', 'Zero (h)', 'Special (h)', 'Manual Total', 'E-Ticket Total', 'Match'].map(h => (
                  <th key={h} className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nptBillingRows.map((r, i) => (
                <tr key={i} style={r.mismatch ? { background: '#FEF9C3' } : {}}>
                  <td><strong>{r.rig}</strong></td>
                  <td className="tb-num" style={{ color: '#047857', fontWeight: 700 }}>
                    <FM v={String(r.op)} />
                  </td>
                  <td className="tb-num" style={{ color: r.rd ? '#D97706' : '#CBD5E1' }}>
                    <FM v={String(r.rd || '-')} />
                  </td>
                  <td className="tb-num" style={{ color: '#DC2626', fontWeight: 700 }}>
                    <FM v={String(r.repair)} />
                  </td>
                  <td className="tb-num" style={{ color: r.zero ? '#64748B' : '#CBD5E1' }}>
                    <FM v={String(r.zero || '-')} />
                  </td>
                  <td className="tb-num" style={{ color: r.sp ? '#0284C7' : '#CBD5E1' }}>
                    <FM v={String(r.sp || '-')} />
                  </td>
                  <td className="tb-num" style={{ fontWeight: 800 }}>{r.total}h</td>
                  <td className="tb-num" style={{ fontWeight: 800 }}>
                    <FA v={`${r.eTicket}h`} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {r.mismatch ? (
                      <Bdg c="r">Mismatch</Bdg>
                    ) : (
                      <Bdg c="g">OK</Bdg>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
