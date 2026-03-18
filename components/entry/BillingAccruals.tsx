'use client';
import React, { useMemo } from 'react';
import { FA, FD, FM, FDr, FieldLegend, KPI, Bdg } from '@/components/Shared';
import { RIGS, MONTHS } from '@/lib/data';

function generateAccrualRows(rigs: string[]) {
  return rigs.slice(0, 12).map((rig, i) => {
    const op = 700 - i * 5;
    const rd = i % 3 === 0 ? 24 : 0;
    const bkd = (i * 7 + 3) % 12; // deterministic instead of Math.random()
    const sp = i % 5 === 0 ? 24 : 0;
    const zero = i % 4 === 0 ? 8 : 0;
    const sk = 0;
    const rigMove = i % 6 === 0 ? 42000 : 0;
    const total = 744;
    const wbs = `WBS-2025-${['NWT', 'SFN', 'YIB', 'MRD', 'FHD', 'LKW'][i % 6]}-${rig.replace('Rig ', '')}`;
    const network = `NET-${1000 + i}`;
    const well = ['HAJAL NE 20H1', 'SF-41', 'Yibal-611', 'Maurid-SW-2', 'Fahud-88', 'Lekhwair-45', 'Qarn Alam-12', 'Saih Rawl-8', 'Nimr-44', 'Bahja-22', 'Harweel-15', 'Karim-9'][i];
    const field = ['NWT', 'SFN', 'YIB', 'MRD', 'FHD', 'LKW', 'QAR', 'SRW', 'NMR', 'BAH', 'HRW', 'KRM'][i];
    const area = ['North', 'South', 'North', 'Central', 'North', 'North', 'Central', 'South', 'South', 'South', 'South', 'Central'][i];
    return { rig, wbs, network, well, field, area, op, rd, bkd, sp, zero, sk, rigMove, total };
  });
}

export function BillingAccruals() {
  const accrualRows = useMemo(() => generateAccrualRows(RIGS), []);

  const totalOP = accrualRows.reduce((s, r) => s + r.op, 0);
  const totalRD = accrualRows.reduce((s, r) => s + r.rd, 0);
  const totalBKD = accrualRows.reduce((s, r) => s + r.bkd, 0);
  const totalRM = accrualRows.reduce((s, r) => s + r.rigMove, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Billing Accruals</span>
            <span className="bdg b">Sheet 12</span>
          </div>
          <div className="flex items-center gap-2">
            <FD v="Jun" opts={MONTHS} />
            <FD v="2025" opts={['2024', '2025']} />
            <button className="btn btn-o btn-xs">Export</button>
            <button className="btn btn-g btn-xs">Finalize Month</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="alert-info">
          <span>ℹ</span>
          <div>
            <strong>Monthly consolidation:</strong> All rate categories, WBS, network, well, field, area, and rig move amounts.
            Full month = 744 hours per rig. Data sourced from Billing Tickets (Sheet 4) and Rig Move (Sheet 1).
          </div>
        </div>
      </div>

      <div className="kpi-row">
        <KPI l="Total OP Hours" v={totalOP.toLocaleString() + 'h'} s={`${(totalOP / 24).toFixed(0)} days across 12 rigs`} cls="g" />
        <KPI l="Total Reduced" v={totalRD + 'h'} s={`${(totalRD / 24).toFixed(1)} days`} cls="w" />
        <KPI l="Total Breakdown" v={totalBKD + 'h'} s="NPT repairs" cls="r" />
        <KPI l="Rig Move Revenue" v={'$' + (totalRM / 1000).toFixed(0) + 'K'} s={accrualRows.filter(r => r.rigMove > 0).length + ' moves this month'} cls="b" />
      </div>

      <div className="card">
        <div className="card-hdr">
          Accrual Consolidation — Jun 2025
          <span style={{ fontSize: 12, color: '#64748B' }}>744h = full month</span>
        </div>
        <div className="tw" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                {['Rig', 'WBS #', 'Network', 'Well', 'Field', 'Area', 'OP (h)', 'RD (h)', 'BKD (h)', 'SP (h)', 'ZR (h)', 'SK (h)', 'Rig Move ($)', 'Total (h)'].map(h => (
                  <th key={h} className="th" style={{ minWidth: h.length > 6 ? 100 : 70 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accrualRows.map((r, i) => (
                <tr key={i}>
                  <td><strong>{r.rig}</strong></td>
                  <td style={{ fontSize: 11, fontFamily: 'monospace', color: '#0284C7' }}>{r.wbs}</td>
                  <td style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748B' }}>{r.network}</td>
                  <td style={{ fontSize: 12, color: '#334155' }}>{r.well}</td>
                  <td><Bdg c="gr">{r.field}</Bdg></td>
                  <td><Bdg c={r.area === 'North' ? 'b' : r.area === 'South' ? 'g' : 'w'}>{r.area}</Bdg></td>
                  <td className="tb-num" style={{ color: '#047857', fontWeight: 700 }}>{r.op}</td>
                  <td className="tb-num" style={{ color: r.rd ? '#D97706' : '#CBD5E1' }}>{r.rd || '-'}</td>
                  <td className="tb-num" style={{ color: r.bkd ? '#DC2626' : '#CBD5E1' }}>{r.bkd || '-'}</td>
                  <td className="tb-num" style={{ color: r.sp ? '#0284C7' : '#CBD5E1' }}>{r.sp || '-'}</td>
                  <td className="tb-num" style={{ color: r.zero ? '#64748B' : '#CBD5E1' }}>{r.zero || '-'}</td>
                  <td className="tb-num" style={{ color: '#CBD5E1' }}>{r.sk || '-'}</td>
                  <td className="tb-num" style={{ fontWeight: r.rigMove ? 700 : 400, color: r.rigMove ? '#0284C7' : '#CBD5E1' }}>
                    {r.rigMove ? '$' + r.rigMove.toLocaleString() : '-'}
                  </td>
                  <td className="tb-num" style={{ fontWeight: 800 }}>{r.total}h</td>
                </tr>
              ))}
              <tr style={{ background: '#F0F9FF', fontWeight: 800 }}>
                <td colSpan={6} style={{ textAlign: 'right', fontWeight: 900 }}>TOTALS</td>
                <td className="tb-num" style={{ fontWeight: 900, color: '#047857' }}>{totalOP}</td>
                <td className="tb-num">{totalRD}</td>
                <td className="tb-num" style={{ color: '#DC2626' }}>{totalBKD}</td>
                <td className="tb-num">{accrualRows.reduce((s, r) => s + r.sp, 0)}</td>
                <td className="tb-num">{accrualRows.reduce((s, r) => s + r.zero, 0)}</td>
                <td className="tb-num">{accrualRows.reduce((s, r) => s + r.sk, 0)}</td>
                <td className="tb-num" style={{ color: '#0284C7' }}>${totalRM.toLocaleString()}</td>
                <td className="tb-num" style={{ fontWeight: 900 }}>{accrualRows.reduce((s, r) => s + r.total, 0)}h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
