'use client';
import React, { useState, useMemo } from 'react';
import { FA, FD, FM, FDr, FieldLegend } from '@/components/Shared';
import { useBillingTickets } from '@/hooks/useDb';
import { RIGS, MONTHS } from '@/lib/data';

const dailyRates = { OP: 18500, RD: 9250, BKD: 0, SP: 14000, ZR: 0, SK: 4500 };
type RateKey = keyof typeof dailyRates;

const rateLabels: Record<RateKey, string> = {
  OP: 'Operating', RD: 'Reduced', BKD: 'Breakdown', SP: 'Special', ZR: 'Zero Rate', SK: 'Stacking',
};
const rateColors: Record<RateKey, string> = {
  OP: 'g', RD: 'w', BKD: 'r', SP: 'b', ZR: 'gr', SK: 'p',
};

interface DayEntry {
  day: number;
  date: string;
  rate: RateKey;
  hrs: number;
  remarks: string;
}

function createDefaultDays(month: string, year: string): DayEntry[] {
  return Array.from({ length: 10 }, (_, i) => ({
    day: i + 1,
    date: `${String(i + 1).padStart(2, '0')}-${month}-${year}`,
    rate: (i < 8 ? 'OP' : i === 8 ? 'RD' : 'OP') as RateKey,
    hrs: 24,
    remarks: i === 8 ? 'Reduced rate - waiting on cement' : 'Normal operations',
  }));
}

export function BillingTicket() {
  const { data: tickets, loading, error, refetch, insert } = useBillingTickets();
  const [selectedRig, setSelectedRig] = useState('Rig 103');
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2025');

  // Find current ticket
  const currentTicket = tickets.find(t => t.rig === selectedRig && t.billing_period === `${selectedMonth} ${selectedYear}`);

  // Use default days - memoized
  const baseDays = useMemo(() => createDefaultDays(selectedMonth, selectedYear), [selectedMonth, selectedYear]);

  // Local editable state
  const [days, setDays] = useState<DayEntry[]>(baseDays);

  // Simple key for resetting - change selection clears edits
  const selectionKey = `${selectedRig}-${selectedMonth}-${selectedYear}`;
  const [lastKey, setLastKey] = useState(selectionKey);

  // Reset days when selection changes (using event handler pattern)
  const handleRigChange = (rig: string) => {
    setSelectedRig(rig);
    setDays(createDefaultDays(selectedMonth, selectedYear));
    setLastKey(`${rig}-${selectedMonth}-${selectedYear}`);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setDays(createDefaultDays(month, selectedYear));
    setLastKey(`${selectedRig}-${month}-${selectedYear}`);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setDays(createDefaultDays(selectedMonth, year));
    setLastKey(`${selectedRig}-${selectedMonth}-${year}`);
  };

  const updateDay = (idx: number, field: string, value: string) => {
    setDays(prev => prev.map((d, i) => i === idx ? { ...d, [field]: field === 'rate' ? value as RateKey : value } : d));
  };

  const totalByRate = (rate: RateKey) => days.filter(d => d.rate === rate).reduce((s, d) => s + d.hrs, 0);
  const totalRevenue = days.reduce((s, d) => s + (d.hrs / 24) * dailyRates[d.rate], 0);

  const handleSave = async () => {
    if (!currentTicket) {
      await insert({
        rig: selectedRig,
        well_name: null,
        wbs: null,
        billing_period: `${selectedMonth} ${selectedYear}`,
        rig_move_date: null,
        spud_date: null,
        release_date: null,
      });
    }
    refetch();
  };

  if (loading) return <div className="p-8 text-center">Loading billing data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Billing Ticket</span>
            <span className="bdg b">Sheet 4</span>
            <FD v={selectedRig} opts={RIGS.slice(0, 15)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleRigChange(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <FD v={selectedMonth} opts={MONTHS} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleMonthChange(e.target.value)} />
            <FD v={selectedYear} opts={['2024', '2025']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleYearChange(e.target.value)} />
            <button className="btn btn-o btn-xs">Save Draft</button>
            <button className="btn btn-g btn-xs" onClick={handleSave}>Submit for Billing</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FA l="Rig" v={selectedRig} />
          <FDr l="Well Name" v={currentTicket?.well_name || 'Pending...'} />
          <FDr l="WBS #" v={currentTicket?.wbs || 'Pending...'} />
          <FA l="Billing Period" v={`${selectedMonth} ${selectedYear}`} />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FDr l="Rig Move Date" v={currentTicket?.rig_move_date || '-'} />
          <FDr l="Spud Date" v={currentTicket?.spud_date || '-'} />
          <FM l="Release Date" v={currentTicket?.release_date || ''} ph="Pending..." />
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
          {(Object.keys(dailyRates) as RateKey[]).map(code => (
            <div key={code} className={`kpi ${rateColors[code]}`}>
              <div className="kpi-l">{rateLabels[code]}</div>
              <div className="kpi-v">{totalByRate(code)}h</div>
              <div className="kpi-s">{(totalByRate(code) / 24).toFixed(1)} days</div>
            </div>
          ))}
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
