// // 'use client';

// // import React, { useMemo, useState } from 'react';
// // import { API_BASE_URL } from '../../config';

// // // ---------------------------- Types ----------------------------
// // type PayslipItem = {
// //   id: number;
// //   payroll_id: number;
// //   label: string;
// //   amount: string;
// //   type: string; // Earning | Deduction | Statutory | Employer Contribution
// // };

// // type EmployerContribution = {
// //   id: number;
// //   payroll_id: number;
// //   label: string;
// //   amount: string;
// //   type: string;
// // };

// // type Payroll = {
// //   payroll_id: number;
// //   period_year: number;
// //   period_month: number;
// //   employee_id: number;
// //   employee_name: string;
// //   employee_no: string | null;
// //   department_name: string | null;
// //   position: string | null;
// //   company_id: number;
// //   company_name: string | null;

// //   basic_salary: string;
// //   total_allowance: string;
// //   gross_salary: string;
// //   total_deduction: string;
// //   net_salary: string;

// //   epf_employee: string;
// //   epf_employer: string;
// //   socso_employee: string;
// //   socso_employer: string;
// //   eis_employee: string;
// //   eis_employer: string;
// //   pcb: string;

// //   status_code: string;
// //   ic_passport_no: string | null;  // mixed IC/Passport field in your API
// //   tax_no: string | null;          // employee tax ref (TIN)
// //   joined_date: string | null;
// //   resigned_date: string | null;

// //   bank_name: string | null;
// //   bank_code: string | null;
// //   bank_account_no: string | null;
// //   bank_account_name: string | null;
// //   currency: string | null;

// //   created_at: string;
// //   updated_at: string;
// // };

// // type AdjustmentRow = {
// //   payroll: Payroll;
// //   payslip_items: PayslipItem[];
// //   employer_contributions: EmployerContribution[];
// //   versions: unknown[];
// //   audit_log: unknown[];
// //   success: boolean;
// // };

// // type AdjustmentsResponse = {
// //   total: number;
// //   page: number;
// //   limit: number;
// //   data: AdjustmentRow[];
// // };

// // type Grouped = {
// //   employeeId: number;
// //   employeeName: string;
// //   // keep the last payroll row we saw (to pick up identity fields like tax_no)
// //   lastPayroll: Payroll;
// //   items: AdjustmentRow[];
// //   sums: {
// //     gross: number;
// //     epf: number;
// //     socso: number;
// //     eis: number;
// //     pcb: number;
// //     cp38: number;
// //   };
// // };

// // // ------------------------- Helpers -------------------------
// // const n = (v: unknown) => {
// //   if (v == null) return 0;
// //   if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
// //   if (typeof v === 'string') {
// //     const num = Number(v);
// //     return Number.isFinite(num) ? num : 0;
// //   }
// //   return 0;
// // };

// // const money = (v: number) =>
// //   (v ?? 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// // function dmy(date: string | null, fallback: string): string {
// //   if (!date) return fallback;
// //   const dt = new Date(date);
// //   if (isNaN(dt.getTime())) return fallback;
// //   const dd = String(dt.getDate()).padStart(2, '0');
// //   const mm = String(dt.getMonth() + 1).padStart(2, '0');
// //   const yyyy = dt.getFullYear();
// //   return `${dd}/${mm}/${yyyy}`;
// // }

// // type DrawSpec = { page: number; x: number; y: number; align?: 'left'|'right'; size?: number };
// // type LayoutMap = Record<string, DrawSpec>;

// // const layoutEA2021: LayoutMap = {
// //   year:        { page: 0, x: 330, y: 100, size: 10 },     // “FOR THE YEAR ENDED 31 DECEMBER …”
// //   employerNo:  { page: 0, x: 120, y: 125, size: 10 },     // Employer’s No. (E)
// //   serialNo:    { page: 0, x: 470, y: 95,  size: 10 },     // Serial No.
// //   lhdnmBranch: { page: 0, x: 420, y: 125, size: 10 },     // LHDNM Branch

// //   // A — particulars (left column)
// //   empName:     { page: 0, x: 135, y: 165 },
// //   empTIN:      { page: 0, x: 135, y: 185 },               // Employee’s Income Tax No. / TIN
// //   empIC:       { page: 0, x: 135, y: 205 },               // New I.C. No. / Passport (your API mixes in ic_passport_no)
// //   empFrom:     { page: 0, x: 135, y: 225 },               // Date of commencement
// //   empTo:       { page: 0, x: 410, y: 225 },               // Date of cessation (or 31/12/YYYY)

// //   // B — Employment income, benefits & living accommodation (amounts right-aligned)
// //   B1:          { page: 0, x: 540, y: 278, align: 'right' }, // 1(a) Gross salary/leave/OT
// //   B2:          { page: 0, x: 540, y: 296, align: 'right' }, // 1(b) Fees/commission/bonus
// //   B3:          { page: 0, x: 540, y: 314, align: 'right' }, // 1(c) Tips/perq/other allowances (taxable)
// //   B4:          { page: 0, x: 540, y: 350, align: 'right' }, // 3  Benefits-in-kind
// //   B5:          { page: 0, x: 540, y: 368, align: 'right' }, // 4  Value of living accommodation
// //   B6:          { page: 0, x: 540, y: 386, align: 'right' }, // 5/6/others (refund/compensation/etc.)


// //   // D — Total deduction (MTD/CP38/Zakat/etc.) — these are the “PCB/CP38 etc.” lines in Pin. 2021
// //   D1_mtd:      { page: 1, x: 540, y: 170, align: 'right' }, // 1. Monthly tax deductions (MTD/PCB)
// //   D2_cp38:     { page: 1, x: 540, y: 188, align: 'right' }, // 2. CP38
// //   D3_zakat:    { page: 1, x: 540, y: 206, align: 'right' }, // 3. Zakat via salary deduction
// //   // (D4/D5/D6 exist on the form; if you later have data, add positions similarly.)

// //   // E — Contributions paid by employee (EPF / SOCSO)
// //   E1_epfAmt:   { page: 1, x: 540, y: 428, align: 'right' }, // EPF compulsory contribution (employee’s share)
// //   E2_socsoAmt: { page: 1, x: 540, y: 466, align: 'right' }, // SOCSO (employee’s share) — include EIS in this total

// //   // F — Total tax-exempt allowances/perq/gifts/benefits
// //   F_total:     { page: 1, x: 540, y: 130, align: 'right' },

// //   // Signatory (bottom of page 2)
// //   signName:    { page: 1, x: 140, y: 740 },
// //   signDesig:   { page: 1, x: 140, y: 758 },
// //   signDate:    { page: 1, x: 420, y: 740 },
// // }


// // // --------------------------- Page ---------------------------
// // export default function EAFromAdjustments_Pin2021() {
// //   const now = new Date();
// //   const [year, setYear] = useState<number>(now.getFullYear());
// //   const [month, setMonth] = useState<number>(now.getMonth() + 1);
// //   const [loading, setLoading] = useState(false);
// //   const [rows, setRows] = useState<AdjustmentRow[]>([]);
// //   const [error, setError] = useState<string>('');

// //   // UI inputs for employer/signatory (since not in your API)
// //   const [employerNo, setEmployerNo] = useState<string>('E 1234567890');
// //   const [lhdnmBranch, setLhdnmBranch] = useState<string>('PJ');
// //   const [serialNo, setSerialNo] = useState<string>('B0001');
// //   const [signName, setSignName] = useState<string>('Finance Manager');
// //   const [signDesig, setSignDesig] = useState<string>('Finance Manager');
// //   const [signDate, setSignDate] = useState<string>('28/02/' + (year + 1));
// //   const [debug, setDebug] = useState<boolean>(false);

