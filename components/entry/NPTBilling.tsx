'use client';
import React, { useState } from 'react';
import { FA, FD, FM, FieldLegend, Bdg, KPI } from '@/components/Shared';
import { useNptBilling } from '@/hooks/useDb';
import { RIGS, MONTHS } from '@/lib/data';

export function NPTBilling() {
  const { data: nptBillingData, loading, error, refetch } = useNptBilling();
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2025');

  // Guard against undefined data
  const safeData = nptBillingData ?? [];

  // Filter by month/year
  const filteredData = safeData.filter(r => r.month === selectedMonth && r.year === Number(selectedYear));

  // Calculate aggregates
  const totalOp = filteredData.reduce((s, r) => s + (r.opr_rate_hrs ?? 0), 0);
  const totalRd = filteredData.reduce((s, r) => s + (r.reduce_rate_hrs ?? 0), 0);
  const totalRepair = filteredData.reduce((s, r) => s + (r.repair_rate_hrs ?? 0), 0);
  const mismatchCount = filteredData.filter(r => r.mismatch).length;

  if (loading) return <div className="p-8 text-center">Loading NPT billing data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">NPT Billing Report</span>
            <span className="bdg r">Sheet 8</span>
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
      </div>

      {mismatchCount > 0 && (
        <div className="alert-warn">
          <span>⚠</span>
          <div>
            <strong>Validation Rule:</strong> Rows where manual input hours do not match E-TICKET hours are highlighted.
            Currently <strong>{mismatchCount} mismatches</strong> detected.
          </div>
        </div>
      )}

      <div className="kpi-row">
        <KPI l="Total Op Hours" v={`${totalOp.toLocaleString()}h`} cls="g" />
        <KPI l="Total Reduced" v={`${totalRd}h`} cls="w" />
        <KPI l="Total Repair/NPT" v={`${totalRepair}h`} cls="r" />
        <KPI l="Mismatches" v={String(mismatchCount)} s={mismatchCount > 0 ? 'Needs review' : 'All matched'} cls={mismatchCount > 0 ? 'r' : 'g'} />
      </div>

      <div className="card">
        <div className="card-hdr">Monthly Rate Breakdown — {selectedMonth} {selectedYear}</div>
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
              {filteredData.map((r, i) => {
                const manualTotal = (r.opr_rate_hrs ?? 0) + (r.reduce_rate_hrs ?? 0) + (r.repair_rate_hrs ?? 0) + (r.zero_rate_hrs ?? 0) + (r.special_rate_hrs ?? 0);
                return (
                  <tr key={i} style={r.mismatch ? { background: '#FEF9C3' } : {}}>
                    <td><strong>{r.rig}</strong></td>
                    <td className="tb-num" style={{ color: '#2A6B4A', fontWeight: 700 }}>{r.opr_rate_hrs ?? 0}</td>
                    <td className="tb-num" style={{ color: (r.reduce_rate_hrs ?? 0) ? '#D97706' : '#D4D7DC' }}>{r.reduce_rate_hrs || '-'}</td>
                    <td className="tb-num" style={{ color: '#8B3A3A', fontWeight: 700 }}>{r.repair_rate_hrs ?? 0}</td>
                    <td className="tb-num" style={{ color: (r.zero_rate_hrs ?? 0) ? '#5F6B7A' : '#D4D7DC' }}>{r.zero_rate_hrs || '-'}</td>
                    <td className="tb-num" style={{ color: (r.special_rate_hrs ?? 0) ? '#3B6BAD' : '#D4D7DC' }}>{r.special_rate_hrs || '-'}</td>
                    <td className="tb-num" style={{ fontWeight: 600 }}>{manualTotal}h</td>
                    <td className="tb-num" style={{ fontWeight: 600 }}>
                      <FA v={`${r.eticket_total ?? manualTotal}h`} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {r.mismatch ? (
                        <Bdg c="r">Mismatch</Bdg>
                      ) : (
                        <Bdg c="g">OK</Bdg>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr><td colSpan={9} className="text-center text-gray-400 py-8">No NPT billing data for {selectedMonth} {selectedYear}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
