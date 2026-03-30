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

export function Topbar({page,col,setCol}: {page: string, col?: boolean, setCol: React.Dispatch<React.SetStateAction<boolean>>}){
  const [par,cur]=CRUMBS[page]||["","Dashboard"];
  const isEntry=par==="Data Entry";
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
        <span className="tb-badge">PDO</span>
        <span className="tb-badge tb-badge-live" aria-label="System is live">● Live</span>
        <div className="tb-avatar" aria-label="User: RM">RM</div>
      </div>
    </header>
  );
}