// //   const grouped = useMemo<Grouped[]>(() => {
// //     const m = new Map<number, Grouped>();
// //     for (const r of rows) {
// //       const p = r.payroll;
// //       const key = p.employee_id;
// //       if (!m.has(key)) {
// //         m.set(key, {
// //           employeeId: key,
// //           employeeName: p.employee_name || `Emp ${key}`,
// //           lastPayroll: p,
// //           items: [],
// //           sums: { gross: 0, epf: 0, socso: 0, eis: 0, pcb: 0, cp38: 0 },
// //         });
// //       }
// //       const g = m.get(key)!;
// //       g.items.push(r);

// //       g.lastPayroll = p; // keep latest to show identity fields
// //       g.sums.gross += n(p.gross_salary);
// //       g.sums.epf += n(p.epf_employee);
// //       g.sums.socso += n(p.socso_employee);
// //       g.sums.eis += n(p.eis_employee);
// //       g.sums.pcb += n(p.pcb);
// //       // If you have CP38, add it here. Not in your sample, so it remains 0.
// //     }
// //     return Array.from(m.values());
// //   }, [rows]);

// //   // Fetch ALL pages
// //   async function fetchAll() {
// //     setError('');
// //     setLoading(true);
// //     try {
// //       const qs = new URLSearchParams({
// //         period_month: String(month),
// //         period_year: String(year),
// //         all_data: 'true',
// //         status: 'DRAFT',
// //         page: '1',
// //         limit: '50',
// //       });
// //       const firstUrl = `${API_BASE_URL}/api/payroll/adjustments?${qs.toString()}`;
// //       const p1 = await fetch(firstUrl, { cache: 'no-store' });
// //       if (!p1.ok) throw new Error(`HTTP ${p1.status}`);
// //       const j1: AdjustmentsResponse = await p1.json();

// //       const all: AdjustmentRow[] = [...(j1.data || [])];
// //       const total = j1.total ?? all.length;
// //       const limit = j1.limit ?? all.length;
// //       const pages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

// //       for (let i = 2; i <= pages; i++) {
// //         qs.set('page', String(i));
// //         const url = `${API_BASE_URL}/api/payroll/adjustments?${qs.toString()}`;
// //         const r = await fetch(url, { cache: 'no-store' });
// //         if (!r.ok) throw new Error(`HTTP ${r.status} (page ${i})`);
// //         const ji: AdjustmentsResponse = await r.json();
// //         all.push(...(ji.data ?? []));
// //       }
// //       setRows(all);
// //     } catch (e: any) {
// //       setError(e?.message || String(e));
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   // Render an EA Pin.2021 overlay using the official template placed under /public/ea/EA_Pin2021_2.pdf
// // async function generateEA2021(group: Grouped) {
// //   const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');

// //   // Load the official template (public/ea/EA_Pin2021_2.pdf)
// //   const res = await fetch('/ea/EA_Pin2021_2.pdf');
// //   if (!res.ok) {
// //     alert('Failed to load /ea/EA_Pin2021_2.pdf');
// //     return;
// //   }
// //   const pdf = await PDFDocument.load(await res.arrayBuffer());

// //   // Ensure 2 pages exist
// //   if (pdf.getPageCount() < 2) {
// //     const [p0] = await pdf.copyPages(pdf, [0]);
// //     pdf.addPage(p0);
// //   }

// //   const font = await pdf.embedFont(StandardFonts.Helvetica);
// //   const getPage = (i: number) => {
// //     while (i >= pdf.getPageCount()) pdf.addPage([595, 842]);
// //     return pdf.getPage(i);
// //   };

// //   const draw = (key: keyof typeof layoutEA2021, text: string, size = layoutEA2021[key].size ?? 10) => {
// //     const spec = layoutEA2021[key];
// //     const page = getPage(spec.page);
// //     const { height } = page.getSize();
// //     const val = text ?? '';
// //     const tw = font.widthOfTextAtSize(val, size);
// //     const x = spec.align === 'right' ? spec.x - tw : spec.x;
// //     const y = height - spec.y;
// //     page.drawText(val, { x, y, size, font, color: rgb(0, 0, 0) });
// //   };

// //   // ===== Map your month data (mock) -> form fields =====
// //   const p = group.lastPayroll;
// //   const fmt = (x: number) => (x ?? 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// //   const from = p.joined_date ? dmy(p.joined_date, `01/01/${p.period_year}`) : `01/01/${p.period_year}`;
// //   const to   = p.resigned_date ? dmy(p.resigned_date, `31/12/${p.period_year}`) : `31/12/${p.period_year}`;

// //   // B — mock (replace with year roll-up later)
// //   const B1 = group.sums.gross;
// //   const B2 = 0, B3 = 0, B4 = 0, B5 = 0, B6 = 0;

// //   // D — totals the form expects (Pin. 2021)
// //   const D1_mtd   = group.sums.pcb;      // MTD/PCB via payroll
// //   const D2_cp38  = group.sums.cp38;     // CP38 (if any)
// //   const D3_zakat = 0;                   // Zakat via salary (wire when available)

// //   // E — EPF & SOCSO (Pin. 2021 only has these two lines; include EIS inside SOCSO amount)
// //   const E1_epfAmt   = group.sums.epf;
// //   const E2_socsoAmt = group.sums.socso + group.sums.eis;

// //   const F_total = 0;                    // Tax-exempt (wire from your exemptions set)

// //   // ===== Header / A =====
// //   draw('year', String(p.period_year));
// //   draw('employerNo', /* your employer E number */ 'E 1234567890');
// //   draw('serialNo', /* optional */ 'B0001');
// //   draw('lhdnmBranch', /* optional */ 'PJ');

// //   draw('empName', p.employee_name || '');
// //   draw('empTIN',  p.tax_no || '');
// //   draw('empIC',   p.ic_passport_no || '');
// //   draw('empFrom', from);
// //   draw('empTo',   to);

// //   // ===== B =====
// //   draw('B1', fmt(B1));
// //   draw('B2', fmt(B2));
// //   draw('B3', fmt(B3));
// //   draw('B4', fmt(B4));
// //   draw('B5', fmt(B5));
// //   draw('B6', fmt(B6));

// //   // ===== D =====
// //   draw('D1_mtd',   fmt(D1_mtd));
// //   draw('D2_cp38',  fmt(D2_cp38));
// //   draw('D3_zakat', fmt(D3_zakat));

// //   // ===== E =====
// //   draw('E1_epfAmt',   fmt(E1_epfAmt));
// //   draw('E2_socsoAmt', fmt(E2_socsoAmt));

// //   // ===== F + signatory =====
// //   draw('F_total', fmt(F_total));
// //   draw('signName',  'Finance Manager');
// //   draw('signDesig', 'Finance Manager');
// //   draw('signDate',  `28/02/${p.period_year + 1}`);

// //   // Download
// //   const dataUri = await pdf.saveAsBase64({ dataUri: true });
// //   const a = document.createElement('a');
// //   a.href = dataUri;
// //   a.download = `EA_${group.employeeId}_${p.period_year}_Pin2021.pdf`;
// //   document.body.appendChild(a);
// //   a.click();
// //   a.remove();
// // }


// //   return (
// //     <div className="p-6 space-y-6">
// //       <h1 className="text-xl font-semibold">EA (C.P.8A) – Pin. 2021 Generator (from DRAFT Adjustments)</h1>

// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //         <div className="card bg-base-100 shadow">
// //           <div className="card-body">
// //             <h2 className="card-title">Filters</h2>
// //             <div className="flex flex-col gap-2">
// //               <label className="text-sm">Year</label>
// //               <input type="number" className="input input-bordered" value={year} onChange={e => setYear(Number(e.target.value))} />
// //               <label className="text-sm">Month (1–12)</label>
// //               <input type="number" min={1} max={12} className="input input-bordered" value={month} onChange={e => setMonth(Number(e.target.value))} />
// //               <button className="btn btn-primary mt-2" onClick={fetchAll} disabled={loading}>
// //                 {loading ? 'Loading…' : 'Fetch DRAFT adjustments'}
// //               </button>
// //               {error && <div className="alert alert-error mt-2">{error}</div>}
// //             </div>
// //           </div>
// //         </div>

