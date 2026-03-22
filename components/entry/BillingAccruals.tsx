'use client';
import React, { useState } from 'react';
import { FA, FD, FM, FDr, FieldLegend, KPI, Bdg } from '@/components/Shared';
import { useBillingAccruals } from '@/hooks/useDb';
import { RIGS, MONTHS } from '@/lib/data';

export function BillingAccruals() {
  const { data: accrualData, loading, error, refetch, insert, update, remove } = useBillingAccruals();
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    rig: '', wbs: '', well_name: '', network: '', field_name: '', area: '',
    opp_hrs: '', reduce_hrs: '', bkd_hrs: '', zero_hrs: '', special_rate: '', stacked_hrs: '', rig_move_hrs: '', rig_move_amt: ''
  });

  // Filter by billing_date matching month/year
  const filteredData = accrualData.filter(r => {
    if (!r.billing_date) return false;
    const date = new Date(r.billing_date);
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();
    return month === selectedMonth && year === Number(selectedYear);
  });

  const totalOP = filteredData.reduce((s, r) => s + (r.opp_hrs ?? 0), 0);
  const totalRD = filteredData.reduce((s, r) => s + (r.reduce_hrs ?? 0), 0);
  const totalBKD = filteredData.reduce((s, r) => s + (r.bkd_hrs ?? 0), 0);
  const totalRM = filteredData.reduce((s, r) => s + (r.rig_move_amt ?? 0), 0);

  const handleAddSubmit = async () => {
    await insert({
      rig: form.rig,
      wbs: form.wbs || null,
      well_name: form.well_name || null,
      network: form.network || null,
      field_name: form.field_name || null,
      area: form.area || null,
      opp_hrs: form.opp_hrs ? Number(form.opp_hrs) : null,
      reduce_hrs: form.reduce_hrs ? Number(form.reduce_hrs) : null,
      bkd_hrs: form.bkd_hrs ? Number(form.bkd_hrs) : null,
      zero_hrs: form.zero_hrs ? Number(form.zero_hrs) : null,
      special_rate: form.special_rate ? Number(form.special_rate) : null,
      stacked_hrs: form.stacked_hrs ? Number(form.stacked_hrs) : null,
      rig_move_hrs: form.rig_move_hrs ? Number(form.rig_move_hrs) : null,
      rig_move_amt: form.rig_move_amt ? Number(form.rig_move_amt) : null,
      total_hrs: 744,
      billing_date: `${selectedYear}-${String(MONTHS.indexOf(selectedMonth) + 1).padStart(2, '0')}-01`,
      remarks: null,
    });
    setShowAddModal(false);
    setForm({ rig: '', wbs: '', well_name: '', network: '', field_name: '', area: '', opp_hrs: '', reduce_hrs: '', bkd_hrs: '', zero_hrs: '', special_rate: '', stacked_hrs: '', rig_move_hrs: '', rig_move_amt: '' });
    refetch();
  };

  if (loading) return <div className="p-8 text-center">Loading accruals data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Billing Accruals</span>
            <span className="bdg b">Sheet 12</span>
          </div>
          <div className="flex items-center gap-2">
            <FD v={selectedMonth} opts={MONTHS} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMonth(e.target.value)} />
            <FD v={selectedYear} opts={['2024', '2025']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)} />
            <button className="btn btn-o btn-xs">Export</button>
            <button className="btn btn-t btn-xs" onClick={() => setShowAddModal(true)}>+ Add Entry</button>
            <button className="btn btn-g btn-xs">Finalize Month</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="alert-info">
          <span>ℹ</span>
          <div>
            <strong>Monthly consolidation:</strong> All rate categories, WBS, network, well, field, area, and rig move amounts.
            Full month = 744 hours per rig. Data sourced from Billing Tickets (Sheet 4) and Rig Move (Sheet 1).
          </div>
        </div>
      </div>

      <div className="kpi-row">
        <KPI l="Total OP Hours" v={totalOP.toLocaleString() + 'h'} s={`${filteredData.length} rigs`} cls="g" />
        <KPI l="Total Reduced" v={totalRD + 'h'} s={`${(totalRD / 24).toFixed(1)} days`} cls="w" />
        <KPI l="Total Breakdown" v={totalBKD + 'h'} s="NPT repairs" cls="r" />
        <KPI l="Rig Move Revenue" v={'$' + (totalRM / 1000).toFixed(0) + 'K'} s={filteredData.filter(r => (r.rig_move_amt ?? 0) > 0).length + ' moves'} cls="b" />
      </div>

      <div className="card">
        <div className="card-hdr">
          Accrual Consolidation — {selectedMonth} {selectedYear}
          <span style={{ fontSize: 12, color: '#64748B' }}>744h = full month</span>
        </div>
        <div className="tw" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                {['Rig', 'WBS #', 'Network', 'Well', 'Field', 'Area', 'OP (h)', 'RD (h)', 'BKD (h)', 'SP (h)', 'ZR (h)', 'SK (h)', 'Rig Move ($)', 'Total (h)', 'Actions'].map(h => (
                  <th key={h} className="th" style={{ minWidth: h.length > 6 ? 100 : 70 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((r, i) => (
                <tr key={i}>
                  <td><strong>{r.rig}</strong></td>
                  <td style={{ fontSize: 11, fontFamily: 'monospace', color: '#0284C7' }}>{r.wbs || '-'}</td>
                  <td style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748B' }}>{r.network || '-'}</td>
                  <td style={{ fontSize: 12, color: '#334155' }}>{r.well_name || '-'}</td>
                  <td><Bdg c="gr">{r.field_name || '-'}</Bdg></td>
                  <td><Bdg c={r.area === 'North' ? 'b' : r.area === 'South' ? 'g' : 'w'}>{r.area || '-'}</Bdg></td>
                  <td className="tb-num" style={{ color: '#047857', fontWeight: 700 }}>{r.opp_hrs ?? 0}</td>
                  <td className="tb-num" style={{ color: (r.reduce_hrs ?? 0) ? '#D97706' : '#CBD5E1' }}>{r.reduce_hrs || '-'}</td>
                  <td className="tb-num" style={{ color: (r.bkd_hrs ?? 0) ? '#DC2626' : '#CBD5E1' }}>{r.bkd_hrs || '-'}</td>
                  <td className="tb-num" style={{ color: (r.special_rate ?? 0) ? '#0284C7' : '#CBD5E1' }}>{r.special_rate || '-'}</td>
                  <td className="tb-num" style={{ color: (r.zero_hrs ?? 0) ? '#64748B' : '#CBD5E1' }}>{r.zero_hrs || '-'}</td>
                  <td className="tb-num" style={{ color: '#CBD5E1' }}>{r.stacked_hrs || '-'}</td>
                  <td className="tb-num" style={{ fontWeight: (r.rig_move_amt ?? 0) ? 700 : 400, color: (r.rig_move_amt ?? 0) ? '#0284C7' : '#CBD5E1' }}>
                    {(r.rig_move_amt ?? 0) ? '$' + (r.rig_move_amt ?? 0).toLocaleString() : '-'}
                  </td>
                  <td className="tb-num" style={{ fontWeight: 800 }}>{r.total_hrs ?? 744}h</td>
                  <td>
                    <button className="btn btn-d btn-xs" onClick={() => { remove(r.id); refetch(); }}>×</button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr><td colSpan={15} className="text-center text-gray-400 py-8">No accrual data for {selectedMonth} {selectedYear}</td></tr>
              )}
              {filteredData.length > 0 && (
                <tr style={{ background: '#F0F9FF', fontWeight: 800 }}>
                  <td colSpan={6} style={{ textAlign: 'right', fontWeight: 900 }}>TOTALS</td>
                  <td className="tb-num" style={{ fontWeight: 900, color: '#047857' }}>{totalOP}</td>
                  <td className="tb-num">{totalRD}</td>
                  <td className="tb-num" style={{ color: '#DC2626' }}>{totalBKD}</td>
                  <td className="tb-num">{filteredData.reduce((s, r) => s + (r.special_rate ?? 0), 0)}</td>
                  <td className="tb-num">{filteredData.reduce((s, r) => s + (r.zero_hrs ?? 0), 0)}</td>
                  <td className="tb-num">{filteredData.reduce((s, r) => s + (r.stacked_hrs ?? 0), 0)}</td>
                  <td className="tb-num" style={{ color: '#0284C7' }}>${totalRM.toLocaleString()}</td>
                  <td className="tb-num" style={{ fontWeight: 900 }}>{filteredData.reduce((s, r) => s + (r.total_hrs ?? 0), 0)}h</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <span className="modal-title">Add Billing Accrual</span>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <FD l="Rig" v={form.rig} opts={RIGS.slice(0, 15)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, rig: e.target.value })} />
                <FM l="WBS #" v={form.wbs} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, wbs: e.target.value })} />
                <FM l="Well Name" v={form.well_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, well_name: e.target.value })} />
                <FM l="Network" v={form.network} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, network: e.target.value })} />
                <FM l="Field" v={form.field_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, field_name: e.target.value })} />
                <FD l="Area" v={form.area} opts={['North', 'South', 'Central']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, area: e.target.value })} />
                <FM l="OP Hours" v={form.opp_hrs} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, opp_hrs: e.target.value })} />
                <FM l="Reduced Hours" v={form.reduce_hrs} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, reduce_hrs: e.target.value })} />
                <FM l="Breakdown Hours" v={form.bkd_hrs} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, bkd_hrs: e.target.value })} />
                <FM l="Rig Move Amount ($)" v={form.rig_move_amt} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, rig_move_amt: e.target.value })} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-o" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-t" onClick={handleAddSubmit}>Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
