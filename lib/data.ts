// ─────────────────────────────────────────────────────────
//  lib/data.ts  —  Central data store for all 12 Excel sheets
//  Project: Haithamlamki Drilling Operations
// ─────────────────────────────────────────────────────────

// ── CONFIG ────────────────────────────────────────────────
export const RIGS = [
  "Rig 103","Rig 104","Rig 105","Rig 106","Rig 107","Rig 108",
  "Rig 109","Rig 110","Rig 111","Rig 112",
  "Rig 201","Rig 202","Rig 203","Rig 204","Rig 205","Rig 206",
  "Rig 207","Rig 208","Rig 209","Rig 210","Rig 221",
  "Rig 301","Rig 302","Rig 303","Rig 304","Rig 305","Rig 306",
  "Hoist 01","Hoist 02","Hoist 03","Hoist 04","Hoist 05",
];
export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const NPT_SYSTEMS = [
  "Drawworks","Mud Pumps","Top Drive","Electrical","BOP","MWD/LWD",
  "Drill String","Wellbore","Weather","Client Permit","Third Party","HSE Hold","Contractual",
];
export const RATE_TYPES = ["OP","RD","BKD","SP","ZR","SK"];
export const FIELDS = ["NWT","SFN","YIB","MRD","FHD","LKW","QAR","SRW","NMR","BAH","HRW","KRM","TIBR","RABA"];
export const CLIENTS = ["PDO","OXY","BP","CCED","TOTAL","CC","SHELL"];
export const CONTRACTORS = ["PDO","OXY","CCED","TOTAL","CC Energy"];

// ── SHEET 1: RIG MOVES ────────────────────────────────────
export const rigMoveData = [
  { id:1, rig:"Rig 106", from:"Fahud-88",        to:"Maurid-SW-2",   budgetDays:5, actualDays:7,  budgetCost:125000, actualCost:168000, clientIncome:185000, distance:"42km", moverCompany:"Hamdan Transport", startDate:"01-Jun-2025", endDate:"07-Jun-2025", status:"Completed",   remarks:"Delayed 2 days — road closure on Route 21" },
  { id:2, rig:"Rig 109", from:"Lekhwair-45",     to:"Yibal-612",     budgetDays:4, actualDays:4,  budgetCost:98000,  actualCost:95000,  clientIncome:140000, distance:"28km", moverCompany:"Al Noor Movers",   startDate:"10-Jun-2025", endDate:"14-Jun-2025", status:"Completed",   remarks:"On schedule" },
  { id:3, rig:"Rig 203", from:"Qarn Alam-12",    to:"Saih Rawl-8",   budgetDays:6, actualDays:5,  budgetCost:145000, actualCost:128000, clientIncome:210000, distance:"55km", moverCompany:"Hamdan Transport", startDate:"18-Jun-2025", endDate:"22-Jun-2025", status:"In Progress", remarks:"Ahead of schedule" },
  { id:4, rig:"Rig 104", from:"SF-38",           to:"SF-41",         budgetDays:3, actualDays:4,  budgetCost:72000,  actualCost:89000,  clientIncome:105000, distance:"18km", moverCompany:"Gulf Movers",      startDate:"02-May-2025", endDate:"05-May-2025", status:"Completed",   remarks:"Extra day — permit delay" },
  { id:5, rig:"Rig 302", from:"Yibal-610",       to:"Yibal-611",     budgetDays:2, actualDays:2,  budgetCost:55000,  actualCost:53000,  clientIncome:78000,  distance:"12km", moverCompany:"Al Noor Movers",   startDate:"25-May-2025", endDate:"26-May-2025", status:"Completed",   remarks:"Pad-to-pad, smooth move" },
  { id:6, rig:"Rig 107", from:"Qata-180",        to:"Qata-182",      budgetDays:3, actualDays:3,  budgetCost:68000,  actualCost:71000,  clientIncome:98000,  distance:"15km", moverCompany:"Hamdan Transport", startDate:"14-Apr-2025", endDate:"16-Apr-2025", status:"Completed",   remarks:"Minor delay — crane issue" },
  { id:7, rig:"Rig 105", from:"NWT-18",          to:"HAJAL NE 20H1", budgetDays:5, actualDays:6,  budgetCost:118000, actualCost:134000, clientIncome:172000, distance:"38km", moverCompany:"Gulf Movers",      startDate:"08-Apr-2025", endDate:"13-Apr-2025", status:"Completed",   remarks:"Extra day — heavy lift permit" },
];

