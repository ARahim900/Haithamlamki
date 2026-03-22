'use client';
import React, { useState } from 'react';
import { FD, FM, FieldLegend } from '@/components/Shared';
import { useRigMoves } from '@/hooks/useDb';
import { RIGS } from '@/lib/data';

export function RigMove() {
  const { data: moveData, loading, error, refetch, insert, update, remove } = useRigMoves();
  const [selectedRig, setSelectedRig] = useState('Rig 106');
  
  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    rig: '', move_from: '', move_to: '', move_type: 'Intra-field',
    start_date: '', end_date: '', budget_days: '', actual_days: '',
    budget_cost: '', actual_cost: '', client_income: '', distance_km: '', mover_company: '', remarks: '', status: 'In Progress'
  });
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    rig: '', move_from: '', move_to: '', move_type: 'Intra-field',
    start_date: '', end_date: '', budget_days: '', actual_days: '',
    budget_cost: '', actual_cost: '', client_income: '', distance_km: '', mover_company: '', remarks: '', status: 'In Progress'
  });
  
  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const toNumOrNull = (v: string) => v === '' ? null : Number(v);
  const toStrOrNull = (v: string) => v === '' ? null : v;

  const handleAddSubmit = async () => {
    await insert({
      rig: addForm.rig,
      move_from: toStrOrNull(addForm.move_from),
      move_to: toStrOrNull(addForm.move_to),
      budget_days: toNumOrNull(addForm.budget_days),
      actual_days: toNumOrNull(addForm.actual_days),
      budget_cost: toNumOrNull(addForm.budget_cost),
      actual_cost: toNumOrNull(addForm.actual_cost),
      client_income: toNumOrNull(addForm.client_income),
      distance_km: toStrOrNull(addForm.distance_km),
      mover_company: toStrOrNull(addForm.mover_company),
      start_date: toStrOrNull(addForm.start_date),
      end_date: toStrOrNull(addForm.end_date),
      status: toStrOrNull(addForm.status),
      remarks: toStrOrNull(addForm.remarks),
    });
    setShowAddModal(false);
    setAddForm({
      rig: '', move_from: '', move_to: '', move_type: 'Intra-field',
      start_date: '', end_date: '', budget_days: '', actual_days: '',
      budget_cost: '', actual_cost: '', client_income: '', distance_km: '', mover_company: '', remarks: '', status: 'In Progress'
    });
    refetch();
  };
  
  const handleEditClick = (row: any) => {
    setEditingId(row.id);
    setEditForm(row);
    setShowEditModal(true);
  };
  
  const handleEditSubmit = async () => {
    if (editingId) {
      await update(editingId, {
        rig: editForm.rig,
        move_from: toStrOrNull(editForm.move_from),
        move_to: toStrOrNull(editForm.move_to),
        budget_days: toNumOrNull(String(editForm.budget_days)),
        actual_days: toNumOrNull(String(editForm.actual_days)),
        budget_cost: toNumOrNull(String(editForm.budget_cost)),
        actual_cost: toNumOrNull(String(editForm.actual_cost)),
        client_income: toNumOrNull(String(editForm.client_income)),
        distance_km: toStrOrNull(editForm.distance_km),
        mover_company: toStrOrNull(editForm.mover_company),
        start_date: toStrOrNull(editForm.start_date),
        end_date: toStrOrNull(editForm.end_date),
        status: toStrOrNull(editForm.status),
        remarks: toStrOrNull(editForm.remarks),
      });
      setShowEditModal(false);
      setEditingId(null);
      refetch();
    }
  };
  
  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (deletingId) {
      await remove(deletingId);
      setShowDeleteModal(false);
      setDeletingId(null);
      refetch();
    }
  };

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
            <button className="btn btn-t btn-xs" onClick={() => setShowAddModal(true)}>+ New Move</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FD l="Rig" v={addForm.rig} opts={RIGS.slice(0, 15)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAddForm({ ...addForm, rig: e.target.value })} />
          <FM l="Move From (Well/Location)" v={addForm.move_from} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, move_from: e.target.value })} />
          <FM l="Move To (Well/Location)" v={addForm.move_to} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, move_to: e.target.value })} />
          <FD l="Move Type" v={addForm.move_type} opts={['Intra-field', 'Inter-field', 'Pad to Pad']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAddForm({ ...addForm, move_type: e.target.value })} />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FM l="Start Date" v={addForm.start_date} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, start_date: e.target.value })} />
          <FM l="End Date" v={addForm.end_date} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, end_date: e.target.value })} />
          <FM l="Budget Days" v={addForm.budget_days} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, budget_days: e.target.value })} />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FM l="Actual Days" v={addForm.actual_days} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, actual_days: e.target.value })} />
          <FM l="Budget Cost ($)" v={addForm.budget_cost} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, budget_cost: e.target.value })} />
          <FM l="Actual Cost ($)" v={addForm.actual_cost} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, actual_cost: e.target.value })} />
          <FM l="Client Contract Income ($)" v={addForm.client_income} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, client_income: e.target.value })} />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FM l="Distance (km)" v={addForm.distance_km} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, distance_km: e.target.value })} />
          <FM l="Mover Company" v={addForm.mover_company} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, mover_company: e.target.value })} />
          <FD l="Status" v={addForm.status} opts={['In Progress', 'Completed', 'On Hold']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAddForm({ ...addForm, status: e.target.value })} />
        </div>

        <div className="p-4">
          <FM l="Move Remarks / Delays" v={addForm.remarks} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, remarks: e.target.value })} rows={3} />
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Rig Move History — 2025</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                {['Rig', 'From', 'To', 'Budget Days', 'Actual Days', 'Var', 'Budget Cost', 'Actual Cost', 'Revenue Impact', 'Status', 'Actions'].map(h => (
                  <th key={h} className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {moveData.map((r, i) => {
                const dayVar = (r.actual_days ?? 0) - (r.budget_days ?? 0);
                const costVar = (r.actual_cost ?? 0) - (r.budget_cost ?? 0);
                return (
                  <tr key={i}>
                    <td><strong>{r.rig}</strong></td>
                    <td style={{ fontSize: 13, color: '#64748B' }}>{r.move_from}</td>
                    <td style={{ fontSize: 13, color: '#64748B' }}>{r.move_to}</td>
                    <td className="tb-num">{r.budget_days ?? 0}d</td>
                    <td className="tb-num" style={{ fontWeight: 700 }}>{r.actual_days ?? 0}d</td>
                    <td className="tb-num" style={{ fontWeight: 800, color: dayVar > 0 ? '#DC2626' : '#16A34A' }}>{dayVar > 0 ? '+' : ''}{dayVar}d</td>
                    <td className="tb-num">${(r.budget_cost ?? 0).toLocaleString()}</td>
                    <td className="tb-num" style={{ fontWeight: 700 }}>${(r.actual_cost ?? 0).toLocaleString()}</td>
                    <td className="tb-num" style={{ fontWeight: 800, color: costVar > 0 ? '#DC2626' : '#16A34A' }}>{costVar > 0 ? '+' : ''}${Math.abs(costVar).toLocaleString()}</td>
                    <td><span className={'bdg ' + (r.status === 'Completed' ? 'g' : 't')}>{r.status}</span></td>
                    <td className="flex gap-2">
                      <button className="btn btn-t btn-xs" onClick={() => handleEditClick(r)}>Edit</button>
                      <button className="btn btn-d btn-xs" onClick={() => handleDeleteClick(r.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <span className="modal-title">Add New Rig Move</span>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <FD l="Rig" v={addForm.rig} opts={RIGS.slice(0, 15)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAddForm({ ...addForm, rig: e.target.value })} />
                <FD l="Move Type" v={addForm.move_type} opts={['Intra-field', 'Inter-field', 'Pad to Pad']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAddForm({ ...addForm, move_type: e.target.value })} />
                <FM l="Move From" v={addForm.move_from} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, move_from: e.target.value })} />
                <FM l="Move To" v={addForm.move_to} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, move_to: e.target.value })} />
                <FM l="Start Date" v={addForm.start_date} type="date" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, start_date: e.target.value })} />
                <FM l="End Date" v={addForm.end_date} type="date" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, end_date: e.target.value })} />
                <FM l="Budget Days" v={addForm.budget_days} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, budget_days: e.target.value })} />
                <FM l="Actual Days" v={addForm.actual_days} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, actual_days: e.target.value })} />
                <FM l="Budget Cost ($)" v={addForm.budget_cost} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, budget_cost: e.target.value })} />
                <FM l="Actual Cost ($)" v={addForm.actual_cost} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, actual_cost: e.target.value })} />
                <FM l="Client Income ($)" v={addForm.client_income} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, client_income: e.target.value })} />
                <FM l="Distance (km)" v={addForm.distance_km} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, distance_km: e.target.value })} />
                <FM l="Mover Company" v={addForm.mover_company} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, mover_company: e.target.value })} />
                <FD l="Status" v={addForm.status} opts={['In Progress', 'Completed', 'On Hold']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAddForm({ ...addForm, status: e.target.value })} />
              </div>
              <div className="mt-4">
                <FM l="Remarks" v={addForm.remarks} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddForm({ ...addForm, remarks: e.target.value })} rows={2} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-o" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-t" onClick={handleAddSubmit}>Save Move</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <span className="modal-title">Edit Rig Move</span>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <FD l="Rig" v={editForm.rig || ''} opts={RIGS.slice(0, 15)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditForm({ ...editForm, rig: e.target.value })} />
                <FD l="Move Type" v={editForm.move_type || 'Intra-field'} opts={['Intra-field', 'Inter-field', 'Pad to Pad']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditForm({ ...editForm, move_type: e.target.value })} />
                <FM l="Move From" v={editForm.move_from || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, move_from: e.target.value })} />
                <FM l="Move To" v={editForm.move_to || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, move_to: e.target.value })} />
                <FM l="Start Date" v={editForm.start_date || ''} type="date" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, start_date: e.target.value })} />
                <FM l="End Date" v={editForm.end_date || ''} type="date" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, end_date: e.target.value })} />
                <FM l="Budget Days" v={String(editForm.budget_days || '')} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, budget_days: e.target.value })} />
                <FM l="Actual Days" v={String(editForm.actual_days || '')} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, actual_days: e.target.value })} />
                <FM l="Budget Cost ($)" v={String(editForm.budget_cost || '')} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, budget_cost: e.target.value })} />
                <FM l="Actual Cost ($)" v={String(editForm.actual_cost || '')} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, actual_cost: e.target.value })} />
                <FM l="Client Income ($)" v={String(editForm.client_income || '')} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, client_income: e.target.value })} />
                <FM l="Distance (km)" v={editForm.distance_km || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, distance_km: e.target.value })} />
                <FM l="Mover Company" v={editForm.mover_company || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, mover_company: e.target.value })} />
                <FD l="Status" v={editForm.status || 'In Progress'} opts={['In Progress', 'Completed', 'On Hold']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditForm({ ...editForm, status: e.target.value })} />
              </div>
              <div className="mt-4">
                <FM l="Remarks" v={editForm.remarks || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditForm({ ...editForm, remarks: e.target.value })} rows={2} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-o" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn btn-t" onClick={handleEditSubmit}>Update Move</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <span className="modal-title">Confirm Delete</span>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="text-center text-gray-600">Are you sure you want to delete this rig move record? This action cannot be undone.</p>
            </div>
            <div className="modal-foot">
              <button className="btn btn-o" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-d" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
