'use client';
import React, { useRef, useEffect } from 'react';
import { NAV_OPS, NAV_ENTRY } from './Sidebar';

interface MobileSubNavProps {
  page: string;
  setPage: (p: string) => void;
}

/* Short labels for horizontal tabs — keep concise */
const OPS_TABS: { id: string; label: string }[] = [
  { id: 'viz-operations', label: 'Analytics' },
  { id: 'accruals', label: 'Accruals' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'welltrack', label: 'Wells' },
  { id: 'nptbill', label: 'NPT' },
  { id: 'util', label: 'Utilization' },
  { id: 'fuel', label: 'Fuel' },
  { id: 'rigmove', label: 'Rig Move' },
];

const ENTRY_TABS: { id: string; label: string }[] = [
  { id: 'ddor', label: 'DDOR' },
  { id: 'ahead', label: '72hr Plan' },
  { id: 'ytd', label: 'YTD / NPT' },
  { id: 'billing', label: 'Billing' },
  { id: 'crm', label: 'CRM' },
];

function getSection(page: string): { tabs: typeof OPS_TABS } | null {
  if (NAV_OPS.some(i => i.id === page)) return { tabs: OPS_TABS };
  if (NAV_ENTRY.some(i => i.id === page)) return { tabs: ENTRY_TABS };
  return null;
}

export function MobileSubNav({ page, setPage }: MobileSubNavProps) {
  const section = getSection(page);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const left = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }
  }, [page]);

  if (!section) return null;

  return (
    <div className="msubnav" role="tablist" aria-label="Section navigation" ref={scrollRef}>
      {section.tabs.map(tab => {
        const isActive = tab.id === page;
        return (
          <button
            key={tab.id}
            ref={isActive ? activeRef : null}
            className={'msubnav-tab' + (isActive ? ' active' : '')}
            onClick={() => setPage(tab.id)}
            aria-selected={isActive}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