// ── SHEET 2: 72-HOUR LOOK AHEAD PLAN ─────────────────────
export const lookAheadTasks = [
  { id:1, dept:"Drilling",    task:"Run 9-5/8\" casing to 10,100ft",          sop:"SOP-DRL-042", day:"Day 1",   checks:[true,false,true,false,false,false,true,false] },
  { id:2, dept:"Drilling",    task:"Cement 9-5/8\" casing — 2-stage",         sop:"SOP-DRL-055", day:"Day 1",   checks:[true,true,true,false,false,false,true,false] },
  { id:3, dept:"Mechanical",  task:"Top drive PM — 500hr service",             sop:"SOP-MNT-018", day:"Day 2",   checks:[true,true,true,false,true,false,true,false] },
  { id:4, dept:"Electrical",  task:"SCR panel inspection and thermal scan",    sop:"SOP-ELE-009", day:"Day 2",   checks:[true,true,true,false,false,false,true,false] },
  { id:5, dept:"Drilling",    task:"Drill 8-1/2\" hole section to 14,500ft",  sop:"SOP-DRL-033", day:"Day 2-3", checks:[true,false,true,false,false,false,true,true] },
  { id:6, dept:"Mechanical",  task:"Crane load test and certification",        sop:"SOP-MNT-025", day:"Day 3",   checks:[true,true,true,true,true,false,true,true] },
  { id:7, dept:"HSE",         task:"Emergency response drill — H2S scenario",  sop:"SOP-HSE-011", day:"Day 3",   checks:[true,false,true,false,false,false,true,false] },
  { id:8, dept:"Logistics",   task:"Chemicals delivery and inspection",        sop:"SOP-LOG-004", day:"Day 1",   checks:[false,false,true,false,false,false,true,false] },
];

// ── SHEET 3: DDOR CONFIG (reports generated per rig/day) ──
export const ddorConfig = {
  activityCodes: [
    { code:"DRL", label:"Drilling",      color:"#3A9E7E" },
    { code:"TRP", label:"Tripping",      color:"#5B8DB8" },
    { code:"CSG", label:"Casing",        color:"#7B6B9E" },
    { code:"CMT", label:"Cementing",     color:"#4D9BA8" },
    { code:"LOG", label:"Logging",       color:"#6B5B8D" },
    { code:"SRV", label:"Service/PM",    color:"#C4923A" },
    { code:"CIR", label:"Circulate",     color:"#2A6B4A" },
    { code:"BHA", label:"BHA Change",    color:"#8B6BAD" },
    { code:"RIG", label:"Rig Up/Down",   color:"#6B7280" },
    { code:"WFT", label:"Wireline/DST",  color:"#3B6BAD" },
    { code:"NPT", label:"NPT",           color:"#B06B6F" },
    { code:"WOC", label:"Wait on Cement",color:"#9A7328" },
    { code:"WOO", label:"Wait on Orders",color:"#7A7F88" },
  ],
};
export const ddorReports = [
  { id:1, rig:"Rig 103", well:"HAJAL NE 20H1", wbs:"WBS-2025-NWT-103", network:"NET-1001", date:"18-Jun-2025", status:"Drilling",   currentDepth:6342, prevDepth:6198, footage:144, daysOnWell:32, phase:"8.5\" drilling" },
  { id:2, rig:"Rig 104", well:"SF-41",         wbs:"WBS-2025-SFN-104", network:"NET-1002", date:"18-Jun-2025", status:"Completion", currentDepth:8105, prevDepth:8105, footage:0,   daysOnWell:45, phase:"Completion" },
  { id:3, rig:"Rig 108", well:"Thamoud-91",    wbs:"WBS-2025-THM-108", network:"NET-1003", date:"18-Jun-2025", status:"Drilling",   currentDepth:4200, prevDepth:4068, footage:132, daysOnWell:25, phase:"12.25\" drilling" },
];

