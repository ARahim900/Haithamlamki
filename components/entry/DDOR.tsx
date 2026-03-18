'use client';
import React, { useState } from 'react';
import { FA, FD, FM, FDr, FieldLegend } from '@/components/Shared';
import { Trash2 } from 'lucide-react';

export function DDOR() {
  const [tab, setTab] = useState('ops');
  const [opsRows, setOpsRows] = useState([
    { id: 1, from: '00:00', to: '06:00', hrs: '6.0', code: 'DRL', desc: "Drill 8.5'' hole from 12,000ft to 12,200ft" },
    { id: 2, from: '06:00', to: '06:30', hrs: '0.5', code: 'SRV', desc: "Rig service, check top drive" },
    { id: 3, from: '06:30', to: '24:00', hrs: '17.5', code: 'DRL', desc: "Drill 8.5'' hole from 12,200ft to 12,450ft" }
  ]);

  const addRow = () => {
    setOpsRows([...opsRows, { id: Date.now(), from: '', to: '', hrs: '', code: '', desc: '' }]);
  };

  const removeRow = (id: number) => {
    setOpsRows(opsRows.filter(r => r.id !== id));
  };

  const updateRow = (id: number, field: string, value: string) => {
    setOpsRows(opsRows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const [nptRows, setNptRows] = useState([
    { id: 1, from: '06:00', to: '06:30', hrs: '0.5', category: 'Rig Repair', desc: 'Top drive maintenance' }
  ]);

  const addNptRow = () => {
    setNptRows([...nptRows, { id: Date.now(), from: '', to: '', hrs: '', category: '', desc: '' }]);
  };

  const removeNptRow = (id: number) => {
    setNptRows(nptRows.filter(r => r.id !== id));
  };

  const updateNptRow = (id: number, field: string, value: string) => {
    setNptRows(nptRows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Daily Drilling Operations Report (DDOR)</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">Rig 108</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">12-Oct-2023</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-o btn-xs">Save Draft</button>
            <button className="btn btn-p btn-xs">Submit for Approval</button>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FD l="Rig Status" v="Drilling" />
          <FM l="Current Depth (ft)" v="12,450" />
          <FA l="Days on Well" v="14" />
          <FDr l="Tool Pusher Notes" v="Normal drilling operations. Mud weight stable." />
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex p-1 space-x-1 bg-gray-200/60 rounded-lg w-fit">
            <button className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${tab === 'ops' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/80'}`} onClick={() => setTab('ops')}>24hr Operations</button>
            <button className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${tab === 'mud' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/80'}`} onClick={() => setTab('mud')}>Mud & Pumps</button>
            <button className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${tab === 'npt' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/80'}`} onClick={() => setTab('npt')}>NPT Events</button>
          </div>
        </div>
        
        <div className="p-4">
          {tab === 'ops' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                    <th className="p-2 font-semibold">From</th>
                    <th className="p-2 font-semibold">To</th>
                    <th className="p-2 font-semibold">Hrs</th>
                    <th className="p-2 font-semibold">Code</th>
                    <th className="p-2 font-semibold">Description</th>
                    <th className="p-2 font-semibold w-10"></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {opsRows.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100">
                      <td className="p-2"><FM v={row.from} onChange={(e) => updateRow(row.id, 'from', e.target.value)} /></td>
                      <td className="p-2"><FM v={row.to} onChange={(e) => updateRow(row.id, 'to', e.target.value)} /></td>
                      <td className="p-2"><FA v={row.hrs} /></td>
                      <td className="p-2"><FD v={row.code} opts={['DRL', 'SRV', 'NPT', 'WFT', 'CMT']} onChange={(e) => updateRow(row.id, 'code', e.target.value)} /></td>
                      <td className="p-2"><FM v={row.desc} onChange={(e) => updateRow(row.id, 'desc', e.target.value)} /></td>
                      <td className="p-2 text-center">
                        <button onClick={() => removeRow(row.id)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addRow} className="mt-4 btn btn-o btn-xs">+ Add Row</button>
            </div>
          )}
          
          {tab === 'mud' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Mud Properties
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FM l="Mud Weight (ppg)" v="10.2" />
                  <FM l="Viscosity (sec/qt)" v="45" />
                  <FM l="Plastic Viscosity (cP)" v="15" />
                  <FM l="Yield Point (lb/100ft2)" v="12" />
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Pump Parameters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FM l="Pump Pressure (psi)" v="2800" />
                  <FM l="Flow Rate (gpm)" v="450" />
                  <FA l="Total Strokes" v="125,000" />
                  <FM l="Liner Size (in)" v="6.5" />
                </div>
              </div>
            </div>
          )}
          
          {tab === 'npt' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                    <th className="p-2 font-semibold">From</th>
                    <th className="p-2 font-semibold">To</th>
                    <th className="p-2 font-semibold">Hrs</th>
                    <th className="p-2 font-semibold">Category</th>
                    <th className="p-2 font-semibold">Description</th>
                    <th className="p-2 font-semibold w-10"></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {nptRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500 bg-gray-50/50 rounded-b-lg">
                        No Non-Productive Time recorded for this period.
                      </td>
                    </tr>
                  ) : (
                    nptRows.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100">
                        <td className="p-2"><FM v={row.from} onChange={(e) => updateNptRow(row.id, 'from', e.target.value)} /></td>
                        <td className="p-2"><FM v={row.to} onChange={(e) => updateNptRow(row.id, 'to', e.target.value)} /></td>
                        <td className="p-2"><FA v={row.hrs} /></td>
                        <td className="p-2"><FD v={row.category} opts={['Rig Repair', 'Wait on Weather', 'Wait on Orders', 'Equipment Failure', 'Well Control']} onChange={(e) => updateNptRow(row.id, 'category', e.target.value)} /></td>
                        <td className="p-2"><FM v={row.desc} onChange={(e) => updateNptRow(row.id, 'desc', e.target.value)} /></td>
                        <td className="p-2 text-center">
                          <button onClick={() => removeNptRow(row.id)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <button onClick={addNptRow} className="mt-4 btn btn-o btn-xs">+ Add NPT Event</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
