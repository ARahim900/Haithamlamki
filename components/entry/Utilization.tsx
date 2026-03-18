'use client';
import React, { useMemo } from 'react';
import { FA, FD, FieldLegend, Bdg } from '@/components/Shared';
import { RIGS, MONTHS } from '@/lib/data';

function generateUtilRows(rigs: string[]) {
  return rigs.slice(0, 15).map((rig, i) => {
    const op = 700 - i * 5 + ((i * 7 + 3) % 20); // deterministic instead of Math.random()
    const nptHrs = (i * 11 + 5) % 30 + 5; // deterministic
    const monthHours = 720; // June = 30 days × 24 hours
    const nptPct = ((nptHrs / monthHours) * 100).toFixed(1);
    const workDays = ((op) / 24).toFixed(1);
    const nptType = i % 3 === 0 ? 'Contractual' : 'Abraj';
    const allowable = nptType === 'Contractual' ? '5%' : '3%';
    return { rig, year: '2025', month: 'Jun', op, nptHrs, nptPct, workDays, nptType, allowable };
  });
}

export function Utilization() {
  const utilRows = useMemo(() => generateUtilRows(RIGS), []);

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Utilization Report</span>
            <span className="bdg g">Sheet 6</span>
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

        <div className="alert-info">
          <span>ℹ</span>
          <div>
            <strong>Auto-calculated report:</strong> Year, month, and rig fields are automated. Allowable NPT, NPT type, and total working days are derived from field data (DDOR, Billing Ticket).
          </div>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi g">
          <div className="kpi-l">Avg Utilization</div>
          <div className="kpi-v">91.4%</div>
          <div className="kpi-s up">+3.2% vs May</div>
        </div>
        <div className="kpi b">
          <div className="kpi-l">Total Op Hours</div>
          <div className="kpi-v">10,260</div>
          <div className="kpi-s">15 rigs reporting</div>
        </div>
        <div className="kpi r">
          <div className="kpi-l">Total NPT Hours</div>
          <div className="kpi-v">142h</div>
          <div className="kpi-s dn">Target: &lt;5%</div>
        </div>
        <div className="kpi w">
          <div className="kpi-l">Rigs Above Target</div>
          <div className="kpi-v">12/15</div>
          <div className="kpi-s">3 need attention</div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Monthly Utilization — Jun 2025 (Auto-Calculated)</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                {['Year', 'Month', 'Rig', 'Op Hours', 'NPT Hours', 'NPT %', 'NPT Type', 'Allowable', 'Status', 'Working Days'].map(h => (
                  <th key={h} className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {utilRows.map((r, i) => {
                const overTarget = parseFloat(r.nptPct) > parseFloat(r.allowable);
                return (
                  <tr key={i}>
                    <td><FA v={r.year} /></td>
                    <td><FA v={r.month} /></td>
                    <td><strong>{r.rig}</strong></td>
                    <td className="tb-num" style={{ fontWeight: 700, color: '#047857' }}>{r.op}h</td>
                    <td className="tb-num" style={{ fontWeight: 700, color: r.nptHrs > 20 ? '#DC2626' : '#64748B' }}>{r.nptHrs}h</td>
                    <td className="tb-num" style={{ fontWeight: 800, color: overTarget ? '#DC2626' : '#16A34A' }}>{r.nptPct}%</td>
                    <td><Bdg c={r.nptType === 'Contractual' ? 'w' : 'r'}>{r.nptType}</Bdg></td>
                    <td className="tb-num">{r.allowable}</td>
                    <td>
                      <Bdg c={overTarget ? 'r' : 'g'}>{overTarget ? 'Over Target' : 'On Target'}</Bdg>
                    </td>
                    <td className="tb-num" style={{ fontWeight: 700 }}>{r.workDays}d</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