// ── SHEET 4: BILLING TICKET ───────────────────────────────
export const dailyRates: Record<string,number> = { OP:18500, RD:9250, BKD:0, SP:14000, ZR:0, SK:4500 };
export const billingTickets = [
  {
    id:1, rig:"Rig 103", well:"HAJAL NE 20H1", wbs:"WBS-2025-NWT-103",
    rigMoveDate:"28-Apr-2025", spudDate:"14-May-2025", releaseDate:"",
    billingPeriod:"Jun 2025",
    days: Array.from({length:30},(_,i)=>({ day:i+1, date:`${String(i+1).padStart(2,"0")}-Jun-2025`, rate:i===15||i===16?"RD":"OP", hrs:24, remarks:i===15?"Waiting on cement":i===16?"RD — cement WOC":"Normal drilling" })),
  },
  {
    id:2, rig:"Rig 106", well:"Maurid-SW-2", wbs:"WBS-2025-MRD-106",
    rigMoveDate:"01-Jun-2025", spudDate:"08-Jun-2025", releaseDate:"",
    billingPeriod:"Jun 2025",
    days: Array.from({length:30},(_,i)=>({ day:i+1, date:`${String(i+1).padStart(2,"0")}-Jun-2025`, rate:i<7?"SK":i===20?"BKD":"OP", hrs:24, remarks:i<7?"Rig move / mobilisation":i===20?"Breakdown — mud pump":"" })),
  },
];

// ── SHEET 5: YTD NPT DETAILS ──────────────────────────────
export const nptEvents = [
  { id:1, rig:"Rig 108", date:"05-Jun-2025", type:"Abraj",       hrs:4.5, system:"Top Drive",  parentEquip:"Top Drive Unit",     partEquip:"Main motor bearing",        deptResp:"Maintenance", immCause:"Bearing fatigue",                     rootCause:"Exceeded 3000hr service interval",           corrective:"Replaced main motor bearing assembly",         futureAction:"Reduce PM interval from 3000hr to 2500hr",     actionParty:"Maint. Supervisor" },
  { id:2, rig:"Rig 104", date:"08-Jun-2025", type:"Abraj",       hrs:6.0, system:"Mud Pumps",  parentEquip:"Mud Pump #2",        partEquip:"Liner and piston assembly",  deptResp:"Maintenance", immCause:"Liner washout",                       rootCause:"Abrasive mud with high sand content",        corrective:"Replaced liner and piston assembly",           futureAction:"Switch to ceramic liners for abrasive sections", actionParty:"Drilling Engr." },
  { id:3, rig:"Rig 107", date:"12-Jun-2025", type:"Contractual", hrs:3.0, system:"Contractual",parentEquip:"",                   partEquip:"",                          deptResp:"",            immCause:"",                                    rootCause:"",                                          corrective:"",                                             futureAction:"",                                             actionParty:"Client Rep",   contractualProcess:"Waiting on cement crew — delayed mobilisation from client side" },
  { id:4, rig:"Rig 103", date:"15-Jun-2025", type:"Abraj",       hrs:2.5, system:"Electrical", parentEquip:"SCR System",         partEquip:"SCR cabinet #3 thyristor",  deptResp:"Electrical",  immCause:"Thyristor failure due to power surge", rootCause:"No surge protection on SCR inputs",         corrective:"Replaced SCR thyristor stack",                 futureAction:"Install surge protection on SCR inputs",       actionParty:"Electrical Engr." },
  { id:5, rig:"Rig 109", date:"02-May-2025", type:"Abraj",       hrs:8.0, system:"Drawworks",  parentEquip:"Drawworks",          partEquip:"Main brake assembly",        deptResp:"Maintenance", immCause:"Brake lining worn beyond limit",       rootCause:"PM missed due to rig move scheduling conflict", corrective:"Replaced brake lining — both sides",           futureAction:"Mandatory brake check before every rig move",  actionParty:"OIM" },
  { id:6, rig:"Rig 105", date:"20-May-2025", type:"Contractual", hrs:5.0, system:"Contractual",parentEquip:"",                   partEquip:"",                          deptResp:"",            immCause:"",                                    rootCause:"",                                          corrective:"",                                             futureAction:"",                                             actionParty:"Client Rep",   contractualProcess:"Client HSE hold — third-party safety audit on location" },
  { id:7, rig:"Rig 112", date:"10-Jun-2025", type:"Abraj",       hrs:3.5, system:"BOP",        parentEquip:"BOP Stack",          partEquip:"Annular preventer seal",     deptResp:"Drilling",    immCause:"Seal leak during pressure test",       rootCause:"Seal age and wear — past replacement schedule", corrective:"Replaced annular seal element",                futureAction:"Quarterly BOP seal inspection added to PM",    actionParty:"Drilling Engr." },
];

