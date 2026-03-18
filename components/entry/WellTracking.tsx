'use client';
import React from 'react';
import { FA, FD, FM, FieldLegend } from '@/components/Shared';

export function WellTracking() {
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Well Tracking Entry</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">Rig 302</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Well: Yibal-201</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-o btn-xs">Save Draft</button>
            <button className="btn btn-p btn-xs">Update Well Status</button>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FM l="Well Name" v="Yibal-201" />
          <FD l="Well Type" v="Development" />
          <FD l="Current Phase" v="Drilling 8.5''" />
          <FM l="Target Depth (ft)" v="14,500" />
          <FM l="Current Depth (ft)" v="11,200" />
          <FA l="Progress (%)" v="77.2%" />
          <FM l="Spud Date" v="25-Sep-2023" />
          <FA l="Days on Well" v="18" />
          <FM l="AFE Budget ($)" v="1,200,000" />
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Section Progress</div>
        <div className="p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                <th className="p-2 font-semibold">Hole Size</th>
                <th className="p-2 font-semibold">Casing Size</th>
                <th className="p-2 font-semibold">Planned Depth (ft)</th>
                <th className="p-2 font-semibold">Actual Depth (ft)</th>
                <th className="p-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-100">
                <td className="p-2">24&quot;</td>
                <td className="p-2">20&quot;</td>
                <td className="p-2">1,500</td>
                <td className="p-2"><FM v="1,520" /></td>
                <td className="p-2"><span className="text-green-600 font-bold">Completed</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">16&quot;</td>
                <td className="p-2">13 3/8&quot;</td>
                <td className="p-2">4,500</td>
                <td className="p-2"><FM v="4,550" /></td>
                <td className="p-2"><span className="text-green-600 font-bold">Completed</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">12 1/4&quot;</td>
                <td className="p-2">9 5/8&quot;</td>
                <td className="p-2">10,000</td>
                <td className="p-2"><FM v="10,100" /></td>
                <td className="p-2"><span className="text-green-600 font-bold">Completed</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">8 1/2&quot;</td>
                <td className="p-2">7&quot;</td>
                <td className="p-2">14,500</td>
                <td className="p-2"><FM v="11,200" /></td>
                <td className="p-2"><span className="text-blue-600 font-bold">In Progress</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