// //         <div className="card bg-base-100 shadow">
// //           <div className="card-body">
// //             <h2 className="card-title">Employer & Signatory</h2>
// //             <label className="text-sm">Employer No. (E)</label>
// //             <input className="input input-bordered" value={employerNo} onChange={e => setEmployerNo(e.target.value)} />
// //             <label className="text-sm mt-2">LHDNM Branch</label>
// //             <input className="input input-bordered" value={lhdnmBranch} onChange={e => setLhdnmBranch(e.target.value)} />
// //             <label className="text-sm mt-2">Serial No.</label>
// //             <input className="input input-bordered" value={serialNo} onChange={e => setSerialNo(e.target.value)} />
// //             <label className="text-sm mt-2">Signatory Name</label>
// //             <input className="input input-bordered" value={signName} onChange={e => setSignName(e.target.value)} />
// //             <label className="text-sm mt-2">Designation</label>
// //             <input className="input input-bordered" value={signDesig} onChange={e => setSignDesig(e.target.value)} />
// //             <label className="text-sm mt-2">Sign Date (dd/mm/yyyy)</label>
// //             <input className="input input-bordered" value={signDate} onChange={e => setSignDate(e.target.value)} />
// //             <label className="label cursor-pointer mt-1">
// //               <span className="label-text">Debug overlay (show field tags)</span>
// //               <input type="checkbox" className="toggle" checked={debug} onChange={e => setDebug(e.target.checked)} />
// //             </label>
// //             <p className="text-xs opacity-70 mt-1">If the text is a bit high/low, enable Debug and nudge the y-values in <code>layoutEA2021</code> by ±5–10.</p>
// //           </div>
// //         </div>

// //         <div className="card bg-base-100 shadow md:col-span-1">
// //           <div className="card-body">
// //             <h2 className="card-title">How this maps</h2>
// //             <ul className="list-disc list-inside text-sm">
// //               <li><b>B1</b> (mock) = sum of <code>gross_salary</code> for the selected month.</li>
// //               <li><b>E1/E2/E3</b> from EPF/SOCSO/EIS employee totals; <b>G1</b> from PCB.</li>
// //               <li><b>F/G/others</b> = 0 in this mock. Replace with real year roll-up later.</li>
// //             </ul>
// //             <p className="text-xs opacity-70 mt-2">
// //               Use LHDN guide notes for exact box logic when you wire the final year-end EA. 
// //             </p>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="overflow-x-auto">
// //         <table className="table">
// //           <thead>
// //             <tr>
// //               <th>Employee</th>
// //               <th className="text-right">Gross (→B1 mock)</th>
// //               <th className="text-right">EPF (E1)</th>
// //               <th className="text-right">SOCSO (E2)</th>
// //               <th className="text-right">EIS (E3)</th>
// //               <th className="text-right">PCB (G1)</th>
// //               <th className="text-right">CP38 (G2)</th>
// //               <th></th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {grouped.map((g) => (
// //               <tr key={g.employeeId}>
// //                 <td>{g.employeeName} <span className="opacity-60">({g.employeeId})</span></td>
// //                 <td className="text-right">{money(g.sums.gross)}</td>
// //                 <td className="text-right">{money(g.sums.epf)}</td>
// //                 <td className="text-right">{money(g.sums.socso)}</td>
// //                 <td className="text-right">{money(g.sums.eis)}</td>
// //                 <td className="text-right">{money(g.sums.pcb)}</td>
// //                 <td className="text-right">{money(g.sums.cp38)}</td>
// //                 <td className="text-right">
// //                   <button className="btn btn-sm" onClick={() => generateEA2021(g)}>
// //                     Generate EA (Pin.2021) PDF
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //             {!loading && grouped.length === 0 && (
// //               <tr>
// //                 <td colSpan={8} className="text-center opacity-70">No data loaded. Fetch a month first.</td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       <p className="text-xs opacity-70">
// //         Template: EA (C.P.8A) – Pin. 2021. Refer to LHDN guide notes for field meanings and exemptions. 
// //       </p>
// //     </div>
// //   );
// // }


// 'use client';

// import React, { useCallback, useMemo, useState, useEffect } from 'react';
// import type { Workbook as ExcelJSWorkbook, Worksheet as ExcelJSWorksheet } from 'exceljs';
// import { API_BASE_URL } from '../../config';
// import { useTheme } from '../../components/ThemeProvider';

// const CONVERTER_URL =
//   process.env.NEXT_PUBLIC_CONVERTER_URL ||
//   `${API_BASE_URL}/api/convert/office-to-pdf`

// // Lazy client libs (avoid SSR issues)
// let ExcelJSPromise: Promise<typeof import('exceljs')> | null = null;//let ExcelJSPromise: Promise<any> | null = null;
// let saveAsPromise: Promise<any> | null = null;

// type PreviewItem = {
//   key: string;
//   sheet: string;
//   address: string;
//   label: string;
//   type: NonNullable<MapRow['type']>; // 'text' | 'number' | 'numeric' | 'date' | 'amount'
//   value: any;
//   formattedValue?: string;
// };


// type MapRow = {
//   key: string;
//   sheet: string;
//   field_address: string;
//   type?: 'text' | 'number' | 'numeric' | 'date' | 'amount';
//   label_text?: string;
//   label_address?: string;
//   write_mode?: 'start' | 'end';
// };

// type DataBag = Record<string, any>;

// const DEFAULT_SAMPLE: DataBag = {
//   'serial_no': 'EA-2025-000123',
//   'employee.tin': 'TIN1234567890',
//   'employee.tine': 'TINE1234567890',
//   'context.year': 2025,
//   'employer.lhdn_branch': 'Kuala Lumpur',
//   'employee.name': 'ALI BIN EXAMPLE',
//   'employee.position': 'Software Engineer',
//   'employee.ic': '900101-14-5678',
//   'employee.passport': 'A12345678',
//   'employee.staff_no': 'EMP-00143',
//   'employee.epf_no': 'EPF123456',
//   'employee.socso_no': 'SOC123456',
//   'employee.num_children_relief': 2,
//   'employment.start_date': '2021-01-05',
//   'employment.end_date': '2025-12-31',
//   'income.gross_salary_incl_ot': 55200,
//   'income.fees_commission_bonus': 8000,
//   'income.tips_perq_awards_allowances_details': 'claims',
//   'income.tips_perq_awards_allowances': 4600,
//   'income.tax_borne_by_employer': 88,
//   'income.esos_benefit': 99,
//   'income.gratuity_period': '2025-07-01',
//   'income.gratuity_period.to': '2025-12-31',
//   'income.gratuity_period.amount': 10,
//   'income.type_of_income_a': 'Arrears of overtime A (2023)',
//   'income.type_of_income_b': 'Arrears of overtime B (2023)',
//   'income.type_of_income_total': 10,
//   'income.benefits_in_kind.specifiy': 'none',
//   'income.benefits_in_kind': 20,
//   'income.value_of_living_accommodation_address': 'none',
//   'income.value_of_living_accommodation': 10,
//   'income.refund_unapproved_fund': 10,
//   'income.compensation_loss_employment': 10,
//   'income.total_employment_income': 59800,
//   'income.pension': 60,
//   'income.Annuities': 560,
//   'deductions.mtd_to_lhdn': 7200,
//   'deductions.cp38_to_lhdn': 120,
//   'deductions.zakat_salary': 130,
//   'deductions.approved_donations_salary': 20,
//   'deductions.total_claim_tp1_relief': 40,
//   'deductions.total_claim_tp1_zakat': 60,
//   'deductions.total': 7200,
//   'contrib.name_provident_fund': 'KWSP (EPF)',
//   'contrib.epf_employee_share': 5940,
//   'contrib.socso_employee_share': 265,
//   'exempt.total_allowances_perq_gifts_benefits': 3300,
//   'employer.name': 'FIN',
//   'employer.position': 'FINANCE MANAGER',
//   'employer.name_address_line1': 'PROSPER NETWORK SDN BHD',
//   'employer.name_address_line2': 'No. 12, Jalan Damai,\n55100 Kuala Lumpur, Malaysia',
//   'employer.phone': '03-1234 5678',
//   'footer.date': '2025-01-31',
// };