// ── SHEET 6: UTILIZATION ──────────────────────────────────
export const utilData = [
  {m:"Jan",op:87,rd:5,bkd:3,zero:2,sp:3},{m:"Feb",op:91,rd:3,bkd:2,zero:1,sp:3},
  {m:"Mar",op:89,rd:4,bkd:4,zero:1,sp:2},{m:"Apr",op:85,rd:6,bkd:5,zero:2,sp:2},
  {m:"May",op:92,rd:3,bkd:2,zero:1,sp:2},{m:"Jun",op:94,rd:2,bkd:1,zero:1,sp:2},
  {m:"Jul",op:90,rd:4,bkd:3,zero:1,sp:2},{m:"Aug",op:88,rd:5,bkd:3,zero:2,sp:2},
  {m:"Sep",op:93,rd:3,bkd:2,zero:1,sp:1},{m:"Oct",op:91,rd:4,bkd:2,zero:1,sp:2},
  {m:"Nov",op:89,rd:5,bkd:3,zero:2,sp:1},{m:"Dec",op:86,rd:6,bkd:4,zero:2,sp:2},
];

// ── SHEET 7: WELL TRACKING ────────────────────────────────
export const wellTracking = [
  { rig:"103", well:"HAJAL NE 20H1", field:"NWT",  spud:"14-May-2025", rigMoveDate:"28-Apr-2025", releaseDate:"",            tTD:8400, cTD:6342, afeD:55, actD:32, contractingCo:"PDO",  status:"Drilling",   year:2025, month:"Jun" },
  { rig:"104", well:"SF-41",         field:"SFN",  spud:"20-Apr-2025", rigMoveDate:"15-Apr-2025", releaseDate:"",            tTD:9200, cTD:8105, afeD:62, actD:45, contractingCo:"OXY",  status:"Completion", year:2025, month:"Jun" },
  { rig:"105", well:"HAJAL NE 20H1", field:"NWT",  spud:"22-May-2025", rigMoveDate:"14-May-2025", releaseDate:"",            tTD:7800, cTD:2790, afeD:50, actD:28, contractingCo:"PDO",  status:"Drilling",   year:2025, month:"Jun" },
  { rig:"302", well:"Yibal-611",     field:"YIB",  spud:"30-Apr-2025", rigMoveDate:"25-Apr-2025", releaseDate:"",            tTD:9600, cTD:7890, afeD:58, actD:30, contractingCo:"PDO",  status:"Drilling",   year:2025, month:"Jun" },
  { rig:"106", well:"Maurid-SW-2",   field:"MRD",  spud:"08-Jun-2025", rigMoveDate:"01-Jun-2025", releaseDate:"",            tTD:5800, cTD:420,  afeD:35, actD:10, contractingCo:"CCED", status:"Drilling",   year:2025, month:"Jun" },
  { rig:"303", well:"BRNW 76",       field:"BRN",  spud:"03-Dec-2022", rigMoveDate:"25-Nov-2022", releaseDate:"07-Feb-2023", tTD:5044, cTD:5044, afeD:70, actD:66, contractingCo:"PDO",  status:"Released",   year:2023, month:"Jan" },
  { rig:"107", well:"Qata-182",      field:"QAT",  spud:"15-Apr-2025", rigMoveDate:"12-Apr-2025", releaseDate:"",            tTD:6500, cTD:5180, afeD:45, actD:18, contractingCo:"PDO",  status:"Drilling",   year:2025, month:"Jun" },
  { rig:"108", well:"Thamoud-91",    field:"THM",  spud:"24-May-2025", rigMoveDate:"20-May-2025", releaseDate:"",            tTD:5200, cTD:4200, afeD:40, actD:25, contractingCo:"OXY",  status:"Drilling",   year:2025, month:"Jun" },
];

