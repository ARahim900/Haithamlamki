'use client';
import React from 'react';
import { FD, FM, FieldLegend, KPI } from '@/components/Shared';
import { RIGS, MONTHS } from '@/lib/data';

const revenueRows = RIGS.slice(0, 12).map((rig, i) => {
  const actual = Math.round(520000 - i * 12000 + Math.random() * 30000);
  const budget = Math.round(510000 - i * 8000);
  const fuel = Math.round(18000 + Math.random() * 8000);
  const nptLoss = Math.round(Math.random() * 25000);
  const zeroLoss = i % 4 === 0 ? Math.round(Math.random() * 15000) : 0;
  return { rig, actual, budget, fuel, nptLoss, zeroLoss, comment: '' };
});

export function Revenue() {
  const totalActual = revenueRows.reduce((s, r) => s + r.actual, 0);
  const totalBudget = revenueRows.reduce((s, r) => s + r.budget, 0);
  const totalFuel = revenueRows.reduce((s, r) => s + r.fuel, 0);
  const totalNPT = revenueRows.reduce((s, r) => s + r.nptLoss, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Revenue Report</span>
            <span className="bdg g">Sheet 10</span>
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
          <div><strong>Manual input report:</strong> All fields are manually entered by HQ engineers. Revenue, fuel costs, and NPT losses are entered per rig per month.</div>
        </div>
      </div>

      <div className="kpi-row">
        <KPI l="Total Actual Revenue" v={'$' + (totalActual / 1e6).toFixed(2) + 'M'} s={'vs $' + (totalBudget / 1e6).toFixed(2) + 'M budget'} cls="g" trend={totalActual > totalBudget ? 'up' : 'dn'} />
        <KPI l="Total Fuel Costs" v={'$' + (totalFuel / 1e3).toFixed(0) + 'K'} s="12 rigs" cls="w" />
        <KPI l="NPT Revenue Loss" v={'$' + (totalNPT / 1e3).toFixed(0) + 'K'} s="Repair + Zero rate" cls="r" trend="dn" />
        <KPI l="Net After Fuel" v={'$' + ((totalActual - totalFuel) / 1e6).toFixed(2) + 'M'} cls="b" />
      </div>

      <div className="card">
        <div className="card-hdr">Monthly Revenue by Rig — Jun 2025</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                {['Rig', 'Actual Revenue ($)', 'Budget Revenue ($)', 'Var', 'Fuel Cost ($)', 'NPT Loss ($)', 'Zero Loss ($)', 'Comments'].map(h => (
                  <th key={h} className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {revenueRows.map((r, i) => {
                const revVar = r.actual - r.budget;
                return (
                  <tr key={i}>
                    <td><strong>{r.rig}</strong></td>
                    <td className="tb-num">
                      <FM v={r.actual.toLocaleString()} />
                    </td>
                    <td className="tb-num">
                      <FM v={r.budget.toLocaleString()} />
                    </td>
                    <td className="tb-num" style={{ fontWeight: 800, color: revVar >= 0 ? '#16A34A' : '#DC2626' }}>
                      {revVar >= 0 ? '+' : ''}{revVar.toLocaleString()}
                    </td>
                    <td className="tb-num">
                      <FM v={r.fuel.toLocaleString()} />
                    </td>
                    <td className="tb-num" style={{ color: r.nptLoss > 15000 ? '#DC2626' : '#64748B' }}>
                      <FM v={r.nptLoss.toLocaleString()} />
                    </td>
                    <td className="tb-num" style={{ color: r.zeroLoss ? '#D97706' : '#CBD5E1' }}>
                      <FM v={r.zeroLoss ? r.zeroLoss.toLocaleString() : '-'} />
                    </td>
                    <td>
                      <FM v={r.comment} ph="Add comments..." />
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: '#F0FDF4', fontWeight: 800 }}>
                <td style={{ fontWeight: 800 }}>TOTAL</td>
                <td className="tb-num" style={{ fontWeight: 900, color: '#047857' }}>${totalActual.toLocaleString()}</td>
                <td className="tb-num">${totalBudget.toLocaleString()}</td>
                <td className="tb-num" style={{ fontWeight: 900, color: totalActual - totalBudget >= 0 ? '#16A34A' : '#DC2626' }}>
                  {totalActual - totalBudget >= 0 ? '+' : ''}${(totalActual - totalBudget).toLocaleString()}
                </td>
                <td className="tb-num">${totalFuel.toLocaleString()}</td>
                <td className="tb-num" style={{ color: '#DC2626' }}>${totalNPT.toLocaleString()}</td>
                <td className="tb-num">${revenueRows.reduce((s, r) => s + r.zeroLoss, 0).toLocaleString()}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
