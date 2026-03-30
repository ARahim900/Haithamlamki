'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

export const NAV_ANALYTICS=[
  {id:"home",lbl:"Fleet Dashboard",ico:"📊"},
  {id:"viz-financial",lbl:"Financial Analytics",ico:"💰"},
  {id:"viz-performance",lbl:"Performance Analytics",ico:"📈"},
];
export const NAV_OPS=[
  {id:"viz-operations",lbl:"Operations Analytics",ico:"⚙️"},
  {id:"accruals",lbl:"Billing Accruals",ico:"📑"},
  {id:"revenue",lbl:"Revenue",ico:"💵"},
  {id:"welltrack",lbl:"Well Tracking",ico:"🎯"},
  {id:"nptbill",lbl:"NPT Billing",ico:"🔴"},
  {id:"util",lbl:"Utilization",ico:"🟢"},
  {id:"fuel",lbl:"Fuel Tracking",ico:"⛽"},
  {id:"rigmove",lbl:"Rig Move",ico:"🚚"},
];
export const NAV_ENTRY=[
  {id:"ddor",lbl:"DDOR Entry",ico:"📋"},
  {id:"ahead",lbl:"72hr Ahead Plan",ico:"📅"},
  {id:"ytd",lbl:"YTD / NPT Details",ico:"⚠️"},
  {id:"billing",lbl:"Billing Ticket",ico:"🧾"},
  {id:"crm",lbl:"Customer Satisfaction",ico:"⭐"},
];
export const NAV_SYSTEM=[
  {id:"reports",lbl:"Reports & Export",ico:"📥"},
  {id:"settings",lbl:"Settings",ico:"⚙️"},
];

type Section = 'analytics' | 'ops' | 'entry' | 'system' | null;

function handleKeyActivate(e: React.KeyboardEvent, action: () => void) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    action();
  }
}

