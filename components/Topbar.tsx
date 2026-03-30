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

export function Topbar({page,setCol}: {page: string, col?: boolean, setCol: React.Dispatch<React.SetStateAction<boolean>>}){
  const [par,cur]=CRUMBS[page]||["","Dashboard"];
  const isEntry=par==="Data Entry";
  return (
    <div className="topbar">
      <div className="tb-left">
        <button className="mobile-menu" onClick={()=>setCol(c=>!c)} aria-label="Toggle menu">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="5" x2="15" y2="5"/><line x1="3" y1="9" x2="15" y2="9"/><line x1="3" y1="13" x2="15" y2="13"/></svg>
        </button>
        <span className="bc-par">{par}</span>
        <span className="bc-sep"> / </span>
        <span className="bc-cur">{cur}</span>
        {isEntry&&<span style={{marginLeft:10,background:"#ECEEF1",color:"#6B7280",fontSize:9,fontWeight:600,padding:"3px 8px",borderRadius:4,textTransform:"uppercase",letterSpacing:".3px"}}>Entry</span>}
      </div>
      <div className="tb-right">
        <span style={{background:"#F5F6F8",color:"#6B7280",borderRadius:4,padding:"4px 10px",fontSize:11,fontWeight:500,border:"1px solid #E5E7EB"}}>PDO</span>
        <span style={{background:"#EFF7F2",color:"#2A6B4A",borderRadius:4,padding:"4px 10px",fontSize:11,fontWeight:600,border:"1px solid #C3DFC9"}}>● Live</span>
        <div style={{width:30,height:30,borderRadius:"50%",background:"#243B42",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.85)",fontSize:11,fontWeight:600}}>RM</div>
      </div>
    </div>
  );
}
