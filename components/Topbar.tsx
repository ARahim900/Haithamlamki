'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export const CRUMBS: Record<string, string[]>={
  home:["Analytics","Fleet Dashboard"],
  "viz-financial":["Analytics","Financial"],
  "viz-performance":["Analytics","Performance"],
  "viz-operations":["Analytics","Operations"],
  ddor:["Data Entry","DDOR (Sheet 3)"],
  ahead:["Data Entry","72hr Ahead Plan (Sheet 2)"],
  ytd:["Data Entry","YTD / NPT (Sheet 5)"],
  billing:["Data Entry","Billing Ticket (Sheet 4)"],
  fuel:["Data Entry","Fuel Tracking (Sheet 9)"],
  crm:["Data Entry","Customer Satisfaction (Sheet 11)"],
  rigmove:["Data Entry","Rig Move (Sheet 1)"],
  accruals:["Data Entry","Billing Accruals (Sheet 12)"],
  revenue:["Data Entry","Revenue (Sheet 10)"],
  welltrack:["Data Entry","Well Tracking (Sheet 7)"],
  nptbill:["Data Entry","NPT Billing (Sheet 8)"],
  util:["Data Entry","Utilization (Sheet 6)"],
  settings:["System","Settings"],
  reports:["System","Reports & Export"],
};

interface TopbarProps {
  page: string;
  col?: boolean;
  setCol: React.Dispatch<React.SetStateAction<boolean>>;
  userInitials?: string;
  userEmail?: string;
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
  isMobile?: boolean;
}

export function Topbar({page,col,setCol,userInitials,userEmail,onLogout,onNavigate,isMobile}: TopbarProps){
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [par,cur]=CRUMBS[page]||["","Dashboard"];
  const isEntry=par==="Data Entry";

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Mobile topbar — cleaner, app-like
  if (isMobile) {
    return (
      <header className="topbar topbar-mobile" role="banner">
        <div className="tb-left">
          <Image src="/abraj-logo.jpeg" alt="Abraj" className="tb-mobile-logo" width={28} height={28} />
          <span className="bc-cur" aria-current="page">{cur}</span>
          {isEntry&&<span className="tb-tag">Entry</span>}
        </div>
        <div className="tb-right" aria-label="Status indicators">
          <button
            className="tb-btn"
            onClick={() => {
              const html = document.documentElement;
              html.classList.toggle('dark');
              localStorage.setItem('abraj-theme', html.classList.contains('dark') ? 'dark' : 'light');
            }}
            aria-label="Toggle Dark Mode"
            title="Toggle Dark Mode"
            type="button"
          >
            🌓
          </button>
          <span className="tb-badge tb-badge-live" aria-label="System is live">● Live</span>
          <div className="tb-user-menu" ref={menuRef}>
            <button
              className="tb-avatar"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={`User menu${userEmail ? ': ' + userEmail : ''}`}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              type="button"
            >
              {userInitials || 'U'}
            </button>
            {menuOpen && (
              <div className="tb-dropdown" role="menu">
                {userEmail && (
                  <div className="tb-dropdown-header" role="none">
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{userInitials}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
                  </div>
                )}
                <button
                  className="tb-dropdown-item"
                  onClick={() => { setMenuOpen(false); onNavigate?.('settings'); }}
                  role="menuitem"
                  type="button"
                >
                  <span aria-hidden="true">⚙️</span> Settings
                </button>
                <button
                  className="tb-dropdown-item"
                  onClick={() => { setMenuOpen(false); onNavigate?.('reports'); }}
                  role="menuitem"
                  type="button"
                >
                  <span aria-hidden="true">📥</span> Reports
                </button>
                <div className="tb-dropdown-divider" role="separator" />
                <button
                  className="tb-dropdown-item tb-dropdown-danger"
                  onClick={() => { setMenuOpen(false); onLogout?.(); }}
                  role="menuitem"
                  type="button"
                >
                  <span aria-hidden="true">🚪</span> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="topbar" role="banner">
      <div className="tb-left">
        <button className="mobile-menu" onClick={()=>setCol(c=>!c)} aria-label="Toggle menu" aria-expanded={!col} type="button">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="5" x2="15" y2="5"/><line x1="3" y1="9" x2="15" y2="9"/><line x1="3" y1="13" x2="15" y2="13"/></svg>
        </button>
        <nav aria-label="Breadcrumb">
          <span className="bc-par">{par}</span>
          <span className="bc-sep" aria-hidden="true"> / </span>
          <span className="bc-cur" aria-current="page">{cur}</span>
        </nav>
        {isEntry&&<span className="tb-tag">Entry</span>}
      </div>
      <div className="tb-right" aria-label="Status indicators">
        <button
          className="tb-btn"
          onClick={() => document.documentElement.classList.toggle('dark')}
          aria-label="Toggle Dark Mode"
          title="Toggle Dark Mode"
          type="button"
        >
          🌓
        </button>
        <span className="tb-badge">PDO</span>
        <span className="tb-badge tb-badge-live" aria-label="System is live">● Live</span>
        <div className="tb-user-menu" ref={menuRef}>
          <button
            className="tb-avatar"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={`User menu${userEmail ? ': ' + userEmail : ''}`}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            type="button"
          >
            {userInitials || 'U'}
          </button>
          {menuOpen && (
            <div className="tb-dropdown" role="menu">
              {userEmail && (
                <div className="tb-dropdown-header" role="none">
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{userInitials}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
                </div>
              )}
              <button
                className="tb-dropdown-item"
                onClick={() => { setMenuOpen(false); onNavigate?.('settings'); }}
                role="menuitem"
                type="button"
              >
                <span aria-hidden="true">⚙️</span> Settings
              </button>
              <button
                className="tb-dropdown-item"
                onClick={() => { setMenuOpen(false); onNavigate?.('reports'); }}
                role="menuitem"
                type="button"
              >
                <span aria-hidden="true">📥</span> Reports
              </button>
              <div className="tb-dropdown-divider" role="separator" />
              <button
                className="tb-dropdown-item tb-dropdown-danger"
                onClick={() => { setMenuOpen(false); onLogout?.(); }}
                role="menuitem"
                type="button"
              >
                <span aria-hidden="true">🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
