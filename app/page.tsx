'use client';
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { FleetDashboard } from '@/components/analytics/FleetDashboard';
import { FinancialViz } from '@/components/analytics/FinancialViz';
import { PerformanceViz } from '@/components/analytics/PerformanceViz';
import { OperationsViz } from '@/components/analytics/OperationsViz';
import { DDOR } from '@/components/entry/DDOR';
import { FuelTracking } from '@/components/entry/FuelTracking';
import { WellTracking } from '@/components/entry/WellTracking';
import './dashboard.css';

export default function DashboardApp() {
  const [page, setPage] = useState('home');
  const [col, setCol] = useState(false);

  const renderContent = () => {
    switch (page) {
      case 'home':
        return <FleetDashboard setPage={setPage} />;
      case 'viz-financial':
        return <FinancialViz />;
      case 'viz-performance':
        return <PerformanceViz />;
      case 'viz-operations':
        return <OperationsViz />;
      case 'ddor':
        return <DDOR />;
      case 'fuel':
        return <FuelTracking />;
      case 'welltrack':
        return <WellTracking />;
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            <h2 className="text-2xl font-bold mb-4">Data Entry View</h2>
            <p>The data entry form for {page} is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} col={col} setCol={setCol} />
      <div className="main">
        <Topbar page={page} />
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