// ── SHEET 8: NPT BILLING (rate-category hours per rig/month) ─
export const nptBillingData = [
  { rig:"Rig 103", month:"Jun", year:2025, oprRate:700, reduceRate:24,  repairRate:8,  zeroRate:0, specialRate:0,  rigMoveReduce:0,  rigMove:0,   aMaint:12, aMaintZero:0  },
  { rig:"Rig 104", month:"Jun", year:2025, oprRate:672, reduceRate:0,   repairRate:16, zeroRate:8, specialRate:0,  rigMoveReduce:0,  rigMove:0,   aMaint:24, aMaintZero:24 },
  { rig:"Rig 105", month:"Jun", year:2025, oprRate:696, reduceRate:0,   repairRate:4,  zeroRate:0, specialRate:0,  rigMoveReduce:0,  rigMove:0,   aMaint:12, aMaintZero:0  },
  { rig:"Rig 106", month:"Jun", year:2025, oprRate:528, reduceRate:0,   repairRate:0,  zeroRate:0, specialRate:0,  rigMoveReduce:48, rigMove:168, aMaint:0,  aMaintZero:0  },
  { rig:"Rig 107", month:"Jun", year:2025, oprRate:696, reduceRate:0,   repairRate:12, zeroRate:0, specialRate:0,  rigMoveReduce:0,  rigMove:0,   aMaint:12, aMaintZero:0  },
  { rig:"Rig 108", month:"Jun", year:2025, oprRate:660, reduceRate:12,  repairRate:8,  zeroRate:4, specialRate:0,  rigMoveReduce:0,  rigMove:0,   aMaint:16, aMaintZero:8  },
  { rig:"Rig 109", month:"Jun", year:2025, oprRate:720, reduceRate:0,   repairRate:0,  zeroRate:0, specialRate:0,  rigMoveReduce:0,  rigMove:0,   aMaint:24, aMaintZero:0  },
  { rig:"Rig 112", month:"Jun", year:2025, oprRate:684, reduceRate:0,   repairRate:12, zeroRate:0, specialRate:0,  rigMoveReduce:0,  rigMove:0,   aMaint:24, aMaintZero:0  },
  { rig:"Rig 201", month:"Jun", year:2025, oprRate:696, reduceRate:0,   repairRate:0,  zeroRate:0, specialRate:24, rigMoveReduce:0,  rigMove:0,   aMaint:0,  aMaintZero:0  },
  { rig:"Rig 302", month:"Jun", year:2025, oprRate:708, reduceRate:0,   repairRate:0,  zeroRate:0, specialRate:0,  rigMoveReduce:0,  rigMove:0,   aMaint:12, aMaintZero:0  },
];

// ── SHEET 9: FUEL ─────────────────────────────────────────
export const fuelTrend = [
  {m:"Jan",con:48200,rec:52000},{m:"Feb",con:45100,rec:48000},{m:"Mar",con:51300,rec:50000},
  {m:"Apr",con:47600,rec:50000},{m:"May",con:49800,rec:52000},{m:"Jun",con:46200,rec:48000},
  {m:"Jul",con:50100,rec:52000},{m:"Aug",con:47800,rec:50000},{m:"Sep",con:45600,rec:48000},
  {m:"Oct",con:48900,rec:51000},{m:"Nov",con:46300,rec:49000},{m:"Dec",con:44100,rec:46000},
];
export const fuelData = [
  { id:1,  rig:"Rig 103", year:2025, month:"Jun", openingStock:14500, received:5000, rigEngine:1800, campEngine:180, invoiceClient:0,   otherSite:120, vehicles:0,   consumed:2100, closingBalance:17400, po1:"PO-2025-FUL-0041", po2:"", po3:"" },
  { id:2,  rig:"Rig 104", year:2025, month:"Jun", openingStock:12800, received:6000, rigEngine:2100, campEngine:200, invoiceClient:300, otherSite:150, vehicles:50,  consumed:2800, closingBalance:16000, po1:"PO-2025-FUL-0042", po2:"", po3:"" },
  { id:3,  rig:"Rig 105", year:2025, month:"Jun", openingStock:11200, received:5500, rigEngine:1950, campEngine:175, invoiceClient:0,   otherSite:100, vehicles:75,  consumed:2300, closingBalance:14400, po1:"PO-2025-FUL-0043", po2:"", po3:"" },
  { id:4,  rig:"Rig 106", year:2025, month:"Jun", openingStock:9800,  received:8000, rigEngine:2400, campEngine:220, invoiceClient:400, otherSite:180, vehicles:100, consumed:3300, closingBalance:14500, po1:"PO-2025-FUL-0044", po2:"PO-2025-FUL-0044B", po3:"" },
  { id:5,  rig:"Rig 107", year:2025, month:"Jun", openingStock:13100, received:5000, rigEngine:1700, campEngine:160, invoiceClient:0,   otherSite:90,  vehicles:50,  consumed:2000, closingBalance:16100, po1:"PO-2025-FUL-0045", po2:"", po3:"" },
  { id:6,  rig:"Rig 108", year:2025, month:"Jun", openingStock:10500, received:5500, rigEngine:2050, campEngine:190, invoiceClient:0,   otherSite:110, vehicles:75,  consumed:2425, closingBalance:13575, po1:"PO-2025-FUL-0046", po2:"", po3:"" },
  { id:7,  rig:"Rig 109", year:2025, month:"Jun", openingStock:15200, received:4500, rigEngine:1600, campEngine:155, invoiceClient:0,   otherSite:80,  vehicles:65,  consumed:1900, closingBalance:17800, po1:"PO-2025-FUL-0047", po2:"", po3:"" },
  { id:8,  rig:"Rig 112", year:2025, month:"Jun", openingStock:12000, received:6000, rigEngine:2200, campEngine:210, invoiceClient:0,   otherSite:130, vehicles:60,  consumed:2600, closingBalance:15400, po1:"PO-2025-FUL-0048", po2:"", po3:"" },
  { id:9,  rig:"Rig 201", year:2025, month:"Jun", openingStock:11500, received:5000, rigEngine:1850, campEngine:170, invoiceClient:250, otherSite:95,  vehicles:85,  consumed:2450, closingBalance:14050, po1:"PO-2025-FUL-0049", po2:"", po3:"" },
  { id:10, rig:"Rig 302", year:2025, month:"Jun", openingStock:14800, received:5500, rigEngine:2000, campEngine:185, invoiceClient:0,   otherSite:105, vehicles:70,  consumed:2360, closingBalance:17940, po1:"PO-2025-FUL-0050", po2:"", po3:"" },
];

