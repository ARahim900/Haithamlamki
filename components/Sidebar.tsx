'use client';
import React, { useState } from 'react';

export const NAV_ANALYTICS=[
  {id:"home",lbl:"Fleet Dashboard",ico:"📊"},
  {id:"viz-financial",lbl:"Financial Analytics",ico:"💰"},
  {id:"viz-performance",lbl:"Performance Analytics",ico:"📈"},
];
export const NAV_OPS=[
  {id:"viz-operations",lbl:"Operations Analytics",ico:"⚙"},
  {id:"accruals",lbl:"Billing Accruals",ico:"📑",who:"Engineer (HQ)"},
  {id:"revenue",lbl:"Revenue",ico:"💵",who:"Engineer (HQ)"},
  {id:"welltrack",lbl:"Well Tracking",ico:"🎯",who:"Engineer (HQ)"},
  {id:"nptbill",lbl:"NPT Billing",ico:"🔴",who:"Engineer (HQ)"},
  {id:"util",lbl:"Utilization",ico:"🟢",who:"Engineer (HQ)"},
  {id:"fuel",lbl:"Fuel Tracking",ico:"⛽",who:"Engineer"},
  {id:"rigmove",lbl:"Rig Move",ico:"🚚",who:"Rig Move Engineer"},
];
export const NAV_ENTRY=[
  {id:"ddor",lbl:"DDOR Entry",ico:"📋",who:"Tool Pusher"},
  {id:"ahead",lbl:"72hr Ahead Plan",ico:"📅",who:"Tool Pusher / Engineer"},
  {id:"ytd",lbl:"YTD / NPT Details",ico:"⚠",who:"Tool Pusher"},
  {id:"billing",lbl:"Billing Ticket",ico:"🧾",who:"Engineer"},
  {id:"crm",lbl:"Customer Satisfaction",ico:"⭐",who:"Quality Manager"},
];

export function Sidebar({page,setPage,col,setCol}: {page: string, setPage: (p: string) => void, col: boolean, setCol: React.Dispatch<React.SetStateAction<boolean>>}){
  const [openA,setOpenA]=useState(true);
  const [openO,setOpenO]=useState(false);
  const [openE,setOpenE]=useState(false);
  return (
    <div className={"sb"+(col?" col":"")}>
      <div className="sb-logo" onClick={()=>setCol(c=>!c)}>
        <div className="logo-box">⚙</div>
        <div className="logo-txt"><div className="l1">ABRAJ MIS</div><div className="l2">Rig Operations Platform</div></div>
      </div>
      <nav>
        {/* Analytics */}
        {!col&&<div className="sec-lbl">Analytics</div>}
        {!col&&<div className="ni" onClick={()=>setOpenA(a=>!a)}>
          <span className="ni-icon">📊</span><span className="ni-lbl">Dashboards</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:12,opacity:.6}}>{openA?"▾":"▸"}</span>
        </div>}
        {(openA||col)&&<div className={col?"":"ni-kids"}>
          {NAV_ANALYTICS.map(i=>(
            <div key={i.id} className={"ni-kid"+(page===i.id?" act":"")} onClick={()=>setPage(i.id)} title={col?i.lbl:""}>
              <span className="ni-icon">{i.ico}</span>
              {!col && <span className="ni-kid-txt">{i.lbl}</span>}
            </div>
          ))}
        </div>}
        {/* Operations */}
        {!col&&<div className="sec-lbl">Operations</div>}
        {!col&&<div className="ni" onClick={()=>setOpenO(o=>!o)}>
          <span className="ni-icon">⚙</span><span className="ni-lbl">Rig Ops</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:12,opacity:.6}}>{openO?"▾":"▸"}</span>
        </div>}
        {(openO||col)&&<div className={col?"":"ni-kids"}>
          {NAV_OPS.map(i=>(
            <div key={i.id} className={"ni-kid"+(page===i.id?" act":"")} onClick={()=>setPage(i.id)} title={col?i.lbl:""}>
              <span className="ni-icon">{i.ico}</span>
              {!col && <span className="ni-kid-txt">{i.lbl}</span>}
            </div>
          ))}
        </div>}
        {/* Data Entry */}
        {!col&&<div className="sec-lbl">Data Entry</div>}
        {!col&&<div className="ni" onClick={()=>setOpenE(a=>!a)}>
          <span className="ni-icon">📝</span><span className="ni-lbl">Entry Forms</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:12,opacity:.6}}>{openE?"▾":"▸"}</span>
        </div>}
        {(openE||col)&&<div className={col?"":"ni-kids"}>
          {NAV_ENTRY.map(i=>(
            <div key={i.id} className={"ni-kid"+(page===i.id?" act":"")} onClick={()=>setPage(i.id)} title={col?i.lbl:""}>
              <span className="ni-icon">{i.ico}</span>
              {!col && <span className="ni-kid-txt">{i.lbl}</span>}
            </div>
          ))}
        </div>}
      </nav>
      <div className="sb-foot" onClick={()=>setCol(c=>!c)}>
        <span style={{fontSize:14}}>{col?"▶":"◀"}</span><span>Collapse</span>
      </div>
    </div>
  );
}
