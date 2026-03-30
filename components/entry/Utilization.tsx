'use client';
import React, { useState } from 'react';
import { FA, FD, FieldLegend, Bdg, KPI } from '@/components/Shared';
import { useUtilization } from '@/hooks/useDb';
import { RIGS, MONTHS } from '@/lib/data';

export function Utilization() {
  const { data: utilData, loading, error, refetch } = useUtilization();
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2025');

  // Filter data by selected month/year
  const filteredData = utilData.filter(r => r.month === selectedMonth && r.year === Number(selectedYear));

  // Calculate aggregates
  const totalOpHours = filteredData.reduce((s, r) => s + (r.op_hours ?? 0), 0);
  const totalNptHours = filteredData.reduce((s, r) => s + (r.npt_hours ?? 0), 0);
  const totalHours = totalOpHours + totalNptHours;
  const avgUtilization = filteredData.length > 0 && totalHours > 0
    ? (100 - (totalNptHours / totalHours * 100)).toFixed(1)
    : '0';
  const rigsAboveTarget = filteredData.filter(r => (r.npt_pct ?? 0) <= 3).length;

  if (loading) return <div className="p-8 text-center">Loading utilization data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Utilization Report</span>
            <span className="bdg g">Sheet 6</span>
          </div>
          <div className="flex items-center gap-2">
            <FD v={selectedMonth} opts={MONTHS} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMonth(e.target.value)} />
            <FD v={selectedYear} opts={['2024', '2025']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)} />
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
        <KPI l="Avg Utilization" v={`${avgUtilization}%`} s={filteredData.length > 0 ? `${filteredData.length} rigs reporting` : 'No data'} cls={Number(avgUtilization) >= 90 ? 'g' : 'w'} />
        <KPI l="Total Op Hours" v={totalOpHours.toLocaleString()} s={`${filteredData.length} rigs`} cls="b" />
        <KPI l="Total NPT Hours" v={`${totalNptHours}h`} s="Target: <5%" cls="r" />
        <KPI l="Rigs On Target" v={`${rigsAboveTarget}/${filteredData.length}`} s={filteredData.length > 0 ? `${Math.round((rigsAboveTarget / filteredData.length) * 100)}% meeting target` : '-'} cls="w" />
      </div>

      <div className="card">
        <div className="card-hdr">Monthly Utilization — {selectedMonth} {selectedYear}</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                {['Year', 'Month', 'Rig', 'Op Hours', 'NPT Hours', 'NPT %', 'NPT Type', 'Allowable', 'Status', 'Working Days'].map(h => (
                  <th key={h} scope="col" className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((r, i) => {
                const overTarget = (r.npt_pct ?? 0) > 3;
                return (
                  <tr key={i}>
                    <td><FA v={String(r.year)} /></td>
                    <td><FA v={r.month} /></td>
                    <td><strong>{r.rig}</strong></td>
                    <td className="tb-num" style={{ fontWeight: 700, color: 'var(--color-positive)' }}>{r.op_hours ?? 0}h</td>
                    <td className="tb-num" style={{ fontWeight: 700, color: (r.npt_hours ?? 0) > 20 ? 'var(--color-negative)' : 'var(--color-text-secondary)' }}>{r.npt_hours ?? 0}h</td>
                    <td className="tb-num" style={{ fontWeight: 600, color: overTarget ? 'var(--color-negative)' : 'var(--color-positive)' }}>{(r.npt_pct ?? 0).toFixed(1)}%</td>
                    <td><Bdg c={r.npt_type === 'Contractual' ? 'w' : 'r'}>{r.npt_type || '-'}</Bdg></td>
                    <td className="tb-num">{r.allowable_npt || '3%'}</td>
                    <td>
                      <Bdg c={overTarget ? 'r' : 'g'}>{overTarget ? 'Over Target' : 'On Target'}</Bdg>
                    </td>
                    <td className="tb-num" style={{ fontWeight: 700 }}>{(r.working_days ?? 0).toFixed(1)}d</td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr><td colSpan={10} className="text-center text-gray-400 py-8">No utilization data for {selectedMonth} {selectedYear}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
