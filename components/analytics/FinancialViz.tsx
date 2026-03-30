'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Area } from 'recharts';
import { fleetRows, revData } from '@/lib/data';
import { KPI } from '@/components/Shared';
import { useIsMobile } from '@/hooks/use-mobile';

export function FinancialViz(){
  const isMobile = useIsMobile();
  const chartH = isMobile ? 180 : 220;
  const rigRevData=fleetRows.slice(0,8).map((r,i)=>({rig:"R"+r.rig,rev:3.9-i*0.1,bud:3.7-i*0.05,npt:0.08+i*0.03}));
  return(
    <div>
      <div className="kpi-row">
        <KPI l="YTD Revenue" v="$21.0M" s="↑ +5.1% vs budget" cls="g" trend="up"/>
        <KPI l="MTD Billing" v="$3.9M" s="Jun 2025" cls="b"/>
        <KPI l="NPT Revenue Loss" v="$218K" s="↑ Reduce target" cls="r" trend="dn"/>
        <KPI l="Active Contracts" v="32 rigs" cls="p"/>
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-hdr">Revenue vs Budget by Rig ($M) — Jun</div>
          <div className="chart-wrap" style={{height:chartH}}>
            <ResponsiveContainer width="100%" height={chartH}>
              <BarChart data={rigRevData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="rig" tick={{fontSize:9}} stroke="#ccc"/>
                <YAxis tick={{fontSize:9}} stroke="#ccc" domain={[0,4.5]}/>
                <Tooltip contentStyle={{borderRadius:6,fontSize:11}}/>
                <Legend wrapperStyle={{fontSize:10}}/>
                <Bar dataKey="bud" fill="#0085CA" name="Budget" opacity={0.5} radius={[2,2,0,0]}/>
                <Bar dataKey="rev" fill="#07788D" name="Actual" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr">Monthly Revenue vs Budget ($M)</div>
          <div className="chart-wrap" style={{height:chartH}}>
            <ResponsiveContainer width="100%" height={chartH}>
              <ComposedChart data={revData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="m" tick={{fontSize:10}} stroke="#ccc"/>
                <YAxis tick={{fontSize:10}} stroke="#ccc"/>
                <Tooltip contentStyle={{borderRadius:6,fontSize:11}}/>
                <Legend wrapperStyle={{fontSize:10}}/>
                <Area type="monotone" dataKey="bud" stroke="#0085CA" fill="#0085CA10" strokeDasharray="4 4" name="Budget"/>
                <Area type="monotone" dataKey="act" stroke="#07788D" fill="#07788D12" strokeWidth={2} name="Actual"/>
                <Bar dataKey="npt" fill="#8B3A3A" opacity={0.6} name="NPT Loss ($M)" radius={[2,2,0,0]}/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-hdr">Rate Type Breakdown — All Rigs Jun 2025</div>
        <div className="tw">
          <table>
            <thead><tr>{["Rig","Op Hrs","Op Days","Reduced Hrs","Breakdown","Special","Zero","Stack","Total Hrs","Est. Revenue ($)"].map(h=><th key={h} scope="col" className="th">{h}</th>)}</tr></thead>
            <tbody>
              {fleetRows.slice(0,8).map((r,i)=>{
                const op=720-i*8;const rd=i%2===0?0:24;const sp=r.rate==="Special"?24:0;
                const total=op+rd+sp+(744-op-rd-sp);
                const rev=op/24*18500+rd/24*9250+sp/24*14000;
                return (
                  <tr key={i}>
                    <td><strong>Rig {r.rig}</strong></td>
                    <td style={{color:"#2A6B4A",fontWeight:700}}>{op}</td>
                    <td style={{fontWeight:700}}>{(op/24).toFixed(1)}</td>
                    <td style={{color:rd?"#D97706":"#ccc",fontWeight:rd?700:400}}>{rd||"-"}</td>
                    <td style={{color:"#ccc"}}>-</td>
                    <td style={{color:sp?"#0085CA":"#ccc",fontWeight:sp?700:400}}>{sp||"-"}</td>
                    <td style={{color:"#ccc"}}>-</td>
                    <td style={{color:"#ccc"}}>-</td>
                    <td style={{fontWeight:700}}>744</td>
                    <td style={{fontWeight:600,color:"#07788D"}}>${Math.round(rev).toLocaleString()}</td>
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