// ── SHEET 10: REVENUE ─────────────────────────────────────
export const revData = [
  {m:"Jan",act:3.2,bud:3.5,npt:0.18},{m:"Feb",act:3.4,bud:3.5,npt:0.12},
  {m:"Mar",act:3.8,bud:3.6,npt:0.09},{m:"Apr",act:3.1,bud:3.5,npt:0.22},
  {m:"May",act:3.6,bud:3.5,npt:0.15},{m:"Jun",act:3.9,bud:3.7,npt:0.08},
  {m:"Jul",act:3.7,bud:3.6,npt:0.11},{m:"Aug",act:3.5,bud:3.6,npt:0.14},
  {m:"Sep",act:3.8,bud:3.7,npt:0.09},{m:"Oct",act:4.0,bud:3.8,npt:0.07},
  {m:"Nov",act:3.6,bud:3.7,npt:0.13},{m:"Dec",act:3.4,bud:3.5,npt:0.16},
];
export const revenueData = [
  { rig:"Rig 103", month:"Jun", year:2025, actual:508000, fuel:19500, budgeted:495000, nptRepair:8000,  nptZero:0,    comments:"" },
  { rig:"Rig 104", month:"Jun", year:2025, actual:480000, fuel:21000, budgeted:495000, nptRepair:16000, nptZero:8000, comments:"BKD hours affected revenue" },
  { rig:"Rig 105", month:"Jun", year:2025, actual:516000, fuel:18000, budgeted:495000, nptRepair:4000,  nptZero:0,    comments:"" },
  { rig:"Rig 106", month:"Jun", year:2025, actual:390000, fuel:22000, budgeted:495000, nptRepair:0,     nptZero:0,    comments:"Rig move month — reduced days" },
  { rig:"Rig 107", month:"Jun", year:2025, actual:504000, fuel:18500, budgeted:495000, nptRepair:12000, nptZero:0,    comments:"" },
  { rig:"Rig 108", month:"Jun", year:2025, actual:468000, fuel:20000, budgeted:495000, nptRepair:8000,  nptZero:4000, comments:"Top drive NPT impacted" },
  { rig:"Rig 109", month:"Jun", year:2025, actual:518400, fuel:17000, budgeted:495000, nptRepair:0,     nptZero:0,    comments:"Full month — no NPT" },
  { rig:"Rig 112", month:"Jun", year:2025, actual:494400, fuel:19800, budgeted:495000, nptRepair:12000, nptZero:0,    comments:"BOP seal NPT" },
  { rig:"Rig 201", month:"Jun", year:2025, actual:502000, fuel:20500, budgeted:495000, nptRepair:0,     nptZero:0,    comments:"Special rate days included" },
  { rig:"Rig 302", month:"Jun", year:2025, actual:511200, fuel:19200, budgeted:495000, nptRepair:0,     nptZero:0,    comments:"" },
];

