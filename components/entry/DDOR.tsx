'use client';
import React, { useState, useMemo } from 'react';
import { FA, FD, FM, FDr, FieldLegend, Bdg } from '@/components/Shared';
import { Trash2, Plus, Clock, AlertTriangle, Droplets, Gauge, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import { useDdorReports } from '@/hooks/useDb';
import type { DdorReport } from '@/lib/db';
import { RIGS, RATE_TYPES, NPT_SYSTEMS } from '@/lib/data';

/* ── activity code config ── */
const ACTIVITY_CODES = [
  { code: 'DRL', label: 'Drilling', color: '#3A9E7E' },
  { code: 'TRP', label: 'Tripping', color: '#5B8DB8' },
  { code: 'CSG', label: 'Casing', color: '#7B6B9E' },
  { code: 'CMT', label: 'Cementing', color: '#4D9BA8' },
  { code: 'LOG', label: 'Logging', color: '#6B5B8D' },
  { code: 'SRV', label: 'Service/PM', color: '#C4923A' },
  { code: 'CIR', label: 'Circulate', color: '#2A6B4A' },
  { code: 'BHA', label: 'BHA Change', color: '#8B6BAD' },
  { code: 'RIG', label: 'Rig Up/Down', color: '#6B7280' },
  { code: 'WFT', label: 'Wireline/DST', color: '#3B6BAD' },
  { code: 'NPT', label: 'NPT', color: '#B06B6F' },
  { code: 'WOC', label: 'Wait on Cement', color: '#9A7328' },
  { code: 'WOO', label: 'Wait on Orders', color: '#7A7F88' },
];

const codeColor = (c: string) => ACTIVITY_CODES.find(a => a.code === c)?.color || '#8993A4';

/* ── time helpers ── */
function parseTime(t: string): number {
  const parts = t.split(':');
  if (parts.length !== 2) return NaN;
  return parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60;
}

function computeHrs(from: string, to: string): number {
  const f = parseTime(from);
  const t = parseTime(to);
  if (isNaN(f) || isNaN(t)) return 0;
  const diff = t - f;
  return Math.round(Math.max(0, diff) * 100) / 100;
}

/* ── initial data ── */
const initialOps = [
  { id: 1, from: '00:00', to: '02:30', hrs: 2.5, code: 'CIR', rate: 'OP', desc: 'Circulate & condition mud, check parameters. MW 10.2ppg' },
  { id: 2, from: '02:30', to: '06:00', hrs: 3.5, code: 'DRL', rate: 'OP', desc: "Drill 8-1/2\" hole from 12,000' to 12,120'. ROP avg 34 ft/hr" },
  { id: 3, from: '06:00', to: '06:30', hrs: 0.5, code: 'NPT', rate: 'RD', desc: 'Top drive vibration alarm — inspect & tighten bolts' },
  { id: 4, from: '06:30', to: '08:00', hrs: 1.5, code: 'SRV', rate: 'OP', desc: 'Rig crew change. Safety meeting & JSA review' },
  { id: 5, from: '08:00', to: '12:00', hrs: 4.0, code: 'DRL', rate: 'OP', desc: "Drill 8-1/2\" hole from 12,120' to 12,280'. Formation: Shuaiba Lst" },
  { id: 6, from: '12:00', to: '14:00', hrs: 2.0, code: 'TRP', rate: 'OP', desc: 'POOH for bit change. Pull 500 stands (12,280ft)' },
  { id: 7, from: '14:00', to: '15:00', hrs: 1.0, code: 'BHA', rate: 'OP', desc: 'Change bit #4 → #5 (PDC 8-1/2\", Hughes PCDX-516). Make up new BHA' },
  { id: 8, from: '15:00', to: '17:00', hrs: 2.0, code: 'TRP', rate: 'OP', desc: 'RIH with new BHA to 12,280ft. Reaming from 11,800ft' },
  { id: 9, from: '17:00', to: '24:00', hrs: 7.0, code: 'DRL', rate: 'OP', desc: "Drill 8-1/2\" hole from 12,280' to 12,450'. Increasing gas readings at 12,380'" },
];

const initialNPT = [
  { id: 1, from: '06:00', to: '06:30', hrs: 0.5, system: 'Top Drive', severity: 'Minor', equip: 'Top drive main shaft bearing', desc: 'Vibration alarm triggered. Inspection found loose mounting bolts.', rootCause: 'Bolts loosened from extended high-torque operation (>45,000 ft-lbs)', corrective: 'Torqued all TD mounting bolts to spec. Added thread lock compound.', rateApplied: 'RD' },
];

const initialBHA = [
  { id: 1, comp: 'PDC Bit', od: '8.500', id_: '—', len: '0.50', desc: 'Hughes PCDX-516, 5 blades, 16mm cutters' },
  { id: 2, comp: 'Mud Motor', od: '6.750', id_: '3.000', len: '28.50', desc: '7/8 Lobe, 5.0 stage, 1.15° bend' },
  { id: 3, comp: 'MWD/LWD', od: '6.750', id_: '2.813', len: '32.00', desc: 'Schlumberger TeleScope 675, GR/Res/Density' },
  { id: 4, comp: 'Stab (Near Bit)', od: '8.375', id_: '2.813', len: '5.20', desc: 'Integral blade stabilizer, 3-blade' },
  { id: 5, comp: 'NMDC', od: '6.500', id_: '2.813', len: '30.00', desc: 'Non-magnetic drill collar' },
  { id: 6, comp: 'Stab (String)', od: '8.375', id_: '2.813', len: '5.20', desc: 'Integral blade stabilizer, 3-blade' },
  { id: 7, comp: 'HWDP', od: '5.000', id_: '3.000', len: '450.0', desc: 'Heavy weight drill pipe, 15 joints' },
  { id: 8, comp: 'Drill Pipe', od: '5.000', id_: '4.276', len: '11,780', desc: '5\" DP, S-135, NC50, 19.50 ppf' },
];

export function DDOR() {
  const [tab, setTab] = useState('ops');
  const [opsRows, setOpsRows] = useState(initialOps);
  const [nptRows, setNptRows] = useState(initialNPT);
  const [bhaRows, setBhaRows] = useState(initialBHA);
  const [expandedNPT, setExpandedNPT] = useState<number | null>(1);

  /* ── ops helpers ── */
  const addRow = () => setOpsRows([...opsRows, { id: Date.now(), from: '', to: '', hrs: 0, code: '', rate: 'OP', desc: '' }]);
  const removeRow = (id: number) => setOpsRows(opsRows.filter(r => r.id !== id));
  const updateRow = (id: number, field: string, value: string | number) => setOpsRows(opsRows.map(r => {
    if (r.id !== id) return r;
    const updated = { ...r, [field]: value };
    if (field === 'from' || field === 'to') {
      updated.hrs = computeHrs(updated.from, updated.to);
    }
    return updated;
  }));

  /* ── npt helpers ── */
  const addNptRow = () => {
    const newId = Date.now();
    setNptRows([...nptRows, { id: newId, from: '', to: '', hrs: 0, system: '', severity: 'Minor', equip: '', desc: '', rootCause: '', corrective: '', rateApplied: 'RD' }]);
    setExpandedNPT(newId);
  };
  const removeNptRow = (id: number) => setNptRows(nptRows.filter(r => r.id !== id));
  const updateNptRow = (id: number, field: string, value: string | number) => setNptRows(nptRows.map(r => {
    if (r.id !== id) return r;
    const updated = { ...r, [field]: value };
    if (field === 'from' || field === 'to') {
      updated.hrs = computeHrs(updated.from, updated.to);
    }
    return updated;
  }));

  /* ── computed ── */
  const totalOpsHrs = useMemo(() => opsRows.reduce((s, r) => s + (Number(r.hrs) || 0), 0), [opsRows]);
  const totalNptHrs = useMemo(() => nptRows.reduce((s, r) => s + (Number(r.hrs) || 0), 0), [nptRows]);
  const hrsValid = Math.abs(totalOpsHrs - 24) < 0.01;
  const hrsByCode = useMemo(() => {
    const map: Record<string, number> = {};
    opsRows.forEach(r => { map[r.code] = (map[r.code] || 0) + (Number(r.hrs) || 0); });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [opsRows]);

  const TABS = [
    { key: 'ops', label: '24hr Operations', icon: <Clock size={15} />, count: opsRows.length },
    { key: 'mud', label: 'Mud & Pumps', icon: <Droplets size={15} /> },
    { key: 'bha', label: 'BHA & Bit', icon: <Gauge size={15} /> },
    { key: 'npt', label: 'NPT Events', icon: <AlertTriangle size={15} />, count: nptRows.length, alert: totalNptHrs > 0 },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* ══════ DDOR HEADER CARD ══════ */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 0 }}>
        <div className="ddor-hdr">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Daily Drilling Operations Report</div>
              <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.55, marginTop: 1 }}>DDOR — Sheet 3</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-o btn-xs" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.75)' }}>Save Draft</button>
            <button className="btn btn-g btn-xs">Submit for Approval</button>
          </div>
        </div>

        {/* well info bar */}
        <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <FieldLegend />
        </div>

        <div style={{ padding: '16px 20px' }} className="grid grid-cols-2 md:grid-cols-12 gap-3">
          <div className="md:col-span-2">
            <FD l="Rig" v="Rig 108" opts={RIGS} />
          </div>
          <div className="md:col-span-2">
            <FDr l="Well Name" v="Thamoud 91" />
          </div>
          <div className="md:col-span-3">
            <FDr l="WBS #" v="WBS-2025-THM-108" />
          </div>
          <div className="md:col-span-3">
            <FDr l="Network / Area" v="NET-1042 / North" />
          </div>
          <div className="md:col-span-2">
            <FM l="Report Date" v="15-Jun-2025" type="text" />
          </div>
        </div>

        <div style={{ padding: '0 20px 16px' }} className="grid grid-cols-3 md:grid-cols-12 gap-3">
          <div className="md:col-span-2">
            <FD l="Rig Status" v="Drilling" opts={['Drilling', 'Tripping', 'Casing', 'Completion', 'Rig Move', 'Standby']} />
          </div>
          <div className="md:col-span-2">
            <FM l="Current Depth (ft)" v="12,450" />
          </div>
          <div className="md:col-span-2">
            <FM l="Previous Depth (ft)" v="12,000" />
          </div>
          <div className="md:col-span-2">
            <FA l="Footage Drilled (ft)" v="450" />
          </div>
          <div className="md:col-span-2">
            <FA l="Days on Well" v="25" />
          </div>
          <div className="md:col-span-2">
            <FD l="Current Phase" v='8-1/2" Hole' opts={['26" Hole', '16" Hole', '12-1/4" Hole', '8-1/2" Hole', '6" Hole', 'Completion']} />
          </div>
        </div>

        {/* crew / personnel strip */}
        <div style={{ padding: '10px 20px', background: 'var(--color-card-header)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Crew:
          </div>
          {[
            ['Day TP', 'Ali Al-Harthy'],
            ['Night TP', 'Said Al-Busaidi'],
            ['Driller', 'Khalid M.'],
            ['WSL', 'John Peters'],
          ].map(([role, name]) => (
            <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{role}:</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)' }}>{name}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>POB:</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>42</span>
          </div>
        </div>
      </div>

      {/* ══════ TABS ══════ */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 0 }}>
        <div style={{ padding: '8px 20px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-card-header)' }}>
          <div style={{ display: 'inline-flex', background: 'var(--color-border-light)', borderRadius: 6, padding: 3, gap: 2 }}>
            {TABS.map(t => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', borderRadius: 5, border: 'none',
                    fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all .15s ease',
                    background: isActive
                      ? (t.alert ? 'var(--color-negative)' : '#fff')
                      : 'transparent',
                    color: isActive
                      ? (t.alert ? '#fff' : 'var(--color-text-primary)')
                      : 'var(--color-text-muted)',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', fontSize: 14, opacity: 0.7 }}>
                    {t.icon}
                  </span>
                  {t.label}
                  {t.count !== undefined && (
                    <span style={{
                      background: isActive
                        ? (t.alert ? 'rgba(255,255,255,0.25)' : 'var(--color-chart-bg-cyan)')
                        : (t.alert ? 'var(--color-negative-bg)' : 'var(--color-border-light)'),
                      color: isActive
                        ? (t.alert ? '#fff' : 'var(--color-primary)')
                        : (t.alert ? 'var(--color-negative)' : 'var(--color-text-muted)'),
                      fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
                      minWidth: 18, textAlign: 'center', lineHeight: '1.3',
                    }}>
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════ TAB: 24HR OPERATIONS ══════ */}
        {tab === 'ops' && (
          <div style={{ padding: 20 }}>
            {/* 24hr visual timeline */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)' }}>24-Hour Timeline</span>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: hrsValid ? 'var(--color-positive)' : 'var(--color-negative)',
                }}>
                  {totalOpsHrs.toFixed(1)} / 24.0 hrs {hrsValid ? '✓' : '— missing ' + (24 - totalOpsHrs).toFixed(1) + 'h'}
                </span>
              </div>
              <div style={{ display: 'flex', height: 32, borderRadius: 6, overflow: 'hidden', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                {opsRows.filter(r => Number(r.hrs) > 0).map(r => (
                  <div
                    key={r.id}
                    title={`${r.from}–${r.to} | ${r.code} | ${r.hrs}h`}
                    style={{
                      width: ((Number(r.hrs) / 24) * 100) + '%',
                      background: codeColor(r.code),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 10, fontWeight: 600, letterSpacing: 0.3,
                      borderRight: '1px solid rgba(255,255,255,0.3)',
                      cursor: 'default',
                      transition: 'opacity .15s',
                    }}
                  >
                    {Number(r.hrs) >= 1.5 ? r.code : ''}
                  </div>
                ))}
              </div>
              {/* hour markers */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, padding: '0 2px' }}>
                {[0, 4, 8, 12, 16, 20, 24].map(h => (
                  <span key={h} style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 500 }}>{String(h).padStart(2, '0')}:00</span>
                ))}
              </div>
            </div>

            {/* code breakdown summary */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {hrsByCode.map(([code, hrs]) => (
                <div key={code} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 4,
                  background: codeColor(code) + '10',
                  border: `1px solid ${codeColor(code)}20`,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: codeColor(code) }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: codeColor(code) }}>{code}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)' }}>{hrs.toFixed(1)}h</span>
                </div>
              ))}
            </div>

            {/* operations table */}
            <div className="tw">
              <table>
                <thead>
                  <tr>
                    <th scope="col" className="th" style={{ width: 40, textAlign: 'center' }}>#</th>
                    <th scope="col" className="th" style={{ width: 90 }}>From</th>
                    <th scope="col" className="th" style={{ width: 90 }}>To</th>
                    <th scope="col" className="th" style={{ width: 70, textAlign: 'center' }}>Hrs</th>
                    <th scope="col" className="th" style={{ width: 110 }}>Code</th>
                    <th scope="col" className="th" style={{ width: 90 }}>Rate</th>
                    <th scope="col" className="th">Description / Activity</th>
                    <th scope="col" className="th" style={{ width: 44 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {opsRows.map((row, idx) => (
                    <tr key={row.id}>
                      <td style={{ textAlign: 'center', fontWeight: 500, color: 'var(--color-text-muted)', fontSize: 12 }}>{idx + 1}</td>
                      <td style={{ padding: '8px 8px' }}>
                        <input className="f-man" style={{ padding: '6px 8px', fontSize: 12, textAlign: 'center' }} value={row.from} onChange={(e) => updateRow(row.id, 'from', e.target.value)} />
                      </td>
                      <td style={{ padding: '8px 8px' }}>
                        <input className="f-man" style={{ padding: '6px 8px', fontSize: 12, textAlign: 'center' }} value={row.to} onChange={(e) => updateRow(row.id, 'to', e.target.value)} />
                      </td>
                      <td style={{ padding: '8px 8px' }}>
                        <div className="f-auto" style={{ padding: '6px 8px', fontSize: 12, textAlign: 'center', fontWeight: 600 }}>{row.hrs}</div>
                      </td>
                      <td style={{ padding: '8px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 4, height: 20, borderRadius: 2, background: codeColor(row.code), flexShrink: 0 }} />
                          <select className="f-dd" style={{ padding: '6px 8px', fontSize: 12, minWidth: 70 }} value={row.code} onChange={(e) => updateRow(row.id, 'code', e.target.value)}>
                            <option value="">—</option>
                            {ACTIVITY_CODES.map(a => <option key={a.code} value={a.code}>{a.code}</option>)}
                          </select>
                        </div>
                      </td>
                      <td style={{ padding: '8px 8px' }}>
                        <select className="f-dd" style={{ padding: '6px 8px', fontSize: 12, minWidth: 60, background: row.rate === 'OP' ? 'var(--color-positive-bg)' : row.rate === 'RD' ? 'var(--color-warning-bg)' : 'var(--color-negative-bg)', border: `1px solid ${row.rate === 'OP' ? 'var(--color-positive)' : row.rate === 'RD' ? 'var(--color-warning)' : 'var(--color-negative)'}`, color: row.rate === 'OP' ? 'var(--color-positive)' : row.rate === 'RD' ? 'var(--color-warning)' : 'var(--color-negative)' }} value={row.rate} onChange={(e) => updateRow(row.id, 'rate', e.target.value)}>
                          {RATE_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '8px 8px' }}>
                        <input className="f-man" style={{ padding: '6px 8px', fontSize: 12 }} value={row.desc} onChange={(e) => updateRow(row.id, 'desc', e.target.value)} />
                      </td>
                      <td style={{ padding: '8px 4px', textAlign: 'center' }}>
                        <button onClick={() => removeRow(row.id)} style={{ color: 'var(--color-border)', cursor: 'pointer', background: 'none', border: 'none', padding: 4, borderRadius: 4, transition: 'color .15s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-negative)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-border)')}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
              <button onClick={addRow} className="btn btn-o btn-xs" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={14} /> Add Activity Row
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {!hrsValid && (
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-negative)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={14} /> Total must equal 24.0h
                  </span>
                )}
                <div style={{ padding: '6px 16px', borderRadius: 6, background: hrsValid ? 'var(--color-positive-bg)' : 'var(--color-negative-bg)', border: `1px solid ${hrsValid ? 'var(--color-positive)' : 'var(--color-negative)'}`, fontSize: 14, fontWeight: 600, color: hrsValid ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                  {totalOpsHrs.toFixed(1)} hrs
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════ TAB: MUD & PUMPS ══════ */}
        {tab === 'mud' && (
          <div style={{ padding: 20 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mud Properties */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: 'var(--color-card-header)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Droplets size={16} style={{ color: 'var(--color-text-secondary)' }} /> Mud Properties
                </div>
                <div style={{ padding: 20 }} className="grid grid-cols-2 gap-4">
                  <FM l="Mud Type" v="KCl-Polymer" />
                  <FM l="Mud Weight (ppg)" v="10.2" />
                  <FM l="Funnel Viscosity (sec/qt)" v="45" />
                  <FM l="Plastic Viscosity (cP)" v="15" />
                  <FM l="Yield Point (lb/100ft²)" v="12" />
                  <FM l="10s Gel (lb/100ft²)" v="4" />
                  <FM l="10m Gel (lb/100ft²)" v="8" />
                  <FM l="pH" v="9.5" />
                  <FM l="Chlorides (ppm)" v="45,000" />
                  <FM l="MBT (lb/bbl)" v="12.5" />
                  <FM l="Total Solids (%)" v="8.2" />
                  <FM l="Oil/Water Ratio" v="N/A" />
                </div>
              </div>

              {/* Pump Parameters */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: 'var(--color-card-header)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Gauge size={16} style={{ color: 'var(--color-text-secondary)' }} /> Pump Parameters
                </div>
                <div style={{ padding: 20 }} className="grid grid-cols-2 gap-4">
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--color-border-light)' }}>Pump #1</div>
                  </div>
                  <FM l="Liner Size (in)" v="6.5" />
                  <FM l="SPM" v="120" />
                  <FM l="Pressure (psi)" v="2,800" />
                  <FM l="Output (gpm)" v="450" />
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginTop: 8, paddingBottom: 6, borderBottom: '1px solid var(--color-border-light)' }}>Pump #2</div>
                  </div>
                  <FM l="Liner Size (in)" v="6.5" />
                  <FM l="SPM" v="115" />
                  <FM l="Pressure (psi)" v="2,750" />
                  <FM l="Output (gpm)" v="435" />
                </div>
              </div>
            </div>

            {/* Drilling Parameters */}
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden', marginTop: 20 }}>
              <div style={{ padding: '12px 16px', background: 'var(--color-card-header)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                Drilling Parameters
              </div>
              <div style={{ padding: 20 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FM l="WOB (klbs)" v="15-25" />
                <FM l="Surface Torque (ft-lbs)" v="12,000-18,000" />
                <FM l="Rotary RPM" v="120-160" />
                <FM l="Standpipe Pressure (psi)" v="2,800" />
                <FM l="ROP Avg (ft/hr)" v="34" />
                <FM l="ROP Max (ft/hr)" v="52" />
                <FA l="Total Strokes" v="125,400" />
                <FA l="Cumulative Rotating Hrs" v="382" />
              </div>
            </div>

            {/* Mud Volumes */}
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden', marginTop: 20 }}>
              <div style={{ padding: '12px 16px', background: 'var(--color-card-header)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                Mud Volumes & Pit Levels
              </div>
              <div style={{ padding: 20 }} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <FM l="Active System (bbl)" v="1,850" />
                <FM l="Reserve Pit (bbl)" v="520" />
                <FM l="Trip Tank (bbl)" v="35" />
                <FM l="Slug Pit (bbl)" v="42" />
                <FA l="Total Volume (bbl)" v="2,447" />
              </div>
            </div>
          </div>
        )}

        {/* ══════ TAB: BHA & BIT ══════ */}
        {tab === 'bha' && (
          <div style={{ padding: 20 }}>
            {/* Bit Details */}
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ padding: '12px 16px', background: 'var(--color-card-header)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                Bit Record — Current Bit
              </div>
              <div style={{ padding: 20 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FM l="Bit #" v="5" />
                <FM l="Bit Size (in)" v='8-1/2"' />
                <FD l="Bit Type" v="PDC" opts={['PDC', 'Tricone', 'Diamond', 'Impregnated']} />
                <FM l="Manufacturer / Model" v="Hughes PCDX-516" />
                <FM l="TFA (in²)" v="0.682" />
                <FM l="Serial #" v="HUG-22-5016" />
                <FM l="Depth In (ft)" v="12,280" />
                <FM l="Depth Out (ft)" v="12,450" />
                <FM l="Footage (ft)" v="170" />
                <FM l="Rotating Hours" v="5.0" />
                <FA l="Avg ROP (ft/hr)" v="34.0" />
                <FD l="Dull Grade (IADC)" v="1-1-WT-A-X-I-NO-TD" opts={['1-1-WT-A-X-I-NO-TD', '2-2-WT-A-X-I-NO-TD', '3-4-BT-S-X-I-CT-TD']} />
              </div>
            </div>

            {/* BHA Table */}
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', background: 'var(--color-card-header)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Bottom Hole Assembly (BHA #{5})
                </div>
                <Bdg c="b">{bhaRows.length} components</Bdg>
              </div>
              <div className="tw" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th scope="col" className="th" style={{ width: 40, textAlign: 'center' }}>#</th>
                      <th scope="col" className="th" style={{ minWidth: 140 }}>Component</th>
                      <th scope="col" className="th" style={{ width: 90, textAlign: 'center' }}>OD (in)</th>
                      <th scope="col" className="th" style={{ width: 90, textAlign: 'center' }}>ID (in)</th>
                      <th scope="col" className="th" style={{ width: 100, textAlign: 'center' }}>Length (ft)</th>
                      <th scope="col" className="th">Description / Specs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bhaRows.map((r, i) => (
                      <tr key={r.id}>
                        <td style={{ textAlign: 'center', fontWeight: 500, color: 'var(--color-text-muted)', fontSize: 12 }}>{i + 1}</td>
                        <td style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 12 }}>{r.comp}</td>
                        <td style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 500 }}>{r.od}</td>
                        <td style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 500, color: r.id_ === '—' ? 'var(--color-border)' : 'var(--color-text-primary)' }}>{r.id_}</td>
                        <td style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 600 }}>{r.len}</td>
                        <td style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{r.desc}</td>
                      </tr>
                    ))}
                    <tr style={{ background: 'var(--color-card-header)' }}>
                      <td colSpan={4} style={{ textAlign: 'right', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Total BHA Length:</td>
                      <td style={{ textAlign: 'center', fontWeight: 600, fontFamily: 'monospace', color: 'var(--color-text-primary)', fontSize: 13 }}>
                        {bhaRows.reduce((s, r) => s + parseFloat(r.len.replace(/,/g, '')), 0).toLocaleString()} ft
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════ TAB: NPT EVENTS ══════ */}
        {tab === 'npt' && (
          <div style={{ padding: 20 }}>
            {/* NPT summary strip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20,
              padding: '14px 20px', borderRadius: 8,
              background: totalNptHrs > 0 ? 'var(--color-negative-bg)' : 'var(--color-positive-bg)',
              border: `1px solid ${totalNptHrs > 0 ? 'var(--color-negative)' : 'var(--color-positive)'}`,
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Total NPT</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: totalNptHrs > 0 ? 'var(--color-negative)' : 'var(--color-positive)' }}>{totalNptHrs.toFixed(1)}h</div>
              </div>
              <div style={{ width: 1, height: 36, background: 'var(--color-border)' }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>% of 24hr</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: totalNptHrs > 0 ? 'var(--color-negative)' : 'var(--color-positive)' }}>{((totalNptHrs / 24) * 100).toFixed(1)}%</div>
              </div>
              <div style={{ width: 1, height: 36, background: 'var(--color-border)' }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Events</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)' }}>{nptRows.length}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <button onClick={addNptRow} className="btn btn-t btn-xs" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={14} /> Log NPT Event
                </button>
              </div>
            </div>

            {/* NPT event cards */}
            {nptRows.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '48px 40px',
                background: 'var(--color-surface)', borderRadius: 8, border: '1px dashed var(--color-border)',
              }}>
                <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>✓</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-positive)', marginBottom: 6 }}>Zero NPT</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 320, margin: '0 auto' }}>
                  No non-productive time recorded for this 24-hour period. Great job!
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {nptRows.map((row, idx) => {
                  const isExpanded = expandedNPT === row.id;
                  return (
                    <div key={row.id} style={{
                      border: '1px solid var(--color-negative)', borderRadius: 8, overflow: 'hidden',
                      background: '#fff',
                    }}>
                      {/* event header bar */}
                      <div
                        style={{
                          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                          background: '#FAF5F5', borderBottom: isExpanded ? '1px solid var(--color-negative)' : 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => setExpandedNPT(isExpanded ? null : row.id)}
                      >
                        <div style={{
                          width: 26, height: 26, borderRadius: 6,
                          background: 'var(--color-negative)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 600, flexShrink: 0,
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            {row.system || 'Uncategorized'} — {row.equip || 'No equipment specified'}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                            {row.from || '??:??'} – {row.to || '??:??'}
                          </div>
                        </div>
                        <Bdg c="r">{row.hrs}h</Bdg>
                        <Bdg c={row.severity === 'Minor' ? 'w' : row.severity === 'Major' ? 'r' : 'gr'}>
                          {row.severity}
                        </Bdg>
                        <Bdg c={row.rateApplied === 'OP' ? 'g' : row.rateApplied === 'RD' ? 'w' : 'r'}>
                          {row.rateApplied} Rate
                        </Bdg>
                        {isExpanded ? <ChevronUp size={18} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--color-text-muted)' }} />}
                      </div>

                      {/* expanded detail form */}
                      {isExpanded && (
                        <div style={{ padding: 24 }}>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ marginBottom: 20 }}>
                            <FM l="From" v={row.from} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNptRow(row.id, 'from', e.target.value)} />
                            <FM l="To" v={row.to} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNptRow(row.id, 'to', e.target.value)} />
                            <FA l="Duration (hrs)" v={String(row.hrs)} />
                            <FD l="Rate Applied" v={row.rateApplied} opts={RATE_TYPES} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateNptRow(row.id, 'rateApplied', e.target.value)} />
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ marginBottom: 20 }}>
                            <FD l="System / Category" v={row.system} opts={NPT_SYSTEMS} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateNptRow(row.id, 'system', e.target.value)} />
                            <FD l="Severity" v={row.severity} opts={['Minor', 'Major', 'Critical']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateNptRow(row.id, 'severity', e.target.value)} />
                            <FM l="Equipment / Component" v={row.equip} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNptRow(row.id, 'equip', e.target.value)} />
                          </div>

                          <div className="grid grid-cols-1 gap-4" style={{ marginBottom: 16 }}>
                            <FM l="Event Description" v={row.desc} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNptRow(row.id, 'desc', e.target.value)} rows={2} />
                            <FM l="Root Cause Analysis" v={row.rootCause} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNptRow(row.id, 'rootCause', e.target.value)} rows={2} />
                            <FM l="Corrective Action Taken" v={row.corrective} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNptRow(row.id, 'corrective', e.target.value)} rows={2} />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => removeNptRow(row.id)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '7px 14px', borderRadius: 6,
                                background: 'var(--color-negative-bg)', border: '1px solid var(--color-negative)',
                                color: 'var(--color-negative)', fontSize: 12, fontWeight: 600,
                                cursor: 'pointer', transition: 'all .15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#F5E5E5'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-negative-bg)'; }}
                            >
                              <Trash2 size={14} /> Remove Event
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════ SIGNOFF CHAIN ══════ */}
      <div className="card">
        <div className="card-hdr">Approval & Signoff</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="appr done">
            <span style={{ fontSize: 16 }}>✓</span>
            <div style={{ flex: 1 }}>
              <strong>Night Tool Pusher (NTP)</strong> — Reviewed & Signed
              <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--color-text-muted)' }}>Said Al-Busaidi — 15-Jun-2025 06:00</span>
            </div>
            <Bdg c="g">Approved</Bdg>
          </div>
          <div className="appr">
            <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>○</span>
            <div style={{ flex: 1 }}>
              <strong>Rig Manager</strong> — Pending Review
            </div>
            <Bdg c="w">Pending</Bdg>
          </div>
          <div className="appr">
            <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>○</span>
            <div style={{ flex: 1 }}>
              <strong>WSL (Client Representative)</strong> — Awaiting RM Approval
            </div>
            <Bdg c="gr">Waiting</Bdg>
          </div>
        </div>
      </div>
    </div>
  );
}
