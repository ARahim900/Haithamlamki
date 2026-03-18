'use client';
import React, { useState } from 'react';
import { FA, FD, FM, FDr, FieldLegend } from '@/components/Shared';

const dailyRates = { OP: 18500, RD: 9250, BKD: 0, SP: 14000, ZR: 0, SK: 4500 };
type RateKey = keyof typeof dailyRates;

const initialDays = Array.from({ length: 10 }, (_, i) => ({
  day: i + 1,
  date: `${String(i + 1).padStart(2, '0')}-Jun-2025`,
  rate: (i < 8 ? 'OP' : i === 8 ? 'RD' : 'OP') as RateKey,
  hrs: 24,
  remarks: i === 8 ? 'Reduced rate — waiting on cement' : 'Normal drilling operations',
}));

export function BillingTicket() {
  const [days, setDays] = useState(initialDays);

  const updateDay = (idx: number, field: string, value: string) => {
    setDays(days.map((d, i) => i === idx ? { ...d, [field]: value } : d));
  };

  const totalByRate = (rate: RateKey) => days.filter(d => d.rate === rate).reduce((s, d) => s + d.hrs, 0);
  const totalRevenue = days.reduce((s, d) => s + (d.hrs / 24) * dailyRates[d.rate], 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Billing Ticket</span>
            <span className="bdg b">Sheet 4</span>
            <span className="bdg gr">Rig 103</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-o btn-xs">Save Draft</button>
            <button className="btn btn-g btn-xs">Submit for Billing</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FD l="Rig" v="Rig 103" />
          <FDr l="Well Name" v="HAJAL NE 20H1" />
          <FDr l="WBS #" v="WBS-2025-NWT-103" />
          <FM l="Billing Period" v="Jun 2025" />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FDr l="Rig Move Date" v="28-Apr-2025" />
          <FDr l="Spud Date" v="14-May-2025" />
          <FM l="Release Date" v="" ph="Pending..." />
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Daily Rate Classification</div>
        <div className="ddor-rates">
          {Object.entries(dailyRates).map(([k, v]) => (
            <div key={k} className="dr-cell">
              <div style={{ fontSize: 11, color: '#92400E', fontWeight: 800 }}>{k} RATE</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#854D0E' }}>${v.toLocaleString()}/day</div>
            </div>
          ))}
        </div>
        <div className="tw" style={{ borderRadius: '0 0 20px 20px' }}>
          <table>
            <thead>
              <tr>
                {['Day', 'Date', 'Rate Type', 'Hours', 'Revenue ($)', 'Remarks'].map(h => (
                  <th key={h} className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>Day {d.day}</td>
                  <td style={{ fontSize: 13, color: '#64748B' }}>{d.date}</td>
                  <td>
                    <select
                      className="f-dd"
                      style={{ padding: '6px 10px', fontSize: 13, minWidth: 80 }}
                      value={d.rate}
                      onChange={(e) => updateDay(i, 'rate', e.target.value)}
                    >
                      {Object.keys(dailyRates).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="tb-num" style={{ fontWeight: 700 }}>{d.hrs}h</td>
                  <td className="tb-num" style={{ fontWeight: 800, color: '#047857' }}>
                    ${((d.hrs / 24) * dailyRates[d.rate]).toLocaleString()}
                  </td>
                  <td>
                    <input
                      className="f-man"
                      style={{ padding: '6px 10px', fontSize: 12 }}
                      value={d.remarks}
                      onChange={(e) => updateDay(i, 'remarks', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
              <tr style={{ background: '#F0FDF4', fontWeight: 800 }}>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 800 }}>Totals:</td>
                <td className="tb-num">{days.reduce((s, d) => s + d.hrs, 0)}h</td>
                <td className="tb-num" style={{ color: '#047857', fontSize: 16 }}>${Math.round(totalRevenue).toLocaleString()}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Rate Summary</div>
        <div className="kpi-row" style={{ margin: 0 }}>
          <div className="kpi g">
            <div className="kpi-l">Operating</div>
            <div className="kpi-v">{totalByRate('OP')}h</div>
            <div className="kpi-s">{(totalByRate('OP') / 24).toFixed(1)} days</div>
          </div>
          <div className="kpi w">
            <div className="kpi-l">Reduced</div>
            <div className="kpi-v">{totalByRate('RD')}h</div>
            <div className="kpi-s">{(totalByRate('RD') / 24).toFixed(1)} days</div>
          </div>
          <div className="kpi r">
            <div className="kpi-l">Breakdown</div>
            <div className="kpi-v">{totalByRate('BKD')}h</div>
            <div className="kpi-s">{(totalByRate('BKD') / 24).toFixed(1)} days</div>
          </div>
          <div className="kpi b">
            <div className="kpi-l">Est. Revenue</div>
            <div className="kpi-v">${Math.round(totalRevenue / 1000)}K</div>
            <div className="kpi-s">Based on {days.length} days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
