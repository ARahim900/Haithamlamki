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
        {isEntry&&<span style={{marginLeft:8,background:"rgba(255,255,255,.15)",color:"rgba(255,255,255,.9)",fontSize:10,fontWeight:900,padding:"2px 8px",borderRadius:4}}>DATA ENTRY</span>}
      </div>
      <div className="tb-right">
        <span style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>PDO Contract</span>
        <span style={{background:"rgba(255,255,255,.15)",color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:900}}>● Live</span>
        <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:900}}>RM</div>
      </div>
    </div>
  );
}
