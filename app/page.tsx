'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/Sidebar';
import { Topbar, CRUMBS } from '@/components/Topbar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './dashboard.css';

/* ── Code-split all views — only the active view is loaded ── */
const FleetDashboard = dynamic(() => import('@/components/analytics/FleetDashboard').then(m => ({ default: m.FleetDashboard })), { loading: () => <ViewSkeleton /> });
const FinancialViz = dynamic(() => import('@/components/analytics/FinancialViz').then(m => ({ default: m.FinancialViz })), { loading: () => <ViewSkeleton /> });
const PerformanceViz = dynamic(() => import('@/components/analytics/PerformanceViz').then(m => ({ default: m.PerformanceViz })), { loading: () => <ViewSkeleton /> });
const OperationsViz = dynamic(() => import('@/components/analytics/OperationsViz').then(m => ({ default: m.OperationsViz })), { loading: () => <ViewSkeleton /> });
const DDOR = dynamic(() => import('@/components/entry/DDOR').then(m => ({ default: m.DDOR })), { loading: () => <ViewSkeleton /> });
const FuelTracking = dynamic(() => import('@/components/entry/FuelTracking').then(m => ({ default: m.FuelTracking })), { loading: () => <ViewSkeleton /> });
const WellTracking = dynamic(() => import('@/components/entry/WellTracking').then(m => ({ default: m.WellTracking })), { loading: () => <ViewSkeleton /> });
const RigMove = dynamic(() => import('@/components/entry/RigMove').then(m => ({ default: m.RigMove })), { loading: () => <ViewSkeleton /> });
const LookAheadPlan = dynamic(() => import('@/components/entry/LookAheadPlan').then(m => ({ default: m.LookAheadPlan })), { loading: () => <ViewSkeleton /> });
const BillingTicket = dynamic(() => import('@/components/entry/BillingTicket').then(m => ({ default: m.BillingTicket })), { loading: () => <ViewSkeleton /> });
const YTDDetails = dynamic(() => import('@/components/entry/YTDDetails').then(m => ({ default: m.YTDDetails })), { loading: () => <ViewSkeleton /> });
const Utilization = dynamic(() => import('@/components/entry/Utilization').then(m => ({ default: m.Utilization })), { loading: () => <ViewSkeleton /> });
const NPTBilling = dynamic(() => import('@/components/entry/NPTBilling').then(m => ({ default: m.NPTBilling })), { loading: () => <ViewSkeleton /> });
const Revenue = dynamic(() => import('@/components/entry/Revenue').then(m => ({ default: m.Revenue })), { loading: () => <ViewSkeleton /> });
const CRM = dynamic(() => import('@/components/entry/CRM').then(m => ({ default: m.CRM })), { loading: () => <ViewSkeleton /> });
const BillingAccruals = dynamic(() => import('@/components/entry/BillingAccruals').then(m => ({ default: m.BillingAccruals })), { loading: () => <ViewSkeleton /> });

function ViewSkeleton() {
  return (
    <div className="view-skeleton" aria-busy="true" aria-label="Loading view">
      <div className="skel-row">
        <div className="skel-box skel-kpi" /><div className="skel-box skel-kpi" />
        <div className="skel-box skel-kpi" /><div className="skel-box skel-kpi" />
      </div>
      <div className="skel-row">
        <div className="skel-box skel-card" /><div className="skel-box skel-card" />
      </div>
    </div>
  );
}

export default function DashboardApp() {
  const [page, setPage] = useState('home');
  const [col, setCol] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const handler = (e: MediaQueryListEvent) => setCol(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const pageTitle = CRUMBS[page]?.[1] || 'Dashboard';

  const renderContent = () => {
    switch (page) {
      case 'home': return <FleetDashboard setPage={setPage} />;
      case 'viz-financial': return <FinancialViz />;
      case 'viz-performance': return <PerformanceViz />;
      case 'viz-operations': return <OperationsViz />;
      case 'ddor': return <DDOR />;
      case 'fuel': return <FuelTracking />;
      case 'welltrack': return <WellTracking />;
      case 'rigmove': return <RigMove />;
      case 'ahead': return <LookAheadPlan />;
      case 'billing': return <BillingTicket />;
      case 'ytd': return <YTDDetails />;
      case 'util': return <Utilization />;
      case 'nptbill': return <NPTBilling />;
      case 'revenue': return <Revenue />;
      case 'crm': return <CRM />;
      case 'accruals': return <BillingAccruals />;
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
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Sidebar page={page} setPage={setPage} col={col} setCol={setCol} />
      <div className="main">
        <Topbar page={page} col={col} setCol={setCol} />
        <main id="main-content" className="content" role="main" aria-label={pageTitle}>
          <h1 className="sr-only">{pageTitle}</h1>
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
