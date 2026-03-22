'use client';
import React, { useState } from 'react';
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

type Section = 'analytics' | 'ops' | 'entry' | null;

export function Sidebar({page,setPage,col,setCol}: {page: string, setPage: (p: string) => void, col: boolean, setCol: React.Dispatch<React.SetStateAction<boolean>>}){
  const [openSection, setOpenSection] = useState<Section>('analytics');

  const toggleSection = (section: Section) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  return (
    <div className={"sb"+(col?" col":"")}>
      <div className="sb-logo" onClick={()=>setCol(c=>!c)}>
        {col ? (
          <div className="logo-box" style={{fontWeight:900,fontSize:14,letterSpacing:'-0.5px'}}>A</div>
        ) : (
          <Image src="/abraj-logo.jpeg" alt="Abraj Energy Services" width={160} height={45} className="logo-img" priority />
        )}
      </div>
      <nav>
        {/* Analytics */}
        {!col&&<div className="sec-lbl">Analytics</div>}
        {!col&&<div className="ni" onClick={()=>toggleSection('analytics')}>
          <span className="ni-icon">📊</span><span className="ni-lbl">Dashboards</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:10,opacity:.5}}>{openSection==='analytics'?"▾":"▸"}</span>
        </div>}
        {(openSection==='analytics'||col)&&<div className={col?"":"ni-kids"}>
          {NAV_ANALYTICS.map(i=>(
            <div key={i.id} className={"ni-kid"+(page===i.id?" act":"")} onClick={()=>setPage(i.id)} title={col?i.lbl:""}>
              <span className="ni-icon">{i.ico}</span>
              {!col && <span className="ni-kid-txt">{i.lbl}</span>}
            </div>
          ))}
        </div>}
        {/* Operations */}
        {!col&&<div className="sec-lbl">Operations</div>}
        {!col&&<div className="ni" onClick={()=>toggleSection('ops')}>
          <span className="ni-icon">⚙️</span><span className="ni-lbl">Rig Ops</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:10,opacity:.5}}>{openSection==='ops'?"▾":"▸"}</span>
        </div>}
        {(openSection==='ops'||col)&&<div className={col?"":"ni-kids"}>
          {NAV_OPS.map(i=>(
            <div key={i.id} className={"ni-kid"+(page===i.id?" act":"")} onClick={()=>setPage(i.id)} title={col?i.lbl:""}>
              <span className="ni-icon">{i.ico}</span>
              {!col && <span className="ni-kid-txt">{i.lbl}</span>}
            </div>
          ))}
        </div>}
        {/* Data Entry */}
        {!col&&<div className="sec-lbl">Data Entry</div>}
        {!col&&<div className="ni" onClick={()=>toggleSection('entry')}>
          <span className="ni-icon">📝</span><span className="ni-lbl">Entry Forms</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:10,opacity:.5}}>{openSection==='entry'?"▾":"▸"}</span>
        </div>}
        {(openSection==='entry'||col)&&<div className={col?"":"ni-kids"}>
          {NAV_ENTRY.map(i=>(
            <div key={i.id} className={"ni-kid"+(page===i.id?" act":"")} onClick={()=>setPage(i.id)} title={col?i.lbl:""}>
              <span className="ni-icon">{i.ico}</span>
              {!col && <span className="ni-kid-txt">{i.lbl}</span>}
            </div>
          ))}
        </div>}
      </nav>
      <div className="sb-foot" onClick={()=>setCol(c=>!c)}>
        <span style={{fontSize:12}}>{col?"▶":"◀"}</span>{!col&&<span>Collapse</span>}
      </div>
    </div>
  );
}
