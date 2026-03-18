'use client';
import React, { useState } from 'react';
import { FA, FD, FM, FieldLegend, Bdg } from '@/components/Shared';
import { Trash2 } from 'lucide-react';

const initialNPT = [
  { id: 1, rig: 'Rig 108', date: '05-Jun-2025', type: 'Abraj', hrs: 4.5, system: 'Top Drive', equip: 'Main motor bearing', rootCause: 'Bearing fatigue — exceeded 3000hr service interval', corrective: 'Replaced main motor bearing assembly', future: 'Reduce PM interval from 3000hr to 2500hr', resp: 'Maint. Supervisor' },
  { id: 2, rig: 'Rig 104', date: '08-Jun-2025', type: 'Abraj', hrs: 6.0, system: 'Mud Pumps', equip: 'Pump #2 liner', rootCause: 'Liner washout due to abrasive mud', corrective: 'Replaced liner and piston assembly', future: 'Switch to ceramic liners for abrasive sections', resp: 'Drilling Engr.' },
  { id: 3, rig: 'Rig 107', date: '12-Jun-2025', type: 'Contractual', hrs: 3.0, system: 'Contractual', equip: '', rootCause: '', corrective: '', future: '', resp: 'Client Rep', contractual: 'Waiting on cement crew — delayed mobilization from client side' },
  { id: 4, rig: 'Rig 103', date: '15-Jun-2025', type: 'Abraj', hrs: 2.5, system: 'Electrical', equip: 'SCR cabinet #3', rootCause: 'Thyristor failure due to power surge', corrective: 'Replaced SCR thyristor stack', future: 'Install surge protection on SCR inputs', resp: 'Electrical Engr.' },
];

export function YTDDetails() {
  const [rows, setRows] = useState(initialNPT);
  const [filter, setFilter] = useState('All');

  const updateRow = (id: number, field: string, value: string | number) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), rig: '', date: '', type: 'Abraj', hrs: 0, system: '', equip: '', rootCause: '', corrective: '', future: '', resp: '' }]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const filtered = filter === 'All' ? rows : rows.filter(r => r.type === filter);
  const totalHrs = filtered.reduce((s, r) => s + r.hrs, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">YTD / NPT Details</span>
            <span className="bdg w">Sheet 5</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-o btn-xs">Export YTD</button>
            <button onClick={addRow} className="btn btn-t btn-xs">+ Add NPT Event</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="p-4 flex items-center gap-4">
          <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Filter by type:</span>
          {['All', 'Abraj', 'Contractual'].map(f => (
            <button
              key={f}
              className={'tab' + (filter === f ? ' act' : '')}
              style={{ padding: '8px 18px', fontSize: 13 }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 800, color: '#DC2626' }}>
            Total: {totalHrs}h NPT ({filtered.length} events)
          </span>
        </div>
      </div>

      <div className="alert-info">
        <span>ℹ</span>
        <div>
          <strong>Conditional Logic:</strong> If NPT type = &quot;Contractual,&quot; equipment failure fields are disabled and contractual process field appears.
          If type = &quot;Abraj,&quot; the reverse applies.
        </div>
      </div>

      {filtered.map(r => (
        <div key={r.id} className="card">
          <div className="card-hdr">
            <div className="flex items-center gap-3">
              <strong>{r.rig || 'New Entry'}</strong>
              <Bdg c={r.type === 'Abraj' ? 'r' : 'w'}>{r.type}</Bdg>
              <span style={{ fontSize: 13, color: '#64748B' }}>{r.date}</span>
              <Bdg c="gr">{r.hrs}h</Bdg>
            </div>
            <button onClick={() => removeRow(r.id)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={18} />
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <FD l="Rig" v={r.rig} onChange={(e: any) => updateRow(r.id, 'rig', e.target.value)} />
            <FM l="Date" v={r.date} onChange={(e: any) => updateRow(r.id, 'date', e.target.value)} />
            <FD l="NPT Type" v={r.type} opts={['Abraj', 'Contractual']} onChange={(e: any) => updateRow(r.id, 'type', e.target.value)} />
            <FM l="Duration (hrs)" v={String(r.hrs)} type="number" onChange={(e: any) => updateRow(r.id, 'hrs', parseFloat(e.target.value) || 0)} />
          </div>

          {r.type === 'Abraj' ? (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FD l="System / Category" v={r.system} opts={['Drawworks', 'Mud Pumps', 'Top Drive', 'Electrical', 'BOP', 'MWD/LWD', 'Drill String']} onChange={(e: any) => updateRow(r.id, 'system', e.target.value)} />
              <FM l="Equipment Failed" v={r.equip || ''} onChange={(e: any) => updateRow(r.id, 'equip', e.target.value)} />
              <FM l="Root Cause" v={r.rootCause || ''} rows={2} onChange={(e: any) => updateRow(r.id, 'rootCause', e.target.value)} />
              <FM l="Corrective Action" v={r.corrective || ''} rows={2} onChange={(e: any) => updateRow(r.id, 'corrective', e.target.value)} />
              <FM l="Future Improvement" v={r.future || ''} onChange={(e: any) => updateRow(r.id, 'future', e.target.value)} />
              <FD l="Responsible Party" v={r.resp || ''} opts={['Maint. Supervisor', 'Drilling Engr.', 'Electrical Engr.', 'Rig Manager']} onChange={(e: any) => updateRow(r.id, 'resp', e.target.value)} />
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 gap-4">
              <FM l="Contractual Process Description" v={(r as typeof r & { contractual?: string }).contractual || ''} rows={3} onChange={(e: any) => updateRow(r.id, 'contractual', e.target.value)} />
              <FD l="Responsible Party" v={r.resp || ''} opts={['Client Rep', 'WSL', 'Third Party']} onChange={(e: any) => updateRow(r.id, 'resp', e.target.value)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
