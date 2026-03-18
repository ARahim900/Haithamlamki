'use client';
import React, { useState } from 'react';
import { FD, FM, FieldLegend } from '@/components/Shared';

const HSE_CONTROLS = ['PTW', 'Isolation', 'JSA/SOP', 'Lift Plan', 'MOC', 'Out of Sight', 'Self-Verification', 'Fall Protection'];

const DEPT_OPTIONS = ['Drilling', 'Mechanical', 'Electrical', 'HSE', 'Logistics'];
const DAY_OPTIONS = ['Day 1', 'Day 2', 'Day 3', 'Day 1-2', 'Day 2-3', 'Day 1-3'];

const initialTasks = [
  { id: 1, dept: 'Drilling', task: 'Run 9-5/8" casing to 10,100ft', sop: 'SOP-DRL-042', day: 'Day 1', checks: [true, false, true, false, false, false, true, false] },
  { id: 2, dept: 'Drilling', task: 'Cement 9-5/8" casing — 2-stage', sop: 'SOP-DRL-055', day: 'Day 1', checks: [true, true, true, false, false, false, true, false] },
  { id: 3, dept: 'Mechanical', task: 'Top drive PM — 500hr service', sop: 'SOP-MNT-018', day: 'Day 2', checks: [true, true, true, false, true, false, true, false] },
  { id: 4, dept: 'Electrical', task: 'SCR panel inspection and thermal scan', sop: 'SOP-ELE-009', day: 'Day 2', checks: [true, true, true, false, false, false, true, false] },
  { id: 5, dept: 'Drilling', task: 'Drill 8-1/2" hole section to 14,500ft', sop: 'SOP-DRL-033', day: 'Day 2-3', checks: [true, false, true, false, false, false, true, true] },
  { id: 6, dept: 'Mechanical', task: 'Crane load test and certification', sop: 'SOP-MNT-025', day: 'Day 3', checks: [true, true, true, true, true, false, true, true] },
];

export function LookAheadPlan() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleCheck = (taskId: number, checkIdx: number) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, checks: t.checks.map((c, i) => i === checkIdx ? !c : c) } : t
    ));
  };

  const updateTask = (taskId: number, field: string, value: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t));
  };

  const addTask = () => {
    setTasks([...tasks, {
      id: Date.now(), dept: '', task: '', sop: '', day: 'Day 1',
      checks: new Array(HSE_CONTROLS.length).fill(false)
    }]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">72-Hour Look-Ahead Plan</span>
            <span className="bdg t">Sheet 2</span>
            <span className="bdg gr">Rig 108</span>
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
          <FD l="Rig" v="Rig 108" />
          <FM l="Period Start" v="15-Jun-2025" />
          <FM l="Period End" v="17-Jun-2025" />
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
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.id}>
                  <td style={{ padding: '8px 10px' }}>
                    <select
                      className="f-dd"
                      style={{ padding: '6px 8px', fontSize: 12, minWidth: 70 }}
                      value={t.day}
                      onChange={(e) => updateTask(t.id, 'day', e.target.value)}
                    >
                      {DAY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <select
                      className="f-dd"
                      style={{ padding: '6px 8px', fontSize: 12, minWidth: 90 }}
                      value={t.dept}
                      onChange={(e) => updateTask(t.id, 'dept', e.target.value)}
                    >
                      <option value="">— Select —</option>
                      {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <input
                      className="f-man"
                      style={{ padding: '6px 10px', fontSize: 13 }}
                      value={t.task}
                      onChange={(e) => updateTask(t.id, 'task', e.target.value)}
                      placeholder="Enter task description..."
                    />
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <input
                      className="f-man"
                      style={{ padding: '6px 10px', fontSize: 12, fontFamily: 'monospace' }}
                      value={t.sop}
                      onChange={(e) => updateTask(t.id, 'sop', e.target.value)}
                      placeholder="SOP-XXX-000"
                    />
                  </td>
                  {t.checks.map((checked, ci) => (
                    <td key={ci} style={{ textAlign: 'center' }}>
                      <div
                        className={'hcb' + (checked ? ' on' : '')}
                        role="checkbox"
                        tabIndex={0}
                        aria-checked={checked}
                        onClick={() => toggleCheck(t.id, ci)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            toggleCheck(t.id, ci);
                          }
                        }}
                      >
                        {checked ? '✓' : ''}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Approval Chain</div>
        <div className="p-4 flex flex-col gap-3">
          <div className="appr done">
            <span style={{ fontSize: 20 }}>✓</span>
            <div><strong>Night Tool Pusher</strong> — Reviewed & Approved<span style={{ marginLeft: 8, fontSize: 12, color: '#64748B' }}>14-Jun-2025 22:00</span></div>
          </div>
          <div className="appr">
            <span style={{ fontSize: 20 }}>⏳</span>
            <div><strong>Rig Manager</strong> — Pending Review</div>
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
