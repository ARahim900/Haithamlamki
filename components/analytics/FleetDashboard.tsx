'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { fleetRows, revData, nptPie } from '@/lib/data';
import { Bdg, KPI } from '@/components/Shared';

export function FleetDashboard({setPage}: {setPage: (p: string) => void}){
  const activeRigs=fleetRows.filter(r=>r.status!=="Stacked").length;
  const avgCSAT=Math.round(fleetRows.reduce((s,r)=>s+r.csat,0)/fleetRows.length);
  const avgNPT=(fleetRows.reduce((s,r)=>s+r.npt,0)/fleetRows.length).toFixed(1);
  return(
    <div>
      <div className="alert-warn">
        <span>⚠</span>
        <div>
          <strong>3 DDORs pending approval</strong> — Rigs 108, 201, 302 overdue by more than 2 hrs.
          <button className="btn btn-xs btn-o" style={{marginLeft:10}} onClick={()=>setPage("ddor")}>Open DDOR →</button>
        </div>
      </div>
      <div className="kpi-row">
        <KPI l="Active Rigs" v={activeRigs+"/"+fleetRows.length} s="↑ +2 this month" trend="up"/>
        <KPI l="Fleet Utilization" v="91.4%" s="↑ +3.2% vs last month" cls="g" trend="up"/>
        <KPI l="MTD Revenue" v="$3.9M" s="↑ +5.4% vs budget" cls="b" trend="up"/>
        <KPI l="NPT Hours MTD" v="142h" s="↓ -18% vs last month" cls="w" trend="up"/>
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-hdr">Revenue vs Budget ($M) — YTD</div>
          <div className="chart-wrap" style={{height:200}}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="m" tick={{fontSize:10}} stroke="#ccc"/>
                <YAxis tick={{fontSize:10}} stroke="#ccc" domain={[2.5,4.5]}/>
                <Tooltip contentStyle={{borderRadius:6,fontSize:11}}/>
                <Legend wrapperStyle={{fontSize:10}}/>
                <Area type="monotone" dataKey="bud" stroke="#0085CA" fill="#0085CA10" strokeDasharray="4 4" strokeWidth={1.5} name="Budget ($M)"/>
                <Area type="monotone" dataKey="act" stroke="#07788D" fill="#07788D12" strokeWidth={2.5} name="Actual ($M)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr">NPT by System — MTD</div>
          <div className="chart-wrap" style={{height:200}}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={nptPie} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="v" nameKey="n">
                  {nptPie.map((d,i)=><Cell key={i} fill={d.c}/>)}
                </Pie>
                <Tooltip contentStyle={{borderRadius:6,fontSize:11}}/>
                <Legend iconSize={8} wrapperStyle={{fontSize:10}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-hdr">
          Fleet Status
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <Bdg c="g">{activeRigs} Active</Bdg>
            <Bdg c="gr">1 Stacked</Bdg>
            <Bdg c="t">1 Moving</Bdg>
            <button className="btn btn-t btn-xs" style={{marginLeft:4}} onClick={()=>setPage("ddor")}>+ New DDOR</button>
          </div>
        </div>
        <div className="tw">
          <table>
            <thead><tr>{["Rig","Well","Status","Depth (ft)","Days","Rate","CSAT","NPT 30d"].map(h=><th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody>
              {fleetRows.map((r,i)=>(
                <tr key={i}>
                  <td><strong>Rig {r.rig}</strong></td>
                  <td style={{color:"#0085CA",fontWeight:700,fontSize:11}}>{r.well}</td>
                  <td><Bdg c={r.status==="Drilling"?"g":r.status==="Stacked"?"gr":r.status==="Rig Move"?"t":"b"}>{r.status}</Bdg></td>
                  <td style={{fontFamily:"monospace"}}>{r.depth}</td>
                  <td>{r.days}d</td>
                  <td><Bdg c={r.rate==="Op"?"g":r.rate==="Stack"?"gr":"b"}>{r.rate}</Bdg></td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div className="prog-track"><div className="prog-fill" style={{width:r.csat+"%",background:r.csat>=90?"#16A34A":r.csat>=80?"#D97706":"#DC2626"}}/></div>
                      <span style={{fontSize:10,fontWeight:900,color:r.csat>=90?"#16A34A":r.csat>=80?"#D97706":"#DC2626"}}>{r.csat}%</span>
                    </div>
                  </td>
                  <td style={{fontWeight:900,color:r.npt>4?"#DC2626":r.npt>2?"#D97706":"#16A34A"}}>{r.npt}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