// function parseNumericStrict(v: any): number | null {
//   if (v == null) return null;
//   if (typeof v === 'number' && Number.isFinite(v)) return v;
//   const raw = String(v).trim();
//   // remove currency/letters/spaces; keep digits, dot, minus
//   const cleaned = raw.replace(/[^\d.-]/g, '');
//   if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.' ) return null;
//   const num = Number(cleaned);
//   return Number.isFinite(num) ? num : null;
// }

// export default function Page() {
//   // THEME (persisted)
// const { theme, toggleTheme } = useTheme();
// useEffect(() => {
//   if (theme === 'dark') document.documentElement.classList.add('dark');
//   else document.documentElement.classList.remove('dark');
// }, [theme]);


//   // FILE / DATA STATES
//   const [xlsxFile, setXlsxFile] = useState<File | null>(null);
//   const [mapFile, setMapFile] = useState<File | null>(null);
//   const [dataFile, setDataFile] = useState<File | null>(null);
//   const [mapRows, setMapRows] = useState<MapRow[] | null>(null);

//   // UX / LOGGING
//   const [log, setLog] = useState<string[]>([]);
//   const pushLog = useCallback((line: string) => setLog(prev => [...prev, line]), []);
//   const [preview, setPreview] = useState<PreviewItem[]>([]);
//   //const [preview, setPreview] = useState<any[]>([]);
//   const [showPreview, setShowPreview] = useState(false);
//   const [strictNumbers, setStrictNumbers] = useState(true);
//   const [isConverting, setIsConverting] = useState(false);
//   const [isConvertingPdf, setIsConvertingPdf] = useState(false);
//   const isBusy = isConverting || isConvertingPdf;

//   // SAMPLE DATA (hidden panel)
//   const [dataText, setDataText] = useState<string>(JSON.stringify(DEFAULT_SAMPLE, null, 2));
//   const [showDataPanel, setShowDataPanel] = useState(false);

//   // UPLOAD HANDLERS
//   const handleXlsxUpload = useCallback((file: File | null) => {
//     if (!file) { setXlsxFile(null); return; }
//     if (!file.name.match(/\.(xlsx|xls)$/i)) { pushLog('Error: Please select a valid Excel file (.xlsx or .xls)'); return; }
//     setXlsxFile(file); pushLog(`Uploaded template: ${file.name}`);
//   }, [pushLog]);

//   const handleMapUpload = useCallback(async (file: File | null) => {
//     if (!file) { setMapFile(null); setMapRows(null); return; }
//     if (!file.name.match(/\.(json)$/i)) { pushLog('Error: Please select a valid JSON file for field map'); return; }
//     setMapFile(file);
//     try {
//       const text = await file.text();
//       const parsed = JSON.parse(text) as any[];
//       const normalized: MapRow[] = parsed.map((r: any) => ({
//         key: r.key ?? '',
//         sheet: r.sheet ?? 'Sheet1',
//         field_address: r.field_address ?? r.fieldAddress ?? 'A1',
//         type: r.type ?? undefined,
//         label_text: r.label_text ?? r.labelText,
//         label_address: r.label_address ?? r.labelAddress,
//         write_mode: r.write_mode ?? r.writeMode,
//       }));
//       setMapRows(normalized);
//       pushLog(`Uploaded field map: ${file.name} (${normalized.length} entries)`);
//     } catch (err: any) {
//       pushLog(`Error: Failed to parse field map - ${String(err)}`);
//       setMapRows(null);
//     }
//   }, [pushLog]);

//   const handleDataUpload = useCallback(async (file: File | null) => {
//     if (!file) { setDataFile(null); return; }
//     if (!file.name.match(/\.(json)$/i)) { pushLog('Error: Please select a valid JSON file for sample data'); return; }
//     setDataFile(file);
//     try {
//       const text = await file.text();
//       JSON.parse(text);
//       setDataText(text);
//       pushLog(`Uploaded sample data: ${file.name}`);
//       setShowDataPanel(true); // open the panel when user uploads
//     } catch (err: any) {
//       pushLog(`Error: Invalid JSON in sample data - ${String(err)}`);
//     }
//   }, [pushLog]);

//   // VALIDATE
//   const validateData = useCallback(() => {
//     if (!xlsxFile) { pushLog('Error: Please upload an Excel template first.'); return false; }
//     if (!mapFile || !mapRows || mapRows.length === 0) { pushLog('Error: Please upload a valid field map.'); return false; }
//     if (!dataText) { pushLog('Error: Please provide sample data (or keep default).'); return false; }
//     try { JSON.parse(dataText); } catch { pushLog('Error: Sample data is not valid JSON.'); return false; }
//     return true;
//   }, [xlsxFile, mapFile, mapRows, dataText, pushLog]);

//   // PREVIEW
//   const generatePreview = useCallback(async () => {
//     if (!validateData()) return;
//     setLog([]); setPreview([]);
//     if (!ExcelJSPromise) ExcelJSPromise = import('exceljs');
//     try {
//       const { Workbook } = await ExcelJSPromise;
//       const wb = new Workbook();
//       const arrayBuffer = await xlsxFile!.arrayBuffer();
//       await wb.xlsx.load(arrayBuffer);

//       const data: DataBag = JSON.parse(dataText);
//       const writes: PreviewItem[] = [];//const writes: any[] = [];
//       const misses: any[] = [];

//       const getWS1 = (name: string) => {
//         let ws = wb.getWorksheet(name);
//         if (!ws) ws = wb.worksheets.find(w => w.name.toLowerCase() === name.toLowerCase());
//         return ws;
//       };
//       const getWS = (name: string): ExcelJSWorksheet | undefined => {
//   let ws = wb.getWorksheet(name) as ExcelJSWorksheet | undefined;
//   if (!ws) {
//     ws = wb.worksheets.find((w: ExcelJSWorksheet) =>
//       w.name.toLowerCase() === name.toLowerCase()
//     );
//   }
//   return ws;
// };


//       for (const row of mapRows!) {
//         const ws = getWS(row.sheet);
//         if (!ws) { misses.push({ key: row.key, reason: `Sheet not found: ${row.sheet}` }); continue; }
//         if (!Object.prototype.hasOwnProperty.call(data, row.key)) continue;

//         const value = data[row.key];
//         writes.push({
//           key: row.key,
//           sheet: row.sheet,
//           label: row.label_text ?? '',
//           address: row.field_address,
//           type: (row.type ?? 'text') as NonNullable<MapRow['type']>,
//           value,
//           formattedValue:
//             typeof value === 'number'
//               ? new Intl.NumberFormat().format(value)
//               : String(value),
//           // type: row.type ?? 'text',
//           // value,
//           // formattedValue: typeof value === 'number' ? new Intl.NumberFormat().format(value) : String(value)
//         });
//       }
//       setPreview(writes.slice(0, 150));
//       setShowPreview(true);
//       pushLog(`Preview generated. ${writes.length} fields will be filled.`);
//       if (misses.length > 0) pushLog(`Warning: ${misses.length} fields could not be processed.`);
//     } catch (error) {
//       pushLog('Error: Failed to generate preview. Please check your files.');
//       console.error('Preview generation error:', error);
//     }
//   }, [xlsxFile, mapRows, dataText, pushLog, validateData]);

