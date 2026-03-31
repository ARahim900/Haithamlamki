'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  NAV_OPS,
  NAV_ENTRY,
} from './Sidebar';

interface MobileNavProps {
  page: string;
  setPage: (p: string) => void;
  onLogout?: () => void;
}

/* ── Bottom bar: 5 primary items + More ── */

const BOTTOM_ITEMS: { id: string; label: string; icon: string; directNav?: string; sheetItems?: { id: string; lbl: string; ico: string }[] }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', directNav: 'home' },
  { id: 'rigops', label: 'Rig Ops', icon: '⚙️', sheetItems: NAV_OPS },
  { id: 'ddor', label: 'DDOR', icon: '📋', directNav: 'ddor' },
  {
    id: 'entry',
    label: 'Forms',
    icon: '📝',
    sheetItems: NAV_ENTRY.filter(i => i.id !== 'ddor'),
  },
  { id: 'reports', label: 'Reports', icon: '📥', directNav: 'reports' },
];

/* ── More drawer items ── */
const MORE_ITEMS: { id: string; lbl: string; ico: string }[] = [
  { id: 'viz-financial', lbl: 'Financial Analytics', ico: '💰' },
  { id: 'viz-performance', lbl: 'Performance Analytics', ico: '📈' },
  { id: 'viz-operations', lbl: 'Operations Analytics', ico: '⚙️' },
  { id: 'settings', lbl: 'Settings', ico: '⚙️' },
];

/** Map a page id to the active bottom-bar tab id */
function getActiveTab(page: string): string {
  if (page === 'home') return 'dashboard';
  if (NAV_OPS.some(i => i.id === page)) return 'rigops';
  if (page === 'ddor') return 'ddor';
  if (NAV_ENTRY.filter(i => i.id !== 'ddor').some(i => i.id === page)) return 'entry';
  if (page === 'reports') return 'reports';
  // Pages in the More drawer don't highlight any bottom tab
  if (MORE_ITEMS.some(i => i.id === page)) return 'more';
  return 'dashboard';
}

export function MobileNav({ page, setPage, onLogout }: MobileNavProps) {
  const [openSheet, setOpenSheet] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const activeTab = getActiveTab(page);

  // Close sheet on outside click
  useEffect(() => {
    if (!openSheet) return;
    const handler = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setOpenSheet(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openSheet]);

  // Close on Escape
  useEffect(() => {
    if (!openSheet) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSheet(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [openSheet]);

  const handleTabClick = (item: typeof BOTTOM_ITEMS[number]) => {
    if (item.directNav) {
      setPage(item.directNav);
      setOpenSheet(null);
      return;
    }
    // Toggle sheet for items with sub-navigation
    setOpenSheet(prev => prev === item.id ? null : item.id);
  };

  const handleMoreClick = () => {
    setOpenSheet(prev => prev === 'more' ? null : 'more');
  };

  const handleItemClick = (id: string) => {
    setPage(id);
    setOpenSheet(null);
  };

  // Determine which sheet items to show
  const sheetData = openSheet === 'more'
    ? { label: 'More', items: MORE_ITEMS }
    : BOTTOM_ITEMS.find(b => b.id === openSheet && b.sheetItems)
      ? { label: BOTTOM_ITEMS.find(b => b.id === openSheet)!.label, items: BOTTOM_ITEMS.find(b => b.id === openSheet)!.sheetItems! }
      : null;

  return (
    <>
      {/* Bottom sheet overlay */}
      {openSheet && sheetData && (
        <div className="mnav-backdrop" onClick={() => setOpenSheet(null)} aria-hidden="true" />
      )}

      {/* Bottom sheet with sub-items */}
      {openSheet && sheetData && (
        <div className="mnav-sheet" ref={sheetRef} role="dialog" aria-label={sheetData.label}>
          <div className="mnav-sheet-handle" aria-hidden="true" />
          <div className="mnav-sheet-title">{sheetData.label}</div>
          <div className="mnav-sheet-items">
            {sheetData.items.map(item => (
              <button
                key={item.id}
                className={'mnav-sheet-item' + (page === item.id ? ' active' : '')}
                onClick={() => handleItemClick(item.id)}
                aria-current={page === item.id ? 'page' : undefined}
                type="button"
              >
                <span className="mnav-sheet-item-icon" aria-hidden="true">{item.ico}</span>
                <span className="mnav-sheet-item-label">{item.lbl}</span>
                {page === item.id && <span className="mnav-sheet-item-check" aria-hidden="true">●</span>}
              </button>
            ))}
            {openSheet === 'more' && onLogout && (
              <>
                <div className="mnav-sheet-divider" />
                <button
                  className="mnav-sheet-item mnav-sheet-danger"
                  onClick={() => { setOpenSheet(null); onLogout(); }}
                  type="button"
                >
                  <span className="mnav-sheet-item-icon" aria-hidden="true">🚪</span>
                  <span className="mnav-sheet-item-label">Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom tab bar — 5 primary + More */}
      <nav className="mnav" aria-label="Mobile navigation" role="tablist">
        {BOTTOM_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={'mnav-tab' + (isActive ? ' active' : '')}
              onClick={() => handleTabClick(item)}
              aria-selected={isActive}
              role="tab"
              type="button"
            >
              <span className="mnav-tab-icon" aria-hidden="true">{item.icon}</span>
              <span className="mnav-tab-label">{item.label}</span>
              {isActive && <span className="mnav-tab-dot" aria-hidden="true" />}
            </button>
          );
        })}
        {/* More button */}
        <button
          className={'mnav-tab' + (activeTab === 'more' ? ' active' : '')}
          onClick={handleMoreClick}
          aria-selected={activeTab === 'more'}
          aria-expanded={openSheet === 'more'}
          role="tab"
          type="button"
        >
          <span className="mnav-tab-icon" aria-hidden="true">☰</span>
          <span className="mnav-tab-label">More</span>
          {activeTab === 'more' && <span className="mnav-tab-dot" aria-hidden="true" />}
        </button>
      </nav>
    </>
  );
}