export function Sidebar({page,setPage,col,setCol}: {page: string, setPage: (p: string) => void, col: boolean, setCol: React.Dispatch<React.SetStateAction<boolean>>}){
  const [openSection, setOpenSection] = useState<Section>('analytics');

  const toggleSection = (section: Section) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const navigate = useCallback((id: string) => {
    setPage(id);
    if (window.innerWidth < 768) setCol(true);
  }, [setPage, setCol]);

  const toggleCollapse = useCallback(() => setCol(c => !c), [setCol]);

  // Close sidebar overlay on Escape key
  useEffect(() => {
    if (col) return; // only listen when sidebar is open as overlay
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCol(true);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [col, setCol]);

  return (
    <>
    {!col && <div className="sb-backdrop" aria-hidden="true" onClick={() => setCol(true)} />}
    <aside className={"sb"+(col?" col":"")} aria-label="Main navigation">
      <button
        className="sb-logo"
        onClick={toggleCollapse}
        aria-label={col ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!col}
        type="button"
      >
        {col ? (
          <div className="logo-box" style={{fontWeight:900,fontSize:14,letterSpacing:'-0.5px'}}>A</div>
        ) : (
          <Image src="/abraj-logo.jpeg" alt="Abraj Energy Services" className="logo-img" width={160} height={40} priority />
        )}
      </button>
      <nav aria-label="Dashboard navigation">
        {/* Analytics */}
        {!col&&<div className="sec-lbl" id="sec-analytics">Analytics</div>}
        {!col&&<button
          className="ni"
          onClick={() => toggleSection('analytics')}
          onKeyDown={e => handleKeyActivate(e, () => toggleSection('analytics'))}
          aria-expanded={openSection === 'analytics'}
          aria-controls="nav-analytics"
          type="button"
        >
          <span className="ni-icon" aria-hidden="true">📊</span><span className="ni-lbl">Dashboards</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:10,opacity:.5}} aria-hidden="true">{openSection==='analytics'?"▾":"▸"}</span>
        </button>}
        {(openSection==='analytics'||col)&&<div id="nav-analytics" role="list" className={col?"":"ni-kids"} aria-labelledby={col ? undefined : "sec-analytics"}>
          {NAV_ANALYTICS.map(i=>(
            <button
              key={i.id}
              className={"ni-kid"+(page===i.id?" act":"")}
              onClick={() => navigate(i.id)}
              aria-current={page===i.id ? "page" : undefined}
              title={col?i.lbl:""}
              role="listitem"
              type="button"
            >
              <span className="ni-icon" aria-hidden="true">{i.ico}</span>
              {!col && <span className="ni-kid-txt">{i.lbl}</span>}
            </button>
          ))}
        </div>}
        {/* Operations */}
        {!col&&<div className="sec-lbl" id="sec-ops">Operations</div>}
        {!col&&<button
          className="ni"
          onClick={() => toggleSection('ops')}
          onKeyDown={e => handleKeyActivate(e, () => toggleSection('ops'))}
          aria-expanded={openSection === 'ops'}
          aria-controls="nav-ops"
          type="button"
        >
          <span className="ni-icon" aria-hidden="true">⚙️</span><span className="ni-lbl">Rig Ops</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:10,opacity:.5}} aria-hidden="true">{openSection==='ops'?"▾":"▸"}</span>
        </button>}
        {(openSection==='ops'||col)&&<div id="nav-ops" role="list" className={col?"":"ni-kids"} aria-labelledby={col ? undefined : "sec-ops"}>
          {NAV_OPS.map(i=>(
            <button
              key={i.id}
              className={"ni-kid"+(page===i.id?" act":"")}
              onClick={() => navigate(i.id)}
              aria-current={page===i.id ? "page" : undefined}
              title={col?i.lbl:""}
              role="listitem"
              type="button"
            >
              <span className="ni-icon" aria-hidden="true">{i.ico}</span>
              {!col && <span className="ni-kid-txt">{i.lbl}</span>}
            </button>
          ))}
        </div>}
        {/* Data Entry */}
        {!col&&<div className="sec-lbl" id="sec-entry">Data Entry</div>}
        {!col&&<button
          className="ni"
          onClick={() => toggleSection('entry')}
          onKeyDown={e => handleKeyActivate(e, () => toggleSection('entry'))}
          aria-expanded={openSection === 'entry'}
          aria-controls="nav-entry"
          type="button"
        >
          <span className="ni-icon" aria-hidden="true">📝</span><span className="ni-lbl">Entry Forms</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:10,opacity:.5}} aria-hidden="true">{openSection==='entry'?"▾":"▸"}</span>
        </button>}
        {(openSection==='entry'||col)&&<div id="nav-entry" role="list" className={col?"":"ni-kids"} aria-labelledby={col ? undefined : "sec-entry"}>
          {NAV_ENTRY.map(i=>(
            <button
              key={i.id}
              className={"ni-kid"+(page===i.id?" act":"")}
              onClick={() => navigate(i.id)}
              aria-current={page===i.id ? "page" : undefined}
              title={col?i.lbl:""}
              role="listitem"
              type="button"
            >
              <span className="ni-icon" aria-hidden="true">{i.ico}</span>
              {!col && <span className="ni-kid-txt">{i.lbl}</span>}
            </button>
          ))}
        </div>}
        {/* System */}
        {!col&&<div className="sec-lbl" id="sec-system">System</div>}
        {!col&&<button
          className="ni"
          onClick={() => toggleSection('system')}
          onKeyDown={e => handleKeyActivate(e, () => toggleSection('system'))}
          aria-expanded={openSection === 'system'}
          aria-controls="nav-system"
          type="button"
        >
          <span className="ni-icon" aria-hidden="true">🔧</span><span className="ni-lbl">System</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:10,opacity:.5}} aria-hidden="true">{openSection==='system'?"▾":"▸"}</span>
        </button>}
        {(openSection==='system'||col)&&<div id="nav-system" role="list" className={col?"":"ni-kids"} aria-labelledby={col ? undefined : "sec-system"}>
          {NAV_SYSTEM.map(i=>(
            <button
              key={i.id}
              className={"ni-kid"+(page===i.id?" act":"")}
              onClick={() => navigate(i.id)}
              aria-current={page===i.id ? "page" : undefined}
              title={col?i.lbl:""}
              role="listitem"
              type="button"
            >
              <span className="ni-icon" aria-hidden="true">{i.ico}</span>
              {!col && <span className="ni-kid-txt">{i.lbl}</span>}
            </button>
          ))}
        </div>}
      </nav>
      <button className="sb-foot" onClick={toggleCollapse} aria-label={col ? "Expand sidebar" : "Collapse sidebar"} type="button">
        <span aria-hidden="true" style={{fontSize:12}}>{col?"▶":"◀"}</span>{!col&&<span>Collapse</span>}
      </button>
    </aside>
    </>
  );
}
