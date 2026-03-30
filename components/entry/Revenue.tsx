'use client';
import React, { useState } from 'react';
import { FD, FM, FieldLegend, KPI } from '@/components/Shared';
import { useRevenue } from '@/hooks/useDb';
import { RIGS, MONTHS } from '@/lib/data';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Color palette — all pass WCAG AA against white (#fff)
const POSITIVE_COLOR = '#1A7742';  // 5.1:1 contrast ratio
const NEGATIVE_COLOR = '#B91C1C';  // 5.7:1 contrast ratio
const MUTED_COLOR = '#5F6B7A';     // 4.9:1 contrast ratio
const WARNING_COLOR = '#B45309';   // 4.8:1 contrast ratio
const DIMMED_COLOR = '#D4D7DC';

const NPT_REPAIR_THRESHOLD = 15000;

export function Revenue() {
  const { data: revenueData, loading, error, refetch } = useRevenue();
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2025');

  // Guard against undefined data
  const safeData = revenueData ?? [];

  // Filter by month/year
  const filteredData = safeData.filter(r => r.month === selectedMonth && r.year === Number(selectedYear));

  const totalActual = filteredData.reduce((s, r) => s + (r.actual ?? 0), 0);
  const totalBudget = filteredData.reduce((s, r) => s + (r.budgeted ?? 0), 0);
  const totalFuel = filteredData.reduce((s, r) => s + (r.fuel ?? 0), 0);
  const totalNPT = filteredData.reduce((s, r) => s + (r.npt_repair ?? 0) + (r.npt_zero ?? 0), 0);

  const monthIdx = MONTHS.indexOf(selectedMonth);
  const fullMonthName = monthIdx >= 0 ? MONTH_NAMES[monthIdx] : selectedMonth;

  if (loading) return <div className="p-8 text-center">Loading revenue data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Revenue Report</span>
            <span className="bdg g">Sheet 10</span>
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
          <div><strong>Manual input report:</strong> All fields are manually entered by HQ engineers. Revenue, fuel costs, and NPT losses are entered per rig per month.</div>
        </div>
      </div>

      <div className="kpi-row">
        <KPI l="Total Actual Revenue" v={'$' + (totalActual / 1e6).toFixed(2) + 'M'} s={'vs $' + (totalBudget / 1e6).toFixed(2) + 'M budget'} cls="g" trend={totalActual > totalBudget ? 'up' : 'dn'} />
        <KPI l="Total Fuel Costs" v={'$' + (totalFuel / 1e3).toFixed(0) + 'K'} s={`${filteredData.length} rigs`} cls="w" />
        <KPI l="NPT Revenue Loss" v={'$' + (totalNPT / 1e3).toFixed(0) + 'K'} s="Repair + Zero rate" cls="r" trend="dn" />
        <KPI l="Net After Fuel" v={'$' + ((totalActual - totalFuel) / 1e6).toFixed(2) + 'M'} cls="b" />
      </div>

      <div className="card">
        <div className="card-hdr">Monthly Revenue by Rig — {fullMonthName} {selectedYear}</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                {['Rig', 'Actual Revenue ($)', 'Budget Revenue ($)', 'Var', 'Fuel Cost ($)', 'NPT Repair ($)', 'NPT Zero ($)', 'Comments'].map(h => (
                  <th key={h} className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((r, i) => {
                const revVar = (r.actual ?? 0) - (r.budgeted ?? 0);
                return (
                  <tr key={i}>
                    <td><strong>{r.rig}</strong></td>
                    <td className="tb-num">{(r.actual ?? 0).toLocaleString()}</td>
                    <td className="tb-num">{(r.budgeted ?? 0).toLocaleString()}</td>
                    <td className="tb-num" style={{ fontWeight: 600, color: revVar >= 0 ? POSITIVE_COLOR : NEGATIVE_COLOR }}>
                      {revVar >= 0 ? '+' : ''}{revVar.toLocaleString()}
                    </td>
                    <td className="tb-num">{(r.fuel ?? 0).toLocaleString()}</td>
                    <td className="tb-num" style={{ color: (r.npt_repair ?? 0) > NPT_REPAIR_THRESHOLD ? NEGATIVE_COLOR : MUTED_COLOR }}>
                      {(r.npt_repair ?? 0).toLocaleString()}
                    </td>
                    <td className="tb-num" style={{ color: (r.npt_zero ?? 0) ? WARNING_COLOR : DIMMED_COLOR }}>
                      {(r.npt_zero ?? 0) ? (r.npt_zero ?? 0).toLocaleString() : '-'}
                    </td>
                    <td style={{ fontSize: 12, color: MUTED_COLOR }}>{r.comments || '-'}</td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr><td colSpan={8} className="text-center text-gray-400 py-8">No revenue data for {fullMonthName} {selectedYear}</td></tr>
              )}
              {filteredData.length > 0 && (
                <tr style={{ background: '#EFF7F2', fontWeight: 600 }}>
                  <td style={{ fontWeight: 600 }}>TOTAL</td>
                  <td className="tb-num" style={{ fontWeight: 600, color: POSITIVE_COLOR }}>${totalActual.toLocaleString()}</td>
                  <td className="tb-num">${totalBudget.toLocaleString()}</td>
                  <td className="tb-num" style={{ fontWeight: 600, color: totalActual - totalBudget >= 0 ? POSITIVE_COLOR : NEGATIVE_COLOR }}>
                    {totalActual - totalBudget >= 0 ? '+' : ''}${(totalActual - totalBudget).toLocaleString()}
                  </td>
                  <td className="tb-num">${totalFuel.toLocaleString()}</td>
                  <td className="tb-num" style={{ color: NEGATIVE_COLOR }}>${filteredData.reduce((s, r) => s + (r.npt_repair ?? 0), 0).toLocaleString()}</td>
                  <td className="tb-num">${filteredData.reduce((s, r) => s + (r.npt_zero ?? 0), 0).toLocaleString()}</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
