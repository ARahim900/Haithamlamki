'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { fleetRows, revData, nptPie } from '@/lib/data';
import { colors as t } from '@/lib/tokens';
import { Bdg, KPI } from '@/components/Shared';
import { useIsMobile } from '@/hooks/use-mobile';

export function FleetDashboard({setPage}: {setPage: (p: string) => void}){
  const isMobile = useIsMobile();
  const activeRigs=fleetRows.filter(r=>r.status!=="Stacked").length;
  const avgCSAT=Math.round(fleetRows.reduce((s,r)=>s+r.csat,0)/fleetRows.length);
  const avgNPT=(fleetRows.reduce((s,r)=>s+r.npt,0)/fleetRows.length).toFixed(1);
  return(
    <div>
      <div className="alert-warn">
        <span>⚠</span>
        <div>
          <strong>3 DDORs pending approval</strong> — Rigs 108, 201, 302 overdue by more than 2 hrs.
          <button className="btn btn-s btn-o" style={{marginLeft:10}} onClick={()=>setPage("ddor")}>Open DDOR →</button>
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
          <div className="chart-wrap" style={{height:isMobile ? 140 : 160}}>
            <ResponsiveContainer width="100%" height={isMobile ? 140 : 160}>
              <AreaChart data={revData}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.grid}/>
                <XAxis dataKey="m" tick={{fontSize:10, fill: t.axisText}} stroke={t.axisLight}/>
                <YAxis tick={{fontSize:10, fill: t.axisText}} stroke={t.axisLight} domain={[2.5,4.5]} width={30}/>
                <Tooltip contentStyle={{borderRadius:6,fontSize:10}}/>
                <Legend align="center" verticalAlign="bottom" wrapperStyle={{fontSize:10, paddingTop: 6}}/>
                <Area type="monotone" dataKey="bud" stroke={t.info} fill={t.info+"10"} strokeDasharray="4 4" strokeWidth={1.5} name="Budget"/>
                <Area type="monotone" dataKey="act" stroke={t.primary} fill={t.primary+"12"} strokeWidth={2} name="Actual"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr">NPT by System — MTD</div>
          <div className="chart-wrap" style={{height:isMobile ? 140 : 160}}>
            <ResponsiveContainer width="100%" height={isMobile ? 140 : 160}>
              <PieChart>
                <Pie data={nptPie} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="v" nameKey="n">
                  {nptPie.map((d,i)=><Cell key={i} fill={d.c}/>)}
                </Pie>
                <Tooltip contentStyle={{borderRadius:6,fontSize:10}}/>
                <Legend align="center" verticalAlign="bottom" iconSize={6} wrapperStyle={{fontSize:10, paddingTop: 4}}/>
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
            <thead><tr>{["Rig","Well","Status","Depth (ft)","Days","Rate","CSAT","NPT 30d"].map(h=><th key={h} scope="col" className={"th"+(h==="Days"||h==="NPT 30d"?" tb-num":"")}>{h}</th>)}</tr></thead>
            <tbody>
              {fleetRows.map((r,i)=>(
                <tr key={i}>
                  <td><strong>Rig {r.rig}</strong></td>
                  <td style={{color:"var(--color-info)",fontWeight:700,fontSize:11}}>{r.well}</td>
                  <td><Bdg c={r.status==="Drilling"?"g":r.status==="Stacked"?"gr":r.status==="Rig Move"?"t":"b"}>{r.status}</Bdg></td>
                  <td style={{fontFamily:"monospace"}}>{r.depth}</td>
                  <td className="tb-num">{r.days}d</td>
                  <td><Bdg c={r.rate==="Op"?"g":r.rate==="Stack"?"gr":"b"}>{r.rate}</Bdg></td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div className="prog-track"><div className="prog-fill" style={{width:r.csat+"%",background:r.csat>=90?t.positive:r.csat>=80?t.warning:t.negative}}/></div>
                      <span style={{fontSize:10,fontWeight:600,color:r.csat>=90?"var(--color-positive)":r.csat>=80?"var(--color-warning)":"var(--color-negative)"}}>{r.csat}%</span>
                    </div>
                  </td>
                  <td className="tb-num">
                    <Bdg c={r.npt>4?"r":r.npt>2?"w":"g"}>{r.npt}%</Bdg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