// ── SHEET 11: CRM ─────────────────────────────────────────
export const crmData = RIGS.slice(0,10).map((r,i)=>({rig:r.replace("Rig ",""),score:Math.max(68,98-i*3)}));
export const crmMonthlyData = [
  { rig:"Rig 103", year:2025, scores:{Jan:100,Feb:100,Mar:96, Apr:100,May:92, Jun:96, Jul:88, Aug:96, Sep:96, Oct:100,Nov:92, Dec:100}, avg:96 },
  { rig:"Rig 104", year:2025, scores:{Jan:92, Feb:0,  Mar:96, Apr:92, May:84, Jun:88, Jul:80, Aug:0,  Sep:100,Oct:100,Nov:92, Dec:84},  avg:84 },
  { rig:"Rig 105", year:2025, scores:{Jan:92, Feb:100,Mar:100,Apr:100,May:100,Jun:100,Jul:100,Aug:100,Sep:100,Oct:100,Nov:100,Dec:100}, avg:99 },
  { rig:"Rig 106", year:2025, scores:{Jan:96, Feb:88, Mar:92, Apr:84, May:88, Jun:84, Jul:80, Aug:88, Sep:92, Oct:88, Nov:84, Dec:80},  avg:87 },
  { rig:"Rig 107", year:2025, scores:{Jan:84, Feb:88, Mar:84, Apr:88, May:80, Jun:84, Jul:76, Aug:80, Sep:84, Oct:80, Nov:76, Dec:80},  avg:82 },
  { rig:"Rig 108", year:2025, scores:{Jan:68, Feb:72, Mar:68, Apr:72, May:64, Jun:68, Jul:64, Aug:68, Sep:72, Oct:68, Nov:64, Dec:68},  avg:68 },
  { rig:"Rig 109", year:2025, scores:{Jan:92, Feb:96, Mar:92, Apr:96, May:92, Jun:96, Jul:88, Aug:92, Sep:96, Oct:92, Nov:88, Dec:92},  avg:93 },
  { rig:"Rig 110", year:2025, scores:{Jan:88, Feb:84, Mar:88, Apr:84, May:80, Jun:88, Jul:84, Aug:80, Sep:88, Oct:84, Nov:80, Dec:84},  avg:85 },
  { rig:"Rig 111", year:2025, scores:{Jan:80, Feb:76, Mar:80, Apr:76, May:72, Jun:76, Jul:72, Aug:76, Sep:80, Oct:76, Nov:72, Dec:76},  avg:76 },
  { rig:"Rig 112", year:2025, scores:{Jan:96, Feb:92, Mar:96, Apr:92, May:96, Jun:92, Jul:96, Aug:92, Sep:96, Oct:100,Nov:96, Dec:92},  avg:95 },
];

