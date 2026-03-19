'use client';
import React, { useState } from 'react';
import { FA, FD, FM, FieldLegend } from '@/components/Shared';
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
    budget_cost: '', actual_cost: '', revenue_income: '', remarks: '', status: 'In Progress'
  });
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    rig: '', move_from: '', move_to: '', move_type: 'Intra-field',
    start_date: '', end_date: '', budget_days: '', actual_days: '',
    budget_cost: '', actual_cost: '', revenue_income: '', remarks: '', status: 'In Progress'
  });
  
  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleAddSubmit = async () => {
    await insert(addForm);
    setShowAddModal(false);
    setAddForm({
      rig: '', move_from: '', move_to: '', move_type: 'Intra-field',
      start_date: '', end_date: '', budget_days: '', actual_days: '',
      budget_cost: '', actual_cost: '', revenue_income: '', remarks: '', status: 'In Progress'
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
      await update(editingId, editForm);
      setShowEditModal(false);
      setEditingId(null);
      refetch();
    }
  };
  
  const handleDeleteClick = (id: string) => {
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
          <FM l="Client Contract Income ($)" v={addForm.revenue_income} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddForm({ ...addForm, revenue_income: e.target.value })} />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}
