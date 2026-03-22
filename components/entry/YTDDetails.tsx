'use client';
import React, { useState } from 'react';
import { FA, FD, FM, FieldLegend, Bdg } from '@/components/Shared';
import { useNptEvents } from '@/hooks/useDb';
import { RIGS } from '@/lib/data';
import { Trash2 } from 'lucide-react';

const NPT_SYSTEMS = ['Drawworks', 'Mud Pumps', 'Top Drive', 'Electrical', 'BOP', 'MWD/LWD', 'Drill String', 'Contractual'];

export function YTDDetails() {
  const { data: nptData, loading, error, refetch, insert, update, remove } = useNptEvents();
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    rig: '', event_date: '', npt_type: 'Abraj', hours: '', system_category: '',
    part_equipment: '', root_cause: '', corrective_action: '', future_action: '', action_party: '', contractual_process: ''
  });

  const filtered = filter === 'All' ? nptData : nptData.filter(r => r.npt_type === filter);
  const totalHrs = filtered.reduce((s, r) => s + (r.hours ?? 0), 0);

  const handleAddSubmit = async () => {
    await insert({
      rig: form.rig,
      event_date: form.event_date,
      year: new Date(form.event_date).getFullYear(),
      month: new Date(form.event_date).toLocaleString('en', { month: 'short' }),
      npt_type: form.npt_type,
      hours: form.hours ? Number(form.hours) : null,
      system_category: form.system_category || null,
      parent_equipment: null,
      part_equipment: form.part_equipment || null,
      contractual_process: form.contractual_process || null,
      dept_responsibility: null,
      immediate_cause: null,
      root_cause: form.root_cause || null,
      corrective_action: form.corrective_action || null,
      future_action: form.future_action || null,
      action_party: form.action_party || null,
      notification_number: null,
    });
    setShowAddModal(false);
    setForm({ rig: '', event_date: '', npt_type: 'Abraj', hours: '', system_category: '', part_equipment: '', root_cause: '', corrective_action: '', future_action: '', action_party: '', contractual_process: '' });
    refetch();
  };

  const updateRow = async (id: number, field: string, value: string | number) => {
    await update(id, { [field]: value });
    refetch();
  };

  const removeRow = async (id: number) => {
    await remove(id);
    refetch();
  };

  if (loading) return <div className="p-8 text-center">Loading NPT data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

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
            <button onClick={() => setShowAddModal(true)} className="btn btn-t btn-xs">+ Add NPT Event</button>
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
        </div>
      </div>

      {/* NPT Events Table */}
      <div className="card">
        <div className="card-hdr">NPT Events</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                {['Rig', 'Date', 'Type', 'Hours', 'System', 'Root Cause', 'Actions'].map(h => (
                  <th key={h} className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.rig}</strong></td>
                  <td style={{ fontSize: 13, color: '#64748B' }}>{r.event_date}</td>
                  <td><Bdg c={r.npt_type === 'Abraj' ? 'r' : 'w'}>{r.npt_type || '-'}</Bdg></td>
                  <td className="tb-num" style={{ fontWeight: 700, color: '#DC2626' }}>{r.hours ?? 0}h</td>
                  <td>{r.system_category || '-'}</td>
                  <td style={{ fontSize: 12, color: '#64748B', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.root_cause || r.contractual_process || '-'}
                  </td>
                  <td className="flex gap-2">
                    <button onClick={() => removeRow(r.id)} className="btn btn-d btn-xs">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-gray-400 py-8">No NPT events found</td></tr>
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
              <span className="modal-title">Add NPT Event</span>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <FD l="Rig" v={form.rig} opts={RIGS.slice(0, 15)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, rig: e.target.value })} />
                <FM l="Date" v={form.event_date} type="date" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, event_date: e.target.value })} />
                <FD l="NPT Type" v={form.npt_type} opts={['Abraj', 'Contractual']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, npt_type: e.target.value })} />
                <FM l="Duration (hrs)" v={form.hours} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, hours: e.target.value })} />
                {form.npt_type === 'Abraj' && (
                  <>
                    <FD l="System / Category" v={form.system_category} opts={NPT_SYSTEMS} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, system_category: e.target.value })} />
                    <FM l="Equipment Failed" v={form.part_equipment} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, part_equipment: e.target.value })} />
                    <FM l="Root Cause" v={form.root_cause} rows={2} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, root_cause: e.target.value })} />
                    <FM l="Corrective Action" v={form.corrective_action} rows={2} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, corrective_action: e.target.value })} />
                  </>
                )}
                {form.npt_type === 'Contractual' && (
                  <div className="col-span-2">
                    <FM l="Contractual Process Description" v={form.contractual_process} rows={3} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, contractual_process: e.target.value })} />
                  </div>
                )}
                <FD l="Responsible Party" v={form.action_party} opts={['Maint. Supervisor', 'Drilling Engr.', 'Electrical Engr.', 'Rig Manager', 'Client Rep', 'WSL']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, action_party: e.target.value })} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-o" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-t" onClick={handleAddSubmit}>Save Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
