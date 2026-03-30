'use client';
import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { utilData, crmData, wellTracking } from '@/lib/data';
import { KPI, Bdg } from '@/components/Shared';

export function PerformanceViz(){
  const csatTrend=[{m:"Jan",avg:84},{m:"Feb",avg:85},{m:"Mar",avg:86},{m:"Apr",avg:87},{m:"May",avg:86},{m:"Jun",avg:89}];
  const wellVarData=wellTracking.map(w=>({well:w.well.substring(0,8),var:w.actD-w.afeD,prog:Math.min(100,Math.round((w.cTD/w.tTD)*100))}));
  return(
    <div>
      <div className="kpi-row">
        <KPI l="Fleet Utilization" v="91.4%" s="↑ +3.2% MoM" cls="g" trend="up"/>
        <KPI l="Total NPT Hrs MTD" v="142h" s="Target: 5%" cls="r"/>
        <KPI l="Avg CSAT" v="89%" s="PDO target: 90%" cls="w"/>
        <KPI l="Wells Active" v="8" s="3 in progress" cls="b"/>
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-hdr">Monthly Utilization Breakdown (%)</div>
          <div className="chart-wrap" style={{height:220}}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={utilData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="m" tick={{fontSize:10}} stroke="#ccc"/>
                <YAxis tick={{fontSize:10}} stroke="#ccc"/>
                <Tooltip contentStyle={{borderRadius:6,fontSize:11}}/>
                <Legend wrapperStyle={{fontSize:10}}/>
                <Bar dataKey="op" fill="#07788D" stackId="a" name="Operating"/>
                <Bar dataKey="rd" fill="#D97706" stackId="a" name="Reduced"/>
                <Bar dataKey="bkd" fill="#8B3A3A" stackId="a" name="Breakdown"/>
                <Bar dataKey="zero" fill="#A7A8A9" stackId="a" name="Zero"/>
                <Bar dataKey="sp" fill="#0085CA" stackId="a" name="Special" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr">CSAT Fleet Average Trend</div>
          <div className="chart-wrap" style={{height:180}}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={csatTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="m" tick={{fontSize:10}} stroke="#ccc"/>
                <YAxis domain={[80,100]} tick={{fontSize:10}} stroke="#ccc"/>
                <Tooltip contentStyle={{borderRadius:6,fontSize:11}}/>
                <Line type="monotone" dataKey="avg" stroke="#07788D" strokeWidth={2.5} dot={{r:4,fill:"#07788D"}} name="Avg CSAT %"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{marginTop:10,paddingTop:8,borderTop:"1px solid #F0F1F5"}}>
            {[["PDO target","90%+","#0085CA"],["Current avg","89%","#D97706"],["Best rig","100% (Rig 105)","#07788D"],["Attention","68% (Rig 108)","#8B3A3A"]].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #F0F1F5",fontSize:11}}>
                <span style={{color:"#777"}}>{l}</span><strong style={{color:c}}>{v}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-hdr">Customer Satisfaction by Rig (%)</div>
          <div className="chart-wrap" style={{height:200}}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={crmData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="rig" tick={{fontSize:9}} stroke="#ccc"/>
                <YAxis domain={[60,100]} tick={{fontSize:10}} stroke="#ccc"/>
                <Tooltip contentStyle={{borderRadius:6,fontSize:11}}/>
                <Bar dataKey="score" name="CSAT %" radius={[3,3,0,0]}>
                  {crmData.map((d,i)=><Cell key={i} fill={d.score>=90?"#07788D":d.score>=80?"#D97706":"#8B3A3A"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr">Well Progress vs AFE — Active Wells</div>
          <div style={{marginTop:4}}>
            {wellTracking.map((w,i)=>{
              const prog=Math.min(100,Math.round((w.cTD/w.tTD)*100));
              const vari=w.actD-w.afeD;
              return (
                <div key={i} style={{padding:"8px 0",borderBottom:"1px solid #F0F1F5"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11}}>
                    <span><strong>Rig {w.rig}</strong> — {w.well}</span>
                    <span style={{color:vari>0?"#8B3A3A":"#2A6B4A",fontWeight:600,fontSize:11}}>{vari>0?"+":""}{vari}d vs AFE</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div className="prog-track"><div className="prog-fill" style={{width:prog+"%",background:prog>80?"#07788D":"#0085CA"}}/></div>
                    <span style={{fontSize:10,color:"#07788D",fontWeight:600,width:36}}>{prog}%</span>
                    <Bdg c={w.status==="Drilling"?"g":w.status==="Rig Move"?"t":"b"}>{w.status}</Bdg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
