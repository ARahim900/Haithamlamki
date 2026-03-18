'use client';
import React from 'react';
import { FA, FD, FM, FieldLegend } from '@/components/Shared';

export function FuelTracking() {
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Fuel Tracking</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">Rig 201</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">12-Oct-2023</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-o btn-xs">Save Draft</button>
            <button className="btn btn-p btn-xs">Submit</button>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FA l="Opening Balance (Liters)" v="14,500" />
          <FM l="Fuel Received (Liters)" v="5,000" />
          <FM l="Fuel Consumed (Liters)" v="2,100" />
          <FA l="Closing Balance (Liters)" v="17,400" />
          <FD l="Supplier" v="Oman Oil" />
          <FM l="Delivery Note #" v="DN-88492" />
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Consumption Breakdown</div>
        <div className="p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                <th className="p-2 font-semibold">Equipment</th>
                <th className="p-2 font-semibold">Running Hours</th>
                <th className="p-2 font-semibold">Est. Consumption (L)</th>
                <th className="p-2 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-100">
                <td className="p-2">Main Generators (x3)</td>
                <td className="p-2"><FM v="24" /></td>
                <td className="p-2"><FM v="1,200" /></td>
                <td className="p-2"><FM v="Normal load" /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Mud Pumps (x2)</td>
                <td className="p-2"><FM v="18" /></td>
                <td className="p-2"><FM v="600" /></td>
                <td className="p-2"><FM v="Drilling 8.5'' section" /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Camp Generators</td>
                <td className="p-2"><FM v="24" /></td>
                <td className="p-2"><FM v="250" /></td>
                <td className="p-2"><FM v="" /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Vehicles / Heavy Eq.</td>
                <td className="p-2"><FM v="-" /></td>
                <td className="p-2"><FM v="50" /></td>
                <td className="p-2"><FM v="Forklift operations" /></td>
              </tr>
              <tr className="bg-gray-50 font-bold">
                <td className="p-2 text-right" colSpan={2}>Total Consumed:</td>
                <td className="p-2 text-blue-600"><FA v="2,100" /></td>
                <td className="p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
