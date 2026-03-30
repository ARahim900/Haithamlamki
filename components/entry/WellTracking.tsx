'use client';
import React, { useState } from 'react';
import { FA, FD, FM, FieldLegend, Bdg } from '@/components/Shared';
import { Modal } from '@/components/Modal';
import { useWellTracking } from '@/hooks/useDb';
import { RIGS } from '@/lib/data';

export function WellTracking() {
  const { data: wellData, loading, error, refetch, insert, update, remove } = useWellTracking();
  const [selectedRig, setSelectedRig] = useState('Rig 302');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    rig: '', well_name: '', field: '', rig_move_date: '', spud_date: '', release_date: '',
    total_depth: '', current_depth: '', afe_days: '', actual_days: '', contracting_co: '', status: 'In Progress'
  });

  // Guard against undefined data
  const safeWellData = wellData ?? [];
  const filteredWells = safeWellData.filter(w => w.rig === selectedRig);
  const currentWell = filteredWells[0];

  const progress = currentWell && currentWell.total_depth ?
    ((currentWell.current_depth ?? 0) / currentWell.total_depth * 100).toFixed(1) : '0';

  const handleAddSubmit = async () => {
    try {
      const now = new Date();
      await insert({
        rig: form.rig || selectedRig,
        well_name: form.well_name,
        field: form.field || null,
        rig_move_date: form.rig_move_date || null,
        spud_date: form.spud_date || null,
        release_date: form.release_date || null,
        total_depth: form.total_depth ? Number(form.total_depth) : null,
        current_depth: form.current_depth ? Number(form.current_depth) : null,
        afe_days: form.afe_days ? Number(form.afe_days) : null,
        actual_days: form.actual_days ? Number(form.actual_days) : null,
        contracting_co: form.contracting_co || null,
        status: form.status || null,
        year: now.getFullYear(),
        month: now.toLocaleString('en', { month: 'short' }),
      });
      setShowAddModal(false);
      setForm({ rig: '', well_name: '', field: '', rig_move_date: '', spud_date: '', release_date: '', total_depth: '', current_depth: '', afe_days: '', actual_days: '', contracting_co: '', status: 'In Progress' });
      await refetch();
    } catch (err) {
      console.error('Failed to add well:', err);
      alert('Failed to add well. Please try again.');
    }
  };

  const handleEditClick = (well: typeof safeWellData[0]) => {
    setEditingId(well.id);
    setForm({
      rig: well.rig,
      well_name: well.well_name,
      field: well.field || '',
      rig_move_date: well.rig_move_date || '',
      spud_date: well.spud_date || '',
      release_date: well.release_date || '',
      total_depth: well.total_depth == null ? '' : String(well.total_depth),
      current_depth: well.current_depth == null ? '' : String(well.current_depth),
      afe_days: well.afe_days == null ? '' : String(well.afe_days),
      actual_days: well.actual_days == null ? '' : String(well.actual_days),
      contracting_co: well.contracting_co || '',
      status: well.status || 'In Progress',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!editingId) return;
    try {
      await update(editingId, {
        rig: form.rig,
        well_name: form.well_name,
        field: form.field || null,
        rig_move_date: form.rig_move_date || null,
        spud_date: form.spud_date || null,
        release_date: form.release_date || null,
        total_depth: form.total_depth ? Number(form.total_depth) : null,
        current_depth: form.current_depth ? Number(form.current_depth) : null,
        afe_days: form.afe_days ? Number(form.afe_days) : null,
        actual_days: form.actual_days ? Number(form.actual_days) : null,
        contracting_co: form.contracting_co || null,
        status: form.status || null,
      });
      setShowEditModal(false);
      setEditingId(null);
      await refetch();
    } catch (err) {
      console.error('Failed to update well:', err);
      alert('Failed to update well. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this well?')) return;
    try {
      await remove(id);
      await refetch();
    } catch (err) {
      console.error('Failed to delete well:', err);
      alert('Failed to delete well. Please try again.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading well data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Well Tracking</span>
            <FD v={selectedRig} opts={RIGS} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRig(e.target.value)} />
            {currentWell && <Bdg c="b">{currentWell.well_name}</Bdg>}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-o btn-xs" onClick={() => { setForm({ ...form, rig: selectedRig }); setShowAddModal(true); }}>+ Add Well</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        {currentWell ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FA l="Well Name" v={currentWell.well_name} />
            <FA l="Field" v={currentWell.field || '-'} />
            <FA l="Status" v={currentWell.status || '-'} />
            <FA l="Target Depth (ft)" v={(currentWell.total_depth ?? 0).toLocaleString()} />
            <FA l="Current Depth (ft)" v={(currentWell.current_depth ?? 0).toLocaleString()} />
            <FA l="Progress (%)" v={`${progress}%`} />
            <FA l="Spud Date" v={currentWell.spud_date || '-'} />
            <FA l="AFE Days" v={String(currentWell.afe_days ?? '-')} />
            <FA l="Actual Days" v={String(currentWell.actual_days ?? '-')} />
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No wells found for {selectedRig}. Add a new well to get started.</div>
        )}
      </div>

      <div className="card">
        <div className="card-hdr">All Wells — {selectedRig}</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                {['Well Name', 'Field', 'Total Depth', 'Current Depth', 'Progress', 'Status', 'Actions'].map(h => (
                  <th key={h} scope="col" className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredWells.map((w) => {
                const prog = w.total_depth ? ((w.current_depth ?? 0) / w.total_depth * 100).toFixed(1) : '0';
                return (
                  <tr key={w.id}>
                    <td><strong>{w.well_name}</strong></td>
                    <td>{w.field || '-'}</td>
                    <td className="tb-num">{(w.total_depth ?? 0).toLocaleString()} ft</td>
                    <td className="tb-num">{(w.current_depth ?? 0).toLocaleString()} ft</td>
                    <td className="tb-num" style={{ fontWeight: 700, color: Number(prog) >= 100 ? 'var(--color-positive)' : 'var(--color-info)' }}>{prog}%</td>
                    <td><Bdg c={w.status === 'Completed' ? 'g' : w.status === 'In Progress' ? 'b' : 'gr'}>{w.status || '-'}</Bdg></td>
                    <td className="flex gap-2">
                      <button className="btn btn-t btn-xs" onClick={() => handleEditClick(w)}>Edit</button>
                      <button className="btn btn-d btn-xs" onClick={() => handleDelete(w.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
              {filteredWells.length === 0 && (
                <tr><td colSpan={7} className="text-center text-gray-400 py-8">No wells for this rig</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Well"
        footer={
          <>
            <button className="btn btn-o" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-t" onClick={handleAddSubmit}>Save Well</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FD l="Rig" v={form.rig || selectedRig} opts={RIGS} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, rig: e.target.value })} />
          <FM l="Well Name" v={form.well_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, well_name: e.target.value })} />
          <FM l="Field" v={form.field} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, field: e.target.value })} />
          <FD l="Status" v={form.status} opts={['In Progress', 'Completed', 'Suspended']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, status: e.target.value })} />
          <FM l="Total Depth (ft)" v={form.total_depth} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, total_depth: e.target.value })} />
          <FM l="Current Depth (ft)" v={form.current_depth} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, current_depth: e.target.value })} />
          <FM l="Spud Date" v={form.spud_date} type="date" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, spud_date: e.target.value })} />
          <FM l="AFE Days" v={form.afe_days} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, afe_days: e.target.value })} />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Well"
        footer={
          <>
            <button className="btn btn-o" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn btn-t" onClick={handleEditSubmit}>Update Well</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FD l="Rig" v={form.rig} opts={RIGS} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, rig: e.target.value })} />
          <FM l="Well Name" v={form.well_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, well_name: e.target.value })} />
          <FM l="Field" v={form.field} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, field: e.target.value })} />
          <FD l="Status" v={form.status} opts={['In Progress', 'Completed', 'Suspended']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, status: e.target.value })} />
          <FM l="Total Depth (ft)" v={form.total_depth} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, total_depth: e.target.value })} />
          <FM l="Current Depth (ft)" v={form.current_depth} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, current_depth: e.target.value })} />
          <FM l="Spud Date" v={form.spud_date} type="date" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, spud_date: e.target.value })} />
          <FM l="AFE Days" v={form.afe_days} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, afe_days: e.target.value })} />
          <FM l="Actual Days" v={form.actual_days} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, actual_days: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
