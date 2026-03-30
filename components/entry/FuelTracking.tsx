'use client';
import React, { useState } from 'react';
import { FA, FD, FM, FieldLegend } from '@/components/Shared';
import { useFuelConsumption } from '@/hooks/useDb';
import { RIGS, MONTHS } from '@/lib/data';

export function FuelTracking() {
  const { data: fuelData, loading, error, refetch, insert, update } = useFuelConsumption();
  const [selectedRig, setSelectedRig] = useState('Rig 201');
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2025');

  // Find current record for selected rig/month/year
  const currentRecord = fuelData.find(
    r => r.rig === selectedRig && r.month === selectedMonth && r.year === Number(selectedYear)
  );

  const [form, setForm] = useState({
    opening_stock: currentRecord?.opening_stock ?? 14500,
    received: currentRecord?.received ?? 5000,
    rig_engine: currentRecord?.rig_engine ?? 1200,
    camp_engine: currentRecord?.camp_engine ?? 250,
    vehicles: currentRecord?.vehicles ?? 50,
    other_site: currentRecord?.other_site ?? 0,
    invoice_client: currentRecord?.invoice_client ?? 0,
  });

  // Update form when record changes - use stable primitive dependency
  React.useEffect(() => {
    if (currentRecord) {
      setForm({
        opening_stock: currentRecord.opening_stock ?? 0,
        received: currentRecord.received ?? 0,
        rig_engine: currentRecord.rig_engine ?? 0,
        camp_engine: currentRecord.camp_engine ?? 0,
        vehicles: currentRecord.vehicles ?? 0,
        other_site: currentRecord.other_site ?? 0,
        invoice_client: currentRecord.invoice_client ?? 0,
      });
    } else {
      setForm({
        opening_stock: 0,
        received: 0,
        rig_engine: 0,
        camp_engine: 0,
        vehicles: 0,
        other_site: 0,
        invoice_client: 0,
      });
    }
  }, [currentRecord, selectedRig, selectedMonth, selectedYear]);

  const totalConsumed = (form.rig_engine ?? 0) + (form.camp_engine ?? 0) + (form.vehicles ?? 0) + (form.other_site ?? 0);
  const closingBalance = (form.opening_stock ?? 0) + (form.received ?? 0) - totalConsumed;

  const handleSave = async () => {
    try {
      const payload = {
        rig: selectedRig,
        year: Number(selectedYear),
        month: selectedMonth,
        opening_stock: form.opening_stock,
        received: form.received,
        rig_engine: form.rig_engine,
        camp_engine: form.camp_engine,
        vehicles: form.vehicles,
        other_site: form.other_site,
        invoice_client: form.invoice_client,
        total_consumed: totalConsumed,
        closing_balance: closingBalance,
        po1: null,
        po2: null,
        po3: null,
      };

      if (currentRecord) {
        await update(currentRecord.id, payload);
      } else {
        await insert(payload);
      }
      await refetch();
    } catch (err) {
      console.error('Failed to save fuel data:', err);
      alert('Failed to save fuel tracking data. Please try again.');
    }
  };

  // TODO: Implement draft saving functionality
  const handleSaveDraft = () => {
    alert('Draft saving coming soon');
  };

  if (loading) return <div className="p-8 text-center">Loading fuel data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Fuel Tracking</span>
            <FD v={selectedRig} opts={RIGS} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRig(e.target.value)} />
            <FD v={selectedMonth} opts={MONTHS} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMonth(e.target.value)} />
            <FD v={selectedYear} opts={['2024', '2025']} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-o btn-xs" onClick={handleSaveDraft}>Save Draft</button>
            <button className="btn btn-p btn-xs" onClick={handleSave}>Submit</button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <FieldLegend />
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FM l="Opening Balance (Liters)" v={String(form.opening_stock)} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, opening_stock: Number(e.target.value) })} />
          <FM l="Fuel Received (Liters)" v={String(form.received)} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, received: Number(e.target.value) })} />
          <FA l="Total Consumed (Liters)" v={totalConsumed.toLocaleString()} />
          <FA l="Closing Balance (Liters)" v={closingBalance.toLocaleString()} />
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Consumption Breakdown</div>
        <div className="p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                <th scope="col" className="p-2 font-semibold">Equipment</th>
                <th scope="col" className="p-2 font-semibold">Consumption (L)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-100">
                <td className="p-2">Rig Engines / Generators</td>
                <td className="p-2">
                  <FM v={String(form.rig_engine)} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, rig_engine: Number(e.target.value) })} />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Camp Generators</td>
                <td className="p-2">
                  <FM v={String(form.camp_engine)} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, camp_engine: Number(e.target.value) })} />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Vehicles / Heavy Eq.</td>
                <td className="p-2">
                  <FM v={String(form.vehicles)} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, vehicles: Number(e.target.value) })} />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Other Sites</td>
                <td className="p-2">
                  <FM v={String(form.other_site)} type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, other_site: Number(e.target.value) })} />
                </td>
              </tr>
              <tr className="bg-gray-50 font-bold">
                <td className="p-2 text-right">Total Consumed:</td>
                <td className="p-2 text-blue-600">{totalConsumed.toLocaleString()} L</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* History Table */}
      <div className="card">
        <div className="card-hdr">Fuel History</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                {['Rig', 'Month', 'Year', 'Opening', 'Received', 'Consumed', 'Closing'].map(h => (
                  <th key={h} scope="col" className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fuelData.slice(0, 10).map((r, i) => (
                <tr key={i}>
                  <td><strong>{r.rig}</strong></td>
                  <td>{r.month}</td>
                  <td>{r.year}</td>
                  <td className="tb-num">{(r.opening_stock ?? 0).toLocaleString()}L</td>
                  <td className="tb-num">{(r.received ?? 0).toLocaleString()}L</td>
                  <td className="tb-num" style={{ color: 'var(--color-negative)' }}>{(r.total_consumed ?? 0).toLocaleString()}L</td>
                  <td className="tb-num" style={{ fontWeight: 700, color: 'var(--color-positive)' }}>{(r.closing_balance ?? 0).toLocaleString()}L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