//   // BUILD FILLED WORKBOOK
//   const buildFilledWorkbook = useCallback(async () => {
//     if (!validateData()) throw new Error('Invalid inputs');
//     if (!ExcelJSPromise) ExcelJSPromise = import('exceljs');
//     const { Workbook } = await ExcelJSPromise;
//     const wb: ExcelJSWorkbook = new Workbook();
//     const data: DataBag = JSON.parse(dataText);
//     const workbook = new Workbook();
//     const arrayBuffer = await xlsxFile!.arrayBuffer();
//     await workbook.xlsx.load(arrayBuffer);

//     const misses: any[] = [];
//     const getWS = (name: string) => {
//       let ws = workbook.getWorksheet(name);
//       if (!ws) ws = workbook.worksheets.find(w => w.name.toLowerCase() === name.toLowerCase());
//       return ws;
//     };

//     for (const row of mapRows!) {
//       const ws = getWS(row.sheet);
//       if (!ws) { misses.push({ key: row.key, reason: `Sheet not found: ${row.sheet}` }); continue; }
//       if (!Object.prototype.hasOwnProperty.call(data, row.key)) continue;

//       const cell = ws.getCell(row.field_address);
//       const kind = (row.type || 'text').toLowerCase() as MapRow['type'];
//       const value = data[row.key];

//       if (kind === 'date') {
//         const dt = new Date(value);
//         if (!isNaN(dt.getTime())) { cell.value = dt; if (!cell.numFmt) cell.numFmt = 'DD/MM/YYYY'; }
//         else { misses.push({ key: row.key, reason: `Invalid date: ${String(value)}`, address: row.field_address }); }
//       } else if (kind === 'numeric' || kind === 'number' || kind === 'amount') {
//         const num = parseNumericStrict(value);
//         if (num == null) {
//           if (strictNumbers) {
//             misses.push({ key: row.key, reason: 'Non-numeric for numeric cell', value, address: row.field_address });
//             continue;
//           } else {
//             cell.value = String(value ?? '');
//           }
//         } else {
//           cell.value = num;
//           if (!cell.numFmt) cell.numFmt = '#,##0.00';
//         }
//       } else {
//         cell.value = value == null ? '' : String(value);
//       }
//     }

//     return { workbook, misses };
//   }, [xlsxFile, mapRows, dataText, strictNumbers, validateData]);

//   // EXPORT: EXCEL
//   const downloadExcel = useCallback(async () => {
//     try {
//       setIsConverting(true);
//       setLog([]);
//       const { workbook, misses } = await buildFilledWorkbook();
//       const out = await workbook.xlsx.writeBuffer();
//       const blob = new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       const { saveAs } = await (saveAsPromise || (saveAsPromise = import('file-saver')));
//       saveAs(blob, 'EA-Form-FILLED.xlsx');
//       pushLog(`Success: Excel generated. Skipped ${misses.length} items.`);
//     } catch (err) {
//       pushLog('Error: Failed to generate Excel file.');
//       console.error(err);
//     } finally {
//       setIsConverting(false);
//       setShowPreview(false);
//     }
//   }, [buildFilledWorkbook, pushLog]);

//   // EXPORT: PDF (via converter API)
//   const downloadPdf = useCallback(async () => {
//     try {
//       setIsConvertingPdf(true);
//       setLog([]);

//       const { workbook, misses } = await buildFilledWorkbook();
//       const xlsxBuffer = await workbook.xlsx.writeBuffer();
//       const xlsxBlob = new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

//       const fd = new FormData();
//       fd.append('file', new File([xlsxBlob], 'EA-Form-FILLED.xlsx', { type: xlsxBlob.type }));

//       const r = await fetch(CONVERTER_URL, { method: 'POST', body: fd });
//       if (!r.ok) {
//         // if server returns JSON error
//         let msg = `Converter failed: ${r.status}`;
//         try { const j = await r.json(); if (j?.error) msg = `${msg} - ${j.error}`; } catch {}
//         throw new Error(msg);
//       }

//       const pdfBlob = await r.blob();
//       // Optional: quick proof of producer (LibreOffice)
//       try {
//         const txt = new TextDecoder('latin1').decode(new Uint8Array(await pdfBlob.arrayBuffer()));
//         const prod = txt.match(/\/Producer\s*\((.*?)\)/)?.[1] || txt.match(/\/Creator\s*\((.*?)\)/)?.[1];
//         if (prod) pushLog(`PDF Producer: ${prod}`);
//       } catch {}

//       const url = URL.createObjectURL(pdfBlob);
//       const a = document.createElement('a');
//       a.href = url; a.download = 'EA-Form.pdf';
//       document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();

//       pushLog(`Success: PDF generated. Skipped ${misses.length} items.`);
//     } catch (err: any) {
//       pushLog(`Error: PDF conversion failed. ${err?.message || ''}`);
//       console.error(err);
//     } finally {
//       setIsConvertingPdf(false);
//       setShowPreview(false);
//     }
//   }, [buildFilledWorkbook, pushLog]);

//   // UI SUBCOMPONENTS
//   const UploadPanel = ({ title, accept, onUpload, file, description }: {
//     title: string; accept: string; onUpload: (file: File | null) => void; file: File | null; description: string;
//   }) => (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
//       <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
//       <div className="space-y-4">
//         <label className="flex-1 cursor-pointer block">
//           <input type="file" accept={accept} onChange={(e) => onUpload(e.target.files?.[0] ?? null)} className="sr-only" />
//           <div className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
//             <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
//               <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//             <span className="text-sm text-gray-600 dark:text-gray-400">{description}</span>
//           </div>
//         </label>

//         {file && (
//           <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
//             <div className="flex items-center gap-2">
//               <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//               </svg>
//               <span className="text-sm font-medium text-blue-800 dark:text-blue-200 truncate">{file.name}</span>
//               <span className="text-xs text-blue-600 dark:text-blue-400 ml-auto">{Math.round(file.size / 1024)} KB</span>
//               <button onClick={() => onUpload(null)} className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">Remove</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const downloadSampleData = useCallback(() => {
//     const blob = new Blob([dataText], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a'); a.href = url; a.download = 'sample-data.json';
//     document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
//     pushLog('Downloaded sample data as sample-data.json');
//   }, [dataText, pushLog]);

//   const previewTable = useMemo(() => {
//     if (preview.length === 0) return null;
//     return (
//       <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Preview</h3>
//           <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
//             {preview.length} fields
//           </span>
//         </div>
//         <div className="overflow-auto max-h-96">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Key</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sheet</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cell</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//               {preview.map((w, i) => (
//                 <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                   <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">{w.key}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{w.sheet}</td>
//                   <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">{w.address}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
//                     <span className="inline-block max-w-xs truncate" title={String(w.value)}>
//                       {w.formattedValue || String(w.value)}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-6 flex flex-wrap justify-end gap-3">
//           <button
//             onClick={() => setShowPreview(false)}
//             className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
//           >
//             Close
//           </button>
//           <button
//             onClick={downloadExcel}
//             disabled={isBusy}
//             className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none disabled:opacity-50"
//           >
//             {isConverting ? 'Generating…' : 'Download Excel'}
//           </button>
//           <button
//             onClick={downloadPdf}
//             disabled={isBusy}
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
//           >
//             {isConvertingPdf ? 'Converting…' : 'Download PDF'}
//           </button>
//         </div>
//       </div>
//     );
//   }, [preview, isBusy, isConverting, isConvertingPdf, downloadExcel, downloadPdf]);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
//       {/* HEADER */}
//       <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EA Form Generator</h1>
//           <div className="ml-auto flex items-center gap-2">
//             <button
//               onClick={() => setShowDataPanel(s => !s)}
//               className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
//             >
//               {showDataPanel ? 'Hide Sample Data' : 'Show Sample Data'}
//             </button>
//             <button
//               onClick={generatePreview}
//               disabled={!xlsxFile || !mapFile || !dataText || isBusy}
//               className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
//             >
//               Generate Preview
//             </button>
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
//               aria-label="Toggle theme"
//             >
//               {theme === 'dark' ? (
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//                 </svg>
//               ) : (
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M10 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* MAIN */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Upload grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           <UploadPanel
//             title="Excel Template"
//             accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//             onUpload={handleXlsxUpload}
//             file={xlsxFile}
//             description="Upload your Excel template (.xlsx or .xls)"
//           />
//           <UploadPanel
//             title="Field Map (JSON)"
//             accept=".json,application/json"
//             onUpload={handleMapUpload}
//             file={mapFile}
//             description="Upload field map (map.json)"
//           />
//           <UploadPanel
//             title="Sample Data (optional)"
//             accept=".json,application/json"
//             onUpload={handleDataUpload}
//             file={dataFile}
//             description="Upload sample data (JSON). You can also edit it below."
//           />
//         </div>

