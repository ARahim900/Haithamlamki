'use client';
import React, { useState, useCallback, useRef } from 'react';
import { FD, FM, FieldLegend } from '@/components/Shared';
import { useLookAheadTasks } from '@/hooks/useDb';
import { RIGS } from '@/lib/data';

const HSE_CONTROLS = ['PTW', 'Isolation', 'JSA/SOP', 'Lift Plan', 'MOC', 'Out of Sight', 'Self-Verification', 'Fall Protection'];
const DEPT_OPTIONS = ['Drilling', 'Mechanical', 'Electrical', 'HSE', 'Logistics'];
const DAY_OPTIONS = ['Day 1', 'Day 2', 'Day 3', 'Day 1-2', 'Day 2-3', 'Day 1-3'];

export function LookAheadPlan() {
  const { data: tasksData, loading, error, refetch, insert, update, remove } = useLookAheadTasks();
  const [selectedRig, setSelectedRig] = useState('Rig 108');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [localInputs, setLocalInputs] = useState<Record<number, { task: string; sop_ref: string }>>({});

  // Guard against undefined data
  const safeTasksData = tasksData ?? [];
  const filteredTasks = safeTasksData.filter(t => t.rig === selectedRig);

  const toggleCheck = async (taskId: number, field: string, currentValue: boolean) => {
    try {
      await update(taskId, { [field]: !currentValue });
      await refetch();
    } catch (err) {
      console.error('Failed to toggle check:', err);
      alert('Failed to update. Please try again.');
    }
  };

  // Debounced update - persist on blur instead of every keystroke
  const updateTaskOnBlur = async (taskId: number, field: string, value: string) => {
    try {
      await update(taskId, { [field]: value });
      await refetch();
    } catch (err) {
      console.error('Failed to update task:', err);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleLocalChange = (taskId: number, field: 'task' | 'sop_ref', value: string) => {
    setLocalInputs(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], [field]: value }
    }));
  };

  const getLocalValue = (task: typeof filteredTasks[0], field: 'task' | 'sop_ref') => {
    return localInputs[task.id]?.[field] ?? (field === 'task' ? task.task : task.sop_ref || '');
  };

  const addTask = async () => {
    try {
      await insert({
        rig: selectedRig,
        well: null,
        report_date: new Date().toISOString().split('T')[0],
        dept: '',
        task: '',
        sop_ref: '',
        day_slot: 'Day 1',
        ptw: false,
        isolation: false,
        jsa_sop: false,
        lift_plan: false,
        moc: false,
        out_of_sight: false,
        self_verify: false,
        fall_protection: false,
      });
      await refetch();
    } catch (err) {
      console.error('Failed to add task:', err);
      alert('Failed to add task. Please try again.');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await remove(id);
      await refetch();
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading tasks...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">72-Hour Look-Ahead Plan</span>
            <span className="bdg t">Sheet 2</span>
            <FD v={selectedRig} opts={RIGS} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRig(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-o btn-xs">Save Draft</button>
            <button className="btn btn-g btn-xs">Submit to WSL</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FM l="Period Start" v={periodStart} type="date" ph="Select start date" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPeriodStart(e.target.value)} />
          <FM l="Period End" v={periodEnd} type="date" ph="Select end date" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPeriodEnd(e.target.value)} />
          <FD l="Status" v="Draft" opts={['Draft', 'Submitted', 'Approved']} />
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">
          HSE Task Planning
          <button onClick={addTask} className="btn btn-o btn-xs">+ Add Task</button>
        </div>
        <div className="tw" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th className="th" style={{ minWidth: 90 }}>Day</th>
                <th className="th" style={{ minWidth: 100 }}>Dept</th>
                <th className="th" style={{ minWidth: 250 }}>Task / Activity</th>
                <th className="th" style={{ minWidth: 120 }}>SOP Ref</th>
                {HSE_CONTROLS.map(c => (
                  <th key={c} className="th" style={{ minWidth: 50, textAlign: 'center', fontSize: 10 }}>{c}</th>
                ))}
                <th className="th" style={{ minWidth: 60 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(t => (
                <tr key={t.id}>
                  <td style={{ padding: '8px 10px' }}>
                    <select
                      className="f-dd"
                      style={{ padding: '6px 8px', fontSize: 12, minWidth: 70 }}
                      value={t.day_slot || 'Day 1'}
                      onChange={(e) => updateTaskOnBlur(t.id, 'day_slot', e.target.value)}
                    >
                      {DAY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <select
                      className="f-dd"
                      style={{ padding: '6px 8px', fontSize: 12, minWidth: 90 }}
                      value={t.dept || ''}
                      onChange={(e) => updateTaskOnBlur(t.id, 'dept', e.target.value)}
                    >
                      <option value="">— Select —</option>
                      {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <input
                      className="f-man"
                      style={{ padding: '6px 10px', fontSize: 13 }}
                      value={getLocalValue(t, 'task')}
                      onChange={(e) => handleLocalChange(t.id, 'task', e.target.value)}
                      onBlur={(e) => updateTaskOnBlur(t.id, 'task', e.target.value)}
                      placeholder="Enter task description..."
                    />
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <input
                      className="f-man"
                      style={{ padding: '6px 10px', fontSize: 12, fontFamily: 'monospace' }}
                      value={getLocalValue(t, 'sop_ref')}
                      onChange={(e) => handleLocalChange(t.id, 'sop_ref', e.target.value)}
                      onBlur={(e) => updateTaskOnBlur(t.id, 'sop_ref', e.target.value)}
                      placeholder="SOP-XXX-000"
                    />
                  </td>
                  {[
                    { field: 'ptw', val: t.ptw },
                    { field: 'isolation', val: t.isolation },
                    { field: 'jsa_sop', val: t.jsa_sop },
                    { field: 'lift_plan', val: t.lift_plan },
                    { field: 'moc', val: t.moc },
                    { field: 'out_of_sight', val: t.out_of_sight },
                    { field: 'self_verify', val: t.self_verify },
                    { field: 'fall_protection', val: t.fall_protection },
                  ].map(({ field, val }) => (
                    <td key={field} style={{ textAlign: 'center' }}>
                      <div
                        className={'hcb' + (val ? ' on' : '')}
                        role="checkbox"
                        tabIndex={0}
                        aria-checked={val}
                        onClick={() => toggleCheck(t.id, field, val)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            toggleCheck(t.id, field, val);
                          }
                        }}
                      >
                        {val ? '✓' : ''}
                      </div>
                    </td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn btn-d btn-xs" onClick={() => deleteTask(t.id)}>×</button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr><td colSpan={12} className="text-center text-gray-400 py-8">No tasks for this rig. Click &quot;+ Add Task&quot; to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Approval Chain</div>
        <div className="p-4 flex flex-col gap-3">
          <div className="appr">
            <span style={{ fontSize: 20 }}>⏳</span>
            <div><strong>Night Tool Pusher</strong> — Pending Review</div>
          </div>
          <div className="appr">
            <span style={{ fontSize: 20 }}>⏳</span>
            <div><strong>Rig Manager</strong> — Awaiting NTP Approval</div>
          </div>
          <div className="appr">
            <span style={{ fontSize: 20 }}>⏳</span>
            <div><strong>WSL (Client)</strong> — Awaiting RM Approval</div>
          </div>
        </div>
      </div>
    </div>
  );
}