// ── SHEET 12: BILLING ACCRUALS ────────────────────────────
export const billingAccrualsData = [
  { sno:1, rig:"Rig 201", wbs:"C.AA.QAL.DD.03.WDD.31660", well:"TIBR_37",      network:30228943, oppHrs:270, reduceHrs:0,  bkdHrs:0,  zeroHrs:0, specialRate:0, stacked:0, rigMove:0,   totalHrs:270, rigMoveAmt:0,      fieldName:"TIBR_37",     area:"TIBR", date:"1-12 Dec",  remarks:"" },
  { sno:2, rig:"Rig 201", wbs:"C.AA.QAL.DD.03.WDD.34215", well:"Raba 42",      network:30231112, oppHrs:411, reduceHrs:0,  bkdHrs:0,  zeroHrs:0, specialRate:0, stacked:0, rigMove:63,  totalHrs:474, rigMoveAmt:480571, fieldName:"RB24",        area:"Raba", date:"12-31 Dec", remarks:"" },
  { sno:3, rig:"Rig 202", wbs:"C.AA.QAL.DD.03.WDD.31633", well:"RBE 34",       network:30229020, oppHrs:240, reduceHrs:0,  bkdHrs:0,  zeroHrs:0, specialRate:0, stacked:0, rigMove:0,   totalHrs:240, rigMoveAmt:0,      fieldName:"RABA EAST 34",area:"RABA", date:"1-10 Dec",  remarks:"" },
  { sno:4, rig:"Rig 202", wbs:"C.AA.QAL.DD.03WDD-24783",  well:"RBE 34",       network:30229470, oppHrs:504, reduceHrs:0,  bkdHrs:0,  zeroHrs:0, specialRate:0, stacked:0, rigMove:0,   totalHrs:504, rigMoveAmt:0,      fieldName:"RABA EAST 34",area:"RABA", date:"11-31 Dec", remarks:"" },
  { sno:5, rig:"Rig 103", wbs:"WBS-2025-NWT-103",         well:"HAJAL NE 20H1",network:30228001, oppHrs:700, reduceHrs:24, bkdHrs:0,  zeroHrs:0, specialRate:0, stacked:0, rigMove:0,   totalHrs:724, rigMoveAmt:0,      fieldName:"NWT",         area:"NWT",  date:"Jun 2025",  remarks:"" },
  { sno:6, rig:"Rig 104", wbs:"WBS-2025-SFN-104",         well:"SF-41",         network:30228002, oppHrs:672, reduceHrs:0,  bkdHrs:16, zeroHrs:8, specialRate:0, stacked:0, rigMove:0,   totalHrs:696, rigMoveAmt:0,      fieldName:"SFN",         area:"SFN",  date:"Jun 2025",  remarks:"BKD and zero hrs" },
  { sno:7, rig:"Rig 106", wbs:"WBS-2025-MRD-106",         well:"Maurid-SW-2",   network:30228003, oppHrs:528, reduceHrs:0,  bkdHrs:0,  zeroHrs:0, specialRate:0, stacked:0, rigMove:216, totalHrs:744, rigMoveAmt:630000, fieldName:"MRD",         area:"MRD",  date:"Jun 2025",  remarks:"Rig move first 9 days" },
  { sno:8, rig:"Rig 302", wbs:"WBS-2025-YIB-302",         well:"Yibal-611",     network:30228004, oppHrs:708, reduceHrs:0,  bkdHrs:0,  zeroHrs:0, specialRate:0, stacked:0, rigMove:0,   totalHrs:708, rigMoveAmt:0,      fieldName:"YIB",         area:"YIB",  date:"Jun 2025",  remarks:"" },
];

// ── DASHBOARD / FLEET ─────────────────────────────────────
export const fleetRows = [
  {rig:"103",well:"HAJAL NE 20H1", status:"Drilling",   depth:"6,342", days:32, rate:"Op",      csat:96, npt:2.1},
  {rig:"104",well:"SF-41",         status:"Completion", depth:"8,105", days:45, rate:"Op",      csat:84, npt:4.8},
  {rig:"105",well:"HAJAL NE 20H1", status:"Drilling",   depth:"2,790", days:28, rate:"Op",      csat:99, npt:0.8},
  {rig:"106",well:"Maurid-SW-2",   status:"Rig Move",   depth:"—",     days:9,  rate:"Special", csat:87, npt:1.2},
  {rig:"107",well:"Qata-182",      status:"Drilling",   depth:"5,180", days:18, rate:"Op",      csat:82, npt:3.4},
  {rig:"108",well:"Thamoud-91",    status:"Drilling",   depth:"4,200", days:25, rate:"Op",      csat:68, npt:5.8},
  {rig:"109",well:"Yibal-612",     status:"Drilling",   depth:"7,100", days:14, rate:"Op",      csat:93, npt:0.0},
  {rig:"112",well:"SF-65",         status:"Drilling",   depth:"6,342", days:32, rate:"Op",      csat:95, npt:1.9},
  {rig:"201",well:"TIBR_37",       status:"Drilling",   depth:"3,450", days:12, rate:"Op",      csat:88, npt:2.6},
  {rig:"301",well:"—",             status:"Stacked",    depth:"—",     days:0,  rate:"Stack",   csat:72, npt:0.0},
  {rig:"302",well:"Yibal-611",     status:"Drilling",   depth:"7,890", days:30, rate:"Op",      csat:95, npt:1.3},
  {rig:"203",well:"Saih Rawl-8",   status:"Rig Move",   depth:"—",     days:1,  rate:"Special", csat:91, npt:0.5},
];

export const nptPie = [
  {n:"Drawworks", v:28, c:"#2D7A89"},
  {n:"Mud Pumps",  v:19, c:"#5B8DB8"},
  {n:"Top Drive",  v:15, c:"#3A9E7E"},
  {n:"Electrical", v:22, c:"#D4A24C"},
  {n:"BOP",        v:16, c:"#B06B6F"},
];