//         {/* Options + Activity */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Options */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Options</h2>
//             <div className="flex items-center justify-between">
//               <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Strict numeric mode</div>
//               <div className="relative inline-flex items-center">
//                 <input
//                   id="strictNumbers"
//                   type="checkbox"
//                   checked={strictNumbers}
//                   onChange={(e) => setStrictNumbers(e.target.checked)}
//                   className="sr-only"
//                 />
//                 <div className={`w-10 h-6 rounded-full transition-colors ${strictNumbers ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
//                 <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${strictNumbers ? 'translate-x-4' : ''}`} />
//               </div>
//             </div>
//             <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//               If enabled, any non-numeric in numeric fields will be skipped (cell left blank).
//             </p>

//             <div className="mt-6 flex gap-3">
//               <button
//                 onClick={generatePreview}
//                 disabled={!xlsxFile || !mapFile || !dataText || isBusy}
//                 className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
//               >
//                 Generate Preview
//               </button>
//               <button
//                 onClick={downloadExcel}
//                 disabled={isBusy || !xlsxFile || !mapRows}
//                 className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
//               >
//                 {isConverting ? 'Generating…' : 'Download Excel'}
//               </button>
//               <button
//                 onClick={downloadPdf}
//                 disabled={isBusy || !xlsxFile || !mapRows}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {isConvertingPdf ? 'Converting…' : 'Download PDF'}
//               </button>
//             </div>
//           </div>

//           {/* Activity Log */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Log</h2>
//             <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 h-52 overflow-y-auto">
//               {log.length === 0 ? (
//                 <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">Log messages will appear here</p>
//               ) : (
//                 <div className="space-y-1">
//                   {log.map((line, idx) => (
//                     <div key={idx} className="text-sm font-mono text-gray-700 dark:text-gray-200">{line}</div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Collapsible: Sample Data (optional) */}
//         {showDataPanel && (
//           <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
//             <div className="flex items-center justify-between mb-3">
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sample Data (JSON)</h2>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setDataText(JSON.stringify(DEFAULT_SAMPLE, null, 2))}
//                   className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={downloadSampleData}
//                   className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
//                 >
//                   Download
//                 </button>
//                 <button
//                   onClick={() => setShowDataPanel(false)}
//                   className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
//                 >
//                   Collapse
//                 </button>
//               </div>
//             </div>
//             <textarea
//               value={dataText}
//               onChange={(e) => setDataText(e.target.value)}
//               className="w-full h-64 font-mono text-sm p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
//               spellCheck={false}
//             />
//           </div>
//         )}

//         {/* Preview Section */}
//         {showPreview && previewTable}
//       </main>

//       {/* BLOCKING LOADER OVERLAY (during Excel/PDF export) */}
//       {isBusy && (
//         <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
//           <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-5 shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-3">
//             <svg className="animate-spin h-6 w-6 text-indigo-600" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
//             </svg>
//             <div className="text-sm text-gray-800 dark:text-gray-200">
//               {isConverting ? 'Generating Excel…' : 'Converting to PDF…'} Please wait.
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import type { Workbook as ExcelJSWorkbook, Worksheet as ExcelJSWorksheet } from 'exceljs';
import { useTheme } from '../../components/ThemeProvider';
import { API_BASE_URL } from '../../config';

// Converter API endpoint
const CONVERTER_URL =
  process.env.NEXT_PUBLIC_CONVERTER_URL ||
  `${API_BASE_URL}/api/convert/office-to-pdf`;

// Lazy client libs (avoid SSR issues)
let ExcelJSPromise: Promise<typeof import('exceljs')> | null = null;
let saveAsPromise: Promise<any> | null = null;

type MapRow = {
  key: string;
  sheet: string;
  field_address: string;
  type?: 'text' | 'number' | 'numeric' | 'date' | 'amount';
  label_text?: string;
  label_address?: string;
  write_mode?: 'start' | 'end';
};

type PreviewItem = {
  key: string;
  sheet: string;
  address: string;
  label: string;
  type: NonNullable<MapRow['type']>; // 'text' | 'number' | 'numeric' | 'date' | 'amount'
  value: any;
  formattedValue?: string;
};

type DataBag = Record<string, any>;

const DEFAULT_SAMPLE: DataBag = {
  'serial_no': 'EA-2025-000123',
  'employee.tin': 'TIN1234567890',
  'employee.tine': 'TINE1234567890',
  'context.year': 2025,
  'employer.lhdn_branch': 'Kuala Lumpur',
  'employee.name': 'ALI BIN EXAMPLE',
  'employee.position': 'Software Engineer',
  'employee.ic': '900101-14-5678',
  'employee.passport': 'A12345678',
  'employee.staff_no': 'EMP-00143',
  'employee.epf_no': 'EPF123456',
  'employee.socso_no': 'SOC123456',
  'employee.num_children_relief': 2,
  'employment.start_date': '2021-01-05',
  'employment.end_date': '2025-12-31',
  'income.gross_salary_incl_ot': 55200,
  'income.fees_commission_bonus': 8000,
  'income.tips_perq_awards_allowances_details': 'claims',
  'income.tips_perq_awards_allowances': 4600,
  'income.tax_borne_by_employer': 88,
  'income.esos_benefit': 99,
  'income.gratuity_period': '2025-07-01',
  'income.gratuity_period.to': '2025-12-31',
  'income.gratuity_period.amount': 10,
  'income.type_of_income_a': 'Arrears of overtime A (2023)',
  'income.type_of_income_b': 'Arrears of overtime B (2023)',
  'income.type_of_income_total': 10,
  'income.benefits_in_kind.specifiy': 'none',
  'income.benefits_in_kind': 20,
  'income.value_of_living_accommodation_address': 'none',
  'income.value_of_living_accommodation': 10,
  'income.refund_unapproved_fund': 10,
  'income.compensation_loss_employment': 10,
  'income.total_employment_income': 59800,
  'income.pension': 60,
  'income.Annuities': 560,
  'deductions.mtd_to_lhdn': 7200,
  'deductions.cp38_to_lhdn': 120,
  'deductions.zakat_salary': 130,
  'deductions.approved_donations_salary': 20,
  'deductions.total_claim_tp1_relief': 40,
  'deductions.total_claim_tp1_zakat': 60,
  'deductions.total': 7200,
  'contrib.name_provident_fund': 'KWSP (EPF)',
  'contrib.epf_employee_share': 5940,
  'contrib.socso_employee_share': 265,
  'exempt.total_allowances_perq_gifts_benefits': 3300,
  'employer.name': 'FIN',
  'employer.position': 'FINANCE MANAGER',
  'employer.name_address_line1': 'PROSPER NETWORK SDN BHD',
  'employer.name_address_line2': 'No. 12, Jalan Damai,\n55100 Kuala Lumpur, Malaysia',
  'employer.phone': '03-1234 5678',
  'footer.date': '2025-01-31',
};

