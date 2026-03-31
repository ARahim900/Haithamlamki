'use client';
import React, { useState, useEffect } from 'react';
import { NAV_OPS, NAV_ENTRY } from './Sidebar';

interface MobileNavProps {
  page: string;
  setPage: (p: string) => void;
  onLogout?: () => void;
}

/* ── "More" full-screen menu items ── */
const MORE_SECTIONS = [
  {
    label: 'Analytics',
    items: [
      { id: 'viz-financial', lbl: 'Financial Analytics', ico: '💰' },
      { id: 'viz-performance', lbl: 'Performance Analytics', ico: '📈' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'reports', lbl: 'Reports & Export', ico: '📥' },
      { id: 'settings', lbl: 'Settings', ico: '⚙️' },
    ],
  },
];

const MORE_PAGE_IDS = MORE_SECTIONS.flatMap(s => s.items.map(i => i.id));

/** Map page to active bottom tab */
function getActiveTab(page: string): string {
  if (page === 'home') return 'dashboard';
  if (NAV_OPS.some(i => i.id === page)) return 'ops';
  if (NAV_ENTRY.some(i => i.id === page)) return 'entry';
  if (MORE_PAGE_IDS.includes(page)) return 'more';
  return 'dashboard';
}

export function MobileNav({ page, setPage, onLogout }: MobileNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const activeTab = getActiveTab(page);

  // Close on Escape
  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [moreOpen]);

  // Lock body scroll when More is open
  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [moreOpen]);

  const navigateTo = (id: string) => {
    setPage(id);
    setMoreOpen(false);
  };

  return (
    <>
      {/* ── Full-screen More menu ── */}
      {moreOpen && (
        <div className="more-overlay" role="dialog" aria-label="More navigation">
          <div className="more-header">
            <span className="more-title">More</span>
            <button
              className="more-close"
              onClick={() => setMoreOpen(false)}
              aria-label="Close menu"
              type="button"
            >
              ✕
            </button>
          </div>
          <div className="more-body">
            {MORE_SECTIONS.map(section => (
              <div key={section.label} className="more-section">
                <div className="more-section-label">{section.label}</div>
                {section.items.map(item => (
                  <button
                    key={item.id}
                    className={'more-item' + (page === item.id ? ' active' : '')}
                    onClick={() => navigateTo(item.id)}
                    aria-current={page === item.id ? 'page' : undefined}
                    type="button"
                  >
                    <span className="more-item-icon" aria-hidden="true">{item.ico}</span>
                    <span className="more-item-label">{item.lbl}</span>
                    {page === item.id && <span className="more-item-check" aria-hidden="true">●</span>}
                  </button>
                ))}
              </div>
            ))}
            {onLogout && (
              <div className="more-section">
                <div className="more-divider" />
                <button
                  className="more-item more-item-danger"
                  onClick={() => { setMoreOpen(false); onLogout(); }}
                  type="button"
                >
                  <span className="more-item-icon" aria-hidden="true">🚪</span>
                  <span className="more-item-label">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Bottom tab bar — 4 tabs ── */}
      <nav className="mnav" aria-label="Mobile navigation" role="tablist">
        <button
          className={'mnav-tab' + (activeTab === 'dashboard' ? ' active' : '')}
          onClick={() => navigateTo('home')}
          aria-selected={activeTab === 'dashboard'}
          role="tab"
          type="button"
        >
          <span className="mnav-tab-icon" aria-hidden="true">📊</span>
          <span className="mnav-tab-label">Dashboard</span>
        </button>

        <button
          className={'mnav-tab' + (activeTab === 'ops' ? ' active' : '')}
          onClick={() => { if (activeTab !== 'ops') navigateTo('viz-operations'); }}
          aria-selected={activeTab === 'ops'}
          role="tab"
          type="button"
        >
          <span className="mnav-tab-icon" aria-hidden="true">⚙️</span>
          <span className="mnav-tab-label">Operations</span>
        </button>

        <button
          className={'mnav-tab' + (activeTab === 'entry' ? ' active' : '')}
          onClick={() => { if (activeTab !== 'entry') navigateTo('ddor'); }}
          aria-selected={activeTab === 'entry'}
          role="tab"
          type="button"
        >
          <span className="mnav-tab-icon" aria-hidden="true">📋</span>
          <span className="mnav-tab-label">Entry</span>
        </button>

        <button
          className={'mnav-tab' + (activeTab === 'more' ? ' active' : '')}
          onClick={() => setMoreOpen(o => !o)}
          aria-selected={activeTab === 'more'}
          aria-expanded={moreOpen}
          role="tab"
          type="button"
        >
          <span className="mnav-tab-icon" aria-hidden="true">☰</span>
          <span className="mnav-tab-label">More</span>
        </button>
      </nav>
    </>
  );
}
