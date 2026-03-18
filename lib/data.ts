export const RIGS=["Rig 103","Rig 104","Rig 105","Rig 106","Rig 107","Rig 108","Rig 109","Rig 110","Rig 111","Rig 112","Rig 201","Rig 202","Rig 203","Rig 204","Rig 205","Rig 206","Rig 207","Rig 208","Rig 209","Rig 210","Rig 221","Rig 301","Rig 302","Rig 303","Rig 304","Rig 305","Rig 306","Hoist 01","Hoist 02","Hoist 03","Hoist 04","Hoist 05"];
export const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const NPT_SYSTEMS=["Drawworks","Mud Pumps","Top Drive","Electrical","BOP","MWD/LWD","Drill String","Wellbore","Weather","Client Permit","Third Party","HSE Hold","Contractual"];
export const RATE_TYPES=["OP","RD","BKD","SP","ZR","SK"];

export const fleetRows=[
  {rig:"103",well:"HAJAL NE 20H1",status:"Drilling",depth:"6,342",days:32,rate:"Op",csat:88,npt:2.1},
  {rig:"104",well:"SF-41",status:"Completion",depth:"8,105",days:45,rate:"Op",csat:80,npt:4.8},
  {rig:"105",well:"HAJAL NE 20H1",status:"Drilling",depth:"2,790",days:28,rate:"Op",csat:100,npt:0.8},
  {rig:"106",well:"Maurid-SW-2",status:"Rig Move",depth:"-",days:2,rate:"Special",csat:96,npt:1.2},
  {rig:"107",well:"Qata 182",status:"Drilling",depth:"5,180",days:18,rate:"Op",csat:84,npt:3.4},
  {rig:"108",well:"Thamoud 91",status:"Drilling",depth:"4,200",days:25,rate:"Op",csat:68,npt:5.8},
  {rig:"112",well:"SF-65",status:"Drilling",depth:"6,342",days:32,rate:"Op",csat:92,npt:1.9},
  {rig:"201",well:"TIBR_37",status:"Drilling",depth:"3,450",days:12,rate:"Op",csat:88,npt:2.6},
  {rig:"301",well:"-",status:"Stacked",depth:"-",days:0,rate:"Stack",csat:72,npt:0},
  {rig:"302",well:"Yibal-611",status:"Drilling",depth:"7,890",days:30,rate:"Op",csat:96,npt:1.3},
];
export const revData=[{m:"Jan",act:3.2,bud:3.5,npt:0.18},{m:"Feb",act:3.4,bud:3.5,npt:0.12},{m:"Mar",act:3.8,bud:3.6,npt:0.09},{m:"Apr",act:3.1,bud:3.5,npt:0.22},{m:"May",act:3.6,bud:3.5,npt:0.15},{m:"Jun",act:3.9,bud:3.7,npt:0.08}];
export const utilData=[{m:"Jan",op:87,rd:5,bkd:3,zero:2,sp:3},{m:"Feb",op:91,rd:3,bkd:2,zero:1,sp:3},{m:"Mar",op:89,rd:4,bkd:4,zero:1,sp:2},{m:"Apr",op:85,rd:6,bkd:5,zero:2,sp:2},{m:"May",op:92,rd:3,bkd:2,zero:1,sp:2},{m:"Jun",op:94,rd:2,bkd:1,zero:1,sp:2}];
export const fuelTrend=[{m:"Jan",con:48200,rec:52000},{m:"Feb",con:45100,rec:48000},{m:"Mar",con:51300,rec:50000},{m:"Apr",con:47600,rec:50000},{m:"May",con:49800,rec:52000},{m:"Jun",con:46200,rec:48000}];
export const nptPie=[{n:"Drawworks",v:28,c:"#07788D"},{n:"Mud Pumps",v:19,c:"#0085CA"},{n:"Top Drive",v:15,c:"#16A34A"},{n:"Electrical",v:22,c:"#D97706"},{n:"BOP",v:16,c:"#DC2626"}];
export const crmData=RIGS.slice(0,10).map((r,i)=>({rig:r.replace("Rig ",""),score:Math.max(68,98-i*3)}));
export const wellTracking=[
  {rig:"103",well:"HAJAL NE 20H1",field:"NWT",spud:"14-May",phase:"Drilling",tTD:8400,cTD:6342,afeD:55,actD:32},
  {rig:"104",well:"SF-41",field:"SFN",spud:"20-Apr",phase:"Completion",tTD:9200,cTD:8105,afeD:62,actD:45},
  {rig:"105",well:"HAJAL NE 20H1",field:"NWT",spud:"22-May",phase:"Drilling",tTD:7800,cTD:2790,afeD:50,actD:28},
  {rig:"302",well:"Yibal-611",field:"YIB",spud:"30-Apr",phase:"Drilling",tTD:9600,cTD:7890,afeD:58,actD:30},
  {rig:"106",well:"Maurid-SW-2",field:"MRD",spud:"10-Apr",phase:"Rig Move",tTD:5800,cTD:5800,afeD:35,actD:45},
];