function parseNumericStrict(v: any): number | null {
  if (v == null) return null;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const raw = String(v).trim();
  const cleaned = raw.replace(/[^\d.-]/g, '');
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

export default function Page() {
  // Global theme
  const { theme, toggleTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  // Keep <html class="dark"> in sync with 'dark' | 'light' | 'system'
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const compute = () => theme === 'dark' || (theme === 'light' && mq.matches);
    const apply = (val: boolean) => {
      setIsDark(val);
      root.classList.toggle('dark', val);
    };
    apply(compute());
    if (theme === 'light') {
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  // FILE / DATA STATES
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [mapFile, setMapFile] = useState<File | null>(null);
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [mapRows, setMapRows] = useState<MapRow[] | null>(null);

  // UX / LOGGING
  const [log, setLog] = useState<string[]>([]);
  const pushLog = useCallback((line: string) => setLog(prev => [...prev, line]), []);
  const [preview, setPreview] = useState<PreviewItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [strictNumbers, setStrictNumbers] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [isConvertingPdf, setIsConvertingPdf] = useState(false);
  const isBusy = isConverting || isConvertingPdf;

  // SAMPLE DATA (hidden panel)
  const [dataText, setDataText] = useState<string>(JSON.stringify(DEFAULT_SAMPLE, null, 2));
  const [showDataPanel, setShowDataPanel] = useState(false);

  // UPLOAD HANDLERS
  const handleXlsxUpload = useCallback((file: File | null) => {
    if (!file) { setXlsxFile(null); return; }
    if (!file.name.match(/\.(xlsx|xls)$/i)) { pushLog('Error: Please select a valid Excel file (.xlsx or .xls)'); return; }
    setXlsxFile(file); pushLog(`Uploaded template: ${file.name}`);
  }, [pushLog]);

  const handleMapUpload = useCallback(async (file: File | null) => {
    if (!file) { setMapFile(null); setMapRows(null); return; }
    if (!file.name.match(/\.(json)$/i)) { pushLog('Error: Please select a valid JSON file for field map'); return; }
    setMapFile(file);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as any[];
      const normalized: MapRow[] = parsed.map((r: any) => ({
        key: r.key ?? '',
        sheet: r.sheet ?? 'Sheet1',
        field_address: r.field_address ?? r.fieldAddress ?? 'A1',
        type: r.type ?? undefined,
        label_text: r.label_text ?? r.labelText,
        label_address: r.label_address ?? r.labelAddress,
        write_mode: r.write_mode ?? r.writeMode,
      }));
      setMapRows(normalized);
      pushLog(`Uploaded field map: ${file.name} (${normalized.length} entries)`);
    } catch (err: any) {
      pushLog(`Error: Failed to parse field map - ${String(err)}`);
      setMapRows(null);
    }
  }, [pushLog]);

  const handleDataUpload = useCallback(async (file: File | null) => {
    if (!file) { setDataFile(null); return; }
    if (!file.name.match(/\.(json)$/i)) { pushLog('Error: Please select a valid JSON file for sample data'); return; }
    setDataFile(file);
    try {
      const text = await file.text();
      JSON.parse(text);
      setDataText(text);
      pushLog(`Uploaded sample data: ${file.name}`);
      setShowDataPanel(true);
    } catch (err: any) {
      pushLog(`Error: Invalid JSON in sample data - ${String(err)}`);
    }
  }, [pushLog]);

  // VALIDATE
  const validateData = useCallback(() => {
    if (!xlsxFile) { pushLog('Error: Please upload an Excel template first.'); return false; }
    if (!mapFile || !mapRows || mapRows.length === 0) { pushLog('Error: Please upload a valid field map.'); return false; }
    if (!dataText) { pushLog('Error: Please provide sample data (or keep default).'); return false; }
    try { JSON.parse(dataText); } catch { pushLog('Error: Sample data is not valid JSON.'); return false; }
    return true;
  }, [xlsxFile, mapFile, mapRows, dataText, pushLog]);

  // PREVIEW
  const generatePreview = useCallback(async () => {
    if (!validateData()) return;
    setLog([]); setPreview([]);
    if (!ExcelJSPromise) ExcelJSPromise = import('exceljs');
    try {
      const { Workbook } = await ExcelJSPromise;
      const wb: ExcelJSWorkbook = new Workbook();
      const arrayBuffer = await xlsxFile!.arrayBuffer();
      await wb.xlsx.load(arrayBuffer);

      const data: DataBag = JSON.parse(dataText);
      const writes: PreviewItem[] = [];
      const misses: any[] = [];

      const getWS = (name: string): ExcelJSWorksheet | undefined => {
        let ws = wb.getWorksheet(name) as ExcelJSWorksheet | undefined;
        if (!ws) {
          ws = wb.worksheets.find((w: ExcelJSWorksheet) =>
            w.name.toLowerCase() === name.toLowerCase()
          );
        }
        return ws;
      };

      for (const row of mapRows!) {
        const ws = getWS(row.sheet);
        if (!ws) { misses.push({ key: row.key, reason: `Sheet not found: ${row.sheet}` }); continue; }
        if (!Object.prototype.hasOwnProperty.call(data, row.key)) continue;

        const value = data[row.key];
        writes.push({
          key: row.key,
          sheet: row.sheet,
          label: row.label_text ?? '',
          address: row.field_address,
          type: (row.type ?? 'text') as NonNullable<MapRow['type']>,
          value,
          formattedValue:
            typeof value === 'number'
              ? new Intl.NumberFormat().format(value)
              : String(value),
        });
      }
      setPreview(writes.slice(0, 150));
      setShowPreview(true);
      pushLog(`Preview generated. ${writes.length} fields will be filled.`);
      if (misses.length > 0) pushLog(`Warning: ${misses.length} fields could not be processed.`);
    } catch (error) {
      pushLog('Error: Failed to generate preview. Please check your files.');
      console.error('Preview generation error:', error);
    }
  }, [xlsxFile, mapRows, dataText, pushLog, validateData]);

  // BUILD FILLED WORKBOOK
  const buildFilledWorkbook = useCallback(async () => {
    if (!validateData()) throw new Error('Invalid inputs');
    if (!ExcelJSPromise) ExcelJSPromise = import('exceljs');
    const { Workbook } = await ExcelJSPromise;

    const wb: ExcelJSWorkbook = new Workbook();
    const data: DataBag = JSON.parse(dataText);
    const arrayBuffer = await xlsxFile!.arrayBuffer();
    await wb.xlsx.load(arrayBuffer);

    const misses: any[] = [];

    const getWS = (name: string): ExcelJSWorksheet | undefined => {
      let ws = wb.getWorksheet(name) as ExcelJSWorksheet | undefined;
      if (!ws) {
        ws = wb.worksheets.find((w: ExcelJSWorksheet) =>
          w.name.toLowerCase() === name.toLowerCase()
        );
      }
      return ws;
    };

    for (const row of mapRows!) {
      const ws = getWS(row.sheet);
      if (!ws) { misses.push({ key: row.key, reason: `Sheet not found: ${row.sheet}` }); continue; }
      if (!Object.prototype.hasOwnProperty.call(data, row.key)) continue;

      const cell = ws.getCell(row.field_address);
      const kind = (row.type || 'text').toLowerCase();
      const value = data[row.key];

      if (kind === 'date') {
        const dt = new Date(value);
        if (!isNaN(dt.getTime())) {
          cell.value = dt;
          if (!cell.numFmt) cell.numFmt = 'DD/MM/YYYY';
        } else {
          misses.push({ key: row.key, reason: `Invalid date: ${String(value)}`, address: row.field_address });
        }
      } else if (kind === 'numeric' || kind === 'number' || kind === 'amount') {
        const num = parseNumericStrict(value);
        if (num == null) {
          if (strictNumbers) {
            misses.push({ key: row.key, reason: 'Non-numeric for numeric cell', value, address: row.field_address });
            continue;
          } else {
            cell.value = String(value ?? '');
          }
        } else {
          cell.value = num;
          if (!cell.numFmt) cell.numFmt = '#,##0.00';
        }
      } else {
        cell.value = value == null ? '' : String(value);
      }
    }

    return { workbook: wb, misses };
  }, [xlsxFile, mapRows, dataText, strictNumbers, validateData]);

  // EXPORT: EXCEL
  const downloadExcel = useCallback(async () => {
    try {
      setIsConverting(true);
      setLog([]);
      const { workbook, misses } = await buildFilledWorkbook();
      const out = await workbook.xlsx.writeBuffer();
      const blob = new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const { saveAs } = await (saveAsPromise || (saveAsPromise = import('file-saver')));
      saveAs(blob, 'EA-Form-FILLED.xlsx');
      pushLog(`Success: Excel generated. Skipped ${misses.length} items.`);
    } catch (err) {
      pushLog('Error: Failed to generate Excel file.');
      console.error(err);
    } finally {
      setIsConverting(false);
      setShowPreview(false);
    }
  }, [buildFilledWorkbook, pushLog]);

  // EXPORT: PDF (via converter API)
  const downloadPdf = useCallback(async () => {
    try {
      setIsConvertingPdf(true);
      setLog([]);

      const { workbook, misses } = await buildFilledWorkbook();
      const xlsxBuffer = await workbook.xlsx.writeBuffer();
      const xlsxBlob = new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const fd = new FormData();
      fd.append('file', new File([xlsxBlob], 'EA-Form-FILLED.xlsx', { type: xlsxBlob.type }));

      const r = await fetch(CONVERTER_URL, { method: 'POST', body: fd });
      if (!r.ok) {
        let msg = `Converter failed: ${r.status}`;
        try { const j = await r.json(); if (j?.error) msg = `${msg} - ${j.error}`; } catch {}
        throw new Error(msg);
      }

      const pdfBlob = await r.blob();
      try {
        const txt = new TextDecoder('latin1').decode(new Uint8Array(await pdfBlob.arrayBuffer()));
        const prod = txt.match(/\/Producer\s*\((.*?)\)/)?.[1] || txt.match(/\/Creator\s*\((.*?)\)/)?.[1];
        if (prod) pushLog(`PDF Producer: ${prod}`);
      } catch {}

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url; a.download = 'EA-Form.pdf';
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();

      pushLog(`Success: PDF generated. Skipped ${misses.length} items.`);
    } catch (err: any) {
      pushLog(`Error: PDF conversion failed. ${err?.message || ''}`);
      console.error(err);
    } finally {
      setIsConvertingPdf(false);
      setShowPreview(false);
    }
  }, [buildFilledWorkbook, pushLog]);

  // UI SUBCOMPONENTS
  const UploadPanel = ({ title, accept, onUpload, file, description }: {
    title: string; accept: string; onUpload: (file: File | null) => void; file: File | null; description: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      <div className="space-y-4">
        <label className="flex-1 cursor-pointer block">
          <input type="file" accept={accept} onChange={(e) => onUpload(e.target.files?.[0] ?? null)} className="sr-only" />
          <div className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">{description}</span>
          </div>
        </label>

        {file && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200 truncate">{file.name}</span>
              <span className="text-xs text-blue-600 dark:text-blue-400 ml-auto">{Math.round(file.size / 1024)} KB</span>
              <button onClick={() => onUpload(null)} className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">Remove</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const downloadSampleData = useCallback(() => {
    const blob = new Blob([dataText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sample-data.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    pushLog('Downloaded sample data as sample-data.json');
  }, [dataText, pushLog]);

  const previewTable = useMemo(() => {
    if (preview.length === 0) return null;
    return (
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Preview</h3>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
            {preview.length} fields
          </span>
        </div>
        <div className="overflow-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Key</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sheet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cell</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {preview.map((w: PreviewItem, i: number) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">{w.key}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{w.sheet}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">{w.address}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="inline-block max-w-xs truncate" title={String(w.value)}>
                      {w.formattedValue ?? String(w.value)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            onClick={() => setShowPreview(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
          >
            Close
          </button>
          <button
            onClick={downloadExcel}
            disabled={isBusy}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none disabled:opacity-50"
          >
            {isConverting ? 'Generating…' : 'Download Excel'}
          </button>
          <button
            onClick={downloadPdf}
            disabled={isBusy}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          >
            {isConvertingPdf ? 'Converting…' : 'Download PDF'}
          </button>
        </div>
      </div>
    );
  }, [preview, isBusy, isConverting, isConvertingPdf, downloadExcel, downloadPdf]);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      {/* HEADER */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EA Form Generator</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowDataPanel(s => !s)}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {showDataPanel ? 'Hide Sample Data' : 'Show Sample Data'}
            </button>
            <button
              onClick={generatePreview}
              disabled={!xlsxFile || !mapFile || !dataText || isBusy}
              className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Generate Preview
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <UploadPanel
            title="Excel Template"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onUpload={handleXlsxUpload}
            file={xlsxFile}
            description="Upload your Excel template (.xlsx or .xls)"
          />
          <UploadPanel
            title="Field Map (JSON)"
            accept=".json,application/json"
            onUpload={handleMapUpload}
            file={mapFile}
            description="Upload field map (map.json)"
          />
          <UploadPanel
            title="Sample Data (optional)"
            accept=".json,application/json"
            onUpload={handleDataUpload}
            file={dataFile}
            description="Upload sample data (JSON). You can also edit it below."
          />
        </div>

        {/* Options + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Options */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Options</h2>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Strict numeric mode</div>
              <div className="relative inline-flex items-center">
                <input
                  id="strictNumbers"
                  type="checkbox"
                  checked={strictNumbers}
                  onChange={(e) => setStrictNumbers(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${strictNumbers ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${strictNumbers ? 'translate-x-4' : ''}`} />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              If enabled, any non-numeric in numeric fields will be skipped (cell left blank).
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={generatePreview}
                disabled={!xlsxFile || !mapFile || !dataText || isBusy}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                Generate Preview
              </button>
              <button
                onClick={downloadExcel}
                disabled={isBusy || !xlsxFile || !mapRows}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                {isConverting ? 'Generating…' : 'Download Excel'}
              </button>
              <button
                onClick={downloadPdf}
                disabled={isBusy || !xlsxFile || !mapRows}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isConvertingPdf ? 'Converting…' : 'Download PDF'}
              </button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Log</h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 h-52 overflow-y-auto">
              {log.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">Log messages will appear here</p>
              ) : (
                <div className="space-y-1">
                  {log.map((line, idx) => (
                    <div key={idx} className="text-sm font-mono text-gray-700 dark:text-gray-200">{line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible: Sample Data (optional) */}
        {showDataPanel && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sample Data (JSON)</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setDataText(JSON.stringify(DEFAULT_SAMPLE, null, 2))}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Reset
                </button>
                <button
                  onClick={downloadSampleData}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Download
                </button>
                <button
                  onClick={() => setShowDataPanel(false)}
                  className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
                >
                  Collapse
                </button>
              </div>
            </div>
            <textarea
              value={dataText}
              onChange={(e) => setDataText(e.target.value)}
              className="w-full h-64 font-mono text-sm p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview Section */}
        {showPreview && previewTable}
      </main>

      {/* BLOCKING LOADER OVERLAY (during Excel/PDF export) */}
      {isBusy && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-5 shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-3">
            <svg className="animate-spin h-6 w-6 text-indigo-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <div className="text-sm text-gray-800 dark:text-gray-200">
              {isConverting ? 'Generating Excel…' : 'Converting to PDF…'} Please wait.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
