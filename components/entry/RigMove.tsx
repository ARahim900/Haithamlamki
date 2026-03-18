'use client';
import React, { useState } from 'react';
import { FA, FD, FM, FieldLegend } from '@/components/Shared';
import { RIGS } from '@/lib/data';

const moveData = [
  { rig: 'Rig 106', from: 'Fahud-88', to: 'Maurid-SW-2', budgetDays: 5, actualDays: 7, budgetCost: 125000, actualCost: 168000, status: 'Completed', startDate: '01-Jun-2025', endDate: '07-Jun-2025' },
  { rig: 'Rig 109', from: 'Lekhwair-45', to: 'Yibal-612', budgetDays: 4, actualDays: 4, budgetCost: 98000, actualCost: 95000, status: 'Completed', startDate: '10-Jun-2025', endDate: '14-Jun-2025' },
  { rig: 'Rig 203', from: 'Qarn Alam-12', to: 'Saih Rawl-8', budgetDays: 6, actualDays: 5, budgetCost: 145000, actualCost: 128000, status: 'In Progress', startDate: '18-Jun-2025', endDate: '' },
];

export function RigMove() {
  const [selectedRig, setSelectedRig] = useState('Rig 106');

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Rig Move Tracker</span>
            <span className="bdg t">Sheet 1</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-o btn-xs">Export</button>
            <button className="btn btn-t btn-xs">+ New Move</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FD l="Rig" v={selectedRig} opts={RIGS.slice(0, 15)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRig(e.target.value)} />
          <FM l="Move From (Well/Location)" v="Fahud-88" />
          <FM l="Move To (Well/Location)" v="Maurid-SW-2" />
          <FD l="Move Type" v="Intra-field" opts={['Intra-field', 'Inter-field', 'Pad to Pad']} />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FM l="Start Date" v="01-Jun-2025" type="text" />
          <FM l="End Date" v="07-Jun-2025" type="text" />
          <FA l="Duration (Days)" v="7" />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FM l="Budget Days" v="5" type="number" />
          <FA l="Actual Days" v="7" />
          <FM l="Budget Cost ($)" v="125,000" />
          <FA l="Actual Cost ($)" v="168,000" />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FA l="Variance (Days)" v="+2" />
          <FA l="Variance ($)" v="+$43,000" />
          <FM l="Client Contract Income ($)" v="185,000" />
        </div>

        <div className="p-4">
          <FM l="Move Remarks / Delays" v="Delayed 2 days due to heavy equipment transport permit issues. Road closure on Route 21." rows={3} />
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Rig Move History — 2025</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                {['Rig', 'From', 'To', 'Budget Days', 'Actual Days', 'Var', 'Budget Cost', 'Actual Cost', 'Revenue Impact', 'Status'].map(h => (
                  <th key={h} className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {moveData.map((r, i) => {
                const dayVar = r.actualDays - r.budgetDays;
                const costVar = r.actualCost - r.budgetCost;
                return (
                  <tr key={i}>
                    <td><strong>{r.rig}</strong></td>
                    <td style={{ fontSize: 13, color: '#64748B' }}>{r.from}</td>
                    <td style={{ fontSize: 13, color: '#64748B' }}>{r.to}</td>
                    <td className="tb-num">{r.budgetDays}d</td>
                    <td className="tb-num" style={{ fontWeight: 700 }}>{r.actualDays}d</td>
                    <td className="tb-num" style={{ fontWeight: 800, color: dayVar > 0 ? '#DC2626' : '#16A34A' }}>{dayVar > 0 ? '+' : ''}{dayVar}d</td>
                    <td className="tb-num">${r.budgetCost.toLocaleString()}</td>
                    <td className="tb-num" style={{ fontWeight: 700 }}>${r.actualCost.toLocaleString()}</td>
                    <td className="tb-num" style={{ fontWeight: 800, color: costVar > 0 ? '#DC2626' : '#16A34A' }}>{costVar > 0 ? '+' : ''}${Math.abs(costVar).toLocaleString()}</td>
                    <td><span className={'bdg ' + (r.status === 'Completed' ? 'g' : 't')}>{r.status}</span></td>
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
