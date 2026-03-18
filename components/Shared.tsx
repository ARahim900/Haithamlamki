import React from 'react';

export function Bdg({c,children}: {c: string, children: React.ReactNode}){return <span className={"bdg "+c}>{children}</span>}

export function KPI({l,v,s,cls,trend}: {l: string, v: string | number, s?: string, cls?: string, trend?: string}){
  return (
    <div className={"kpi"+(cls?" "+cls:"")}>
      <div className="kpi-l">{l}</div>
      <div className="kpi-v">{v}</div>
      {s&&<div className={"kpi-s"+(trend?" "+trend:"")}>{s}</div>}
    </div>
  );
}

export function FieldLegend(){
  return (
    <div className="legend">
      <span style={{fontSize:11,fontWeight:900,color:"#555"}}>Field types:</span>
      {[["#FFF9C4","#E5C900","Auto-calculated"],["#FFF3E0","#FF9800","Dropdown"],["#E8F5E9","#4CAF50","Manual input"],["#E3F2FD","#2196F3","Drafted from report"]].map(([bg,bd,lb])=>(
        <div key={lb} className="leg-i"><div className="leg-d" style={{background:bg,border:"1.5px solid "+bd}}/>{lb}</div>
      ))}
    </div>
  );
}

export function FA({l,v}: {l?: string, v?: string | number}){return(<div>{l&&<label className="f-lbl">{l}<span className="ftag ftag-a">AUTO</span></label>}<div className="f-auto">{v||"—"}</div></div>);}

export function FD({l,opts,v,onChange}: {l?: string, opts?: string[], v?: string, onChange?: (e: any) => void}){return(<div>{l&&<label className="f-lbl">{l}<span className="ftag ftag-d">DD</span></label>}<select className="f-dd" value={v} onChange={onChange || (() => {})}><option value={v||""}>{v||"-- Select --"}</option>{(opts||[]).map(o=><option key={o} value={o}>{o}</option>)}</select></div>);}

export function FM({l,v,onChange,type,ph,rows}: {l?: string, v?: string | number, onChange?: (e: any) => void, type?: string, ph?: string, rows?: number}){
  return(<div>{l&&<label className="f-lbl">{l}<span className="ftag ftag-m">MANUAL</span></label>}
    {rows?<textarea className="f-man" rows={rows} value={v} onChange={onChange} readOnly={!onChange} placeholder={ph||""}/>
    :<input className="f-man" type={type||"text"} value={v} onChange={onChange} readOnly={!onChange} placeholder={ph||""}/>}
  </div>);}

export function FDr({l,v,onChange,ph}: {l?: string, v?: string | number, onChange?: (e: any) => void, ph?: string}){return(<div>{l&&<label className="f-lbl">{l}<span className="ftag ftag-f">DRAFTED</span></label>}<input className="f-draft" value={v} onChange={onChange} readOnly={!onChange} placeholder={ph||""}/></div>);}
