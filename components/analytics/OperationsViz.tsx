'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';
import { fuelTrend, wellTracking } from '@/lib/data';
import { KPI, Bdg } from '@/components/Shared';

export function OperationsViz(){
  return(
    <div>
      <div className="kpi-row">
        <KPI l="Fleet Fuel MTD" v="46,200 L" s="Jun 2025" cls="w"/>
        <KPI l="Closing Stock" v="23,800 L" s="Monitor low rigs" cls="b"/>
        <KPI l="Avg/Rig/Day" v="1,540 L" s="vs 1,600L budget" cls="g" trend="up"/>
        <KPI l="Active POs" v="3" s="2 expiring soon" cls="r"/>
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-hdr">Fuel Consumed vs Received (L)</div>
          <div className="chart-wrap" style={{height:220}}>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={fuelTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="m" tick={{fontSize:10}} stroke="#ccc"/>
                <YAxis tick={{fontSize:10}} stroke="#ccc"/>
                <Tooltip contentStyle={{borderRadius:6,fontSize:11}}/>
                <Legend wrapperStyle={{fontSize:10}}/>
                <Bar dataKey="con" fill="#DC2626" name="Consumed" radius={[3,3,0,0]}/>
                <Bar dataKey="rec" fill="#07788D" name="Received" radius={[3,3,0,0]}/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr">Fuel Category Breakdown — Jun</div>
          {[["Rig engines","28,400L","61%","#07788D"],["Camp generators","8,200L","18%","#0085CA"],["Client invoiced","5,100L","11%","#16A34A"],["Other consumers","2,800L","6%","#D97706"],["Vehicles","1,700L","4%","#A7A8A9"]].map(([l,v,p,c])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #F0F1F5"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0}}/>
              <span style={{flex:1,fontSize:12,color:"#333F48"}}>{l}</span>
              <strong style={{fontSize:12}}>{v}</strong>
              <span style={{fontSize:11,color:"#777",width:30,textAlign:"right"}}>{p}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-hdr">Well Lifecycle Tracker — Active Wells</div>
        <div className="tw">
          <table>
            <thead><tr>{["Rig","Well","Field","Spud Date","Phase","Target TD","Current TD","Progress","AFE Days","Actual","Variance"].map(h=><th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody>
              {wellTracking.map((r,i)=>{
                const prog=Math.min(100,Math.round((r.cTD/r.tTD)*100));
                const vari=r.actD-r.afeD;
                return (
                  <tr key={i}>
                    <td><strong>Rig {r.rig}</strong></td>
                    <td style={{color:"#0085CA",fontWeight:700,fontSize:11}}>{r.well}</td>
                    <td style={{color:"#777",fontSize:11}}>{r.field}</td>
                    <td style={{fontSize:11,color:"#777"}}>{r.spud}</td>
                    <td><Bdg c={r.status==="Drilling"?"g":r.status==="Rig Move"?"t":"b"}>{r.status}</Bdg></td>
                    <td style={{fontFamily:"monospace"}}>{r.tTD.toLocaleString()}</td>
                    <td style={{fontFamily:"monospace",fontWeight:700}}>{r.cTD.toLocaleString()}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <div className="prog-track" style={{width:50}}><div className="prog-fill" style={{width:prog+"%",background:"#07788D"}}/></div>
                        <span style={{fontSize:10,fontWeight:900,color:"#07788D"}}>{prog}%</span>
                      </div>
                    </td>
                    <td>{r.afeD}d</td>
                    <td style={{fontWeight:700}}>{r.actD}d</td>
                    <td style={{fontWeight:900,color:vari>0?"#DC2626":"#16A34A"}}>{vari>0?"+":""}{vari}d</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
