'use client';
import React from 'react';

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
};

export function Topbar({page}: {page: string}){
  const [par,cur]=CRUMBS[page]||["","Dashboard"];
  const isEntry=par==="Data Entry";
  return (
    <div className="topbar">
      <div className="tb-left">
        <span className="bc-par">{par}</span>
        <span className="bc-sep"> / </span>
        <span className="bc-cur">{cur}</span>
        {isEntry&&<span style={{marginLeft:12,background:"#DBEAFE",color:"#1D4ED8",fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:100}}>DATA ENTRY</span>}
      </div>
      <div className="tb-right">
        <span style={{background:"#F8FAFC",color:"#475569",borderRadius:100,padding:"7px 18px",fontSize:13,fontWeight:600, border:"1px solid #E2E8F0"}}>PDO Contract</span>
        <span style={{background:"#ECFDF5",color:"#047857",borderRadius:100,padding:"7px 18px",fontSize:13,fontWeight:700, border:"1px solid #A7F3D0"}}>● Live</span>
        <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg, #0EA5E9, #06B6D4)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700,boxShadow:"0 4px 14px rgba(14,165,233,0.25)",letterSpacing:".5px"}}>RM</div>
      </div>
    </div>
  );
}
