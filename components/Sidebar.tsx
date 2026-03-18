'use client';
import React, { useState } from 'react';

export const NAV_ANALYTICS=[
  {id:"home",lbl:"Fleet Dashboard",ico:"📊"},
  {id:"viz-financial",lbl:"Financial Analytics",ico:"💰"},
  {id:"viz-performance",lbl:"Performance Analytics",ico:"📈"},
  {id:"viz-operations",lbl:"Operations Analytics",ico:"⚙"},
];
export const NAV_ENTRY=[
  {id:"ddor",lbl:"DDOR Entry",ico:"📋",rno:3,who:"Tool Pusher"},
  {id:"ahead",lbl:"72hr Ahead Plan",ico:"📅",rno:2,who:"Tool Pusher / Engineer"},
  {id:"ytd",lbl:"YTD / NPT Details",ico:"⚠",rno:5,who:"Tool Pusher"},
  {id:"billing",lbl:"Billing Ticket",ico:"🧾",rno:4,who:"Engineer"},
  {id:"fuel",lbl:"Fuel Tracking",ico:"⛽",rno:9,who:"Engineer"},
  {id:"crm",lbl:"Customer Satisfaction",ico:"⭐",rno:11,who:"Quality Manager"},
  {id:"rigmove",lbl:"Rig Move",ico:"🚚",rno:1,who:"Rig Move Engineer"},
  {id:"accruals",lbl:"Billing Accruals",ico:"📑",rno:12,who:"Engineer (HQ)"},
  {id:"revenue",lbl:"Revenue",ico:"💵",rno:10,who:"Engineer (HQ)"},
  {id:"welltrack",lbl:"Well Tracking",ico:"🎯",rno:7,who:"Engineer (HQ)"},
  {id:"nptbill",lbl:"NPT Billing",ico:"🔴",rno:8,who:"Engineer (HQ)"},
  {id:"util",lbl:"Utilization",ico:"🟢",rno:6,who:"Engineer (HQ)"},
];

export function Sidebar({page,setPage,col,setCol}: {page: string, setPage: (p: string) => void, col: boolean, setCol: React.Dispatch<React.SetStateAction<boolean>>}){
  const [openA,setOpenA]=useState(true);
  const [openE,setOpenE]=useState(true);
  return (
    <div className={"sb"+(col?" col":"")}>
      <div className="sb-logo" onClick={()=>setCol(c=>!c)}>
        <div className="logo-box">⚙</div>
        <div className="logo-txt"><div className="l1">ABRAJ MIS</div><div className="l2">Rig Operations Platform</div></div>
      </div>
      <nav>
        {/* Analytics */}
        {!col&&<div className="sec-lbl">Analytics</div>}
        {!col&&<div className="ni" onClick={()=>setOpenA(a=>!a)} style={{opacity:.7,fontSize:11}}>
          <span>📊</span><span className="ni-lbl">Dashboards</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:10}}>{openA?"▾":"▸"}</span>
        </div>}
        {(openA||col)&&<div className={col?"":"ni-kids"}>
          {NAV_ANALYTICS.map(i=>(
            <div key={i.id} className={"ni-kid"+(page===i.id?" act":"")} onClick={()=>setPage(i.id)} title={col?i.lbl:""}>
              {col?<span style={{fontSize:14}}>{i.ico}</span>:<>{i.ico} {i.lbl}</>}
            </div>
          ))}
        </div>}
        {/* Data Entry */}
        {!col&&<div className="sec-lbl" style={{marginTop:6}}>Data Entry</div>}
        {!col&&<div className="ni" onClick={()=>setOpenE(a=>!a)} style={{opacity:.7,fontSize:11}}>
          <span>📝</span><span className="ni-lbl">Entry Forms</span><span className="ni-arr" style={{marginLeft:"auto",fontSize:10}}>{openE?"▾":"▸"}</span>
        </div>}
        {(openE||col)&&<div className={col?"":"ni-kids"}>
          {NAV_ENTRY.map(i=>(
            <div key={i.id} className={"ni-kid"+(page===i.id?" act":"")} onClick={()=>setPage(i.id)} title={col?i.lbl+"|#"+i.rno:""}>
              {col?<span style={{fontSize:13}}>{i.ico}</span>:<><span style={{opacity:.35,fontSize:10,marginRight:3}}>#{i.rno}</span>{i.lbl}</>}
            </div>
          ))}
        </div>}
      </nav>
      <div className="sb-foot" onClick={()=>setCol(c=>!c)}>
        <span>{col?"▶":"◀"}</span><span>Collapse</span>
      </div>
    </div>
  );
}